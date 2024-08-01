const express = require("express");
const router = express.Router();
const Pergunta = require("../database/Pergunta");
const Resposta = require("../database/Resposta");
const Usuario = require("../database/Usuario");
const moment = require("moment");
const { Op } = require("sequelize"); // Adicione isto para usar operadores do Sequelize

// método GET para listar todas as perguntas do usuário logado
router.get("/minhas", async (req, res) => {
  if (!req.session.usuarioId) {
    return res.redirect("/usuario/login");
  }

  try {
    let perguntas = await Pergunta.findAll({
      where: { usuarioId: req.session.usuarioId },
      include: [Usuario],
      order: [['createdAt', 'DESC']]
    });

    perguntas = perguntas.map(pergunta => ({
      ...pergunta.dataValues,
      tempo: moment(pergunta.createdAt).fromNow()
    }));

    res.render("minhasPerguntas", { perguntas: perguntas });
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Erro ao listar perguntas.');
    res.redirect("/");
  }
});

// método GET para listar todas as perguntas com detalhes e filtros
router.get("/listar", async (req, res) => {
  const { titulo, descricao, usuario, tempo } = req.query;

  try {
    let whereClause = {};
    let includeClause = [{ model: Usuario }];
    let timeFilter;

    if (titulo) {
      whereClause.titulo = { [Op.like]: `%${titulo}%` };
    }
    if (descricao) {
      whereClause.descricao = { [Op.like]: `%${descricao}%` };
    }
    if (usuario) {
      includeClause[0].where = { nome: { [Op.like]: `%${usuario}%` } };
    }
    if (tempo) {
      const now = moment();
      switch (tempo) {
        case "uma_hora":
          timeFilter = now.subtract(1, "hours");
          break;
        case "um_dia":
          timeFilter = now.subtract(1, "days");
          break;
        case "uma_semana":
          timeFilter = now.subtract(1, "weeks");
          break;
        case "um_mes":
          timeFilter = now.subtract(1, "months");
          break;
        case "um_ano":
          timeFilter = now.subtract(1, "years");
          break;
        default:
          timeFilter = null;
      }
      if (timeFilter) {
        whereClause.createdAt = { [Op.gte]: timeFilter.toDate() };
      }
    }

    let perguntas = await Pergunta.findAll({
      where: whereClause,
      include: includeClause,
      order: [['createdAt', 'DESC']]
    });

    perguntas = perguntas.map(pergunta => ({
      ...pergunta.dataValues,
      tempo: moment(pergunta.createdAt).fromNow()
    }));

    res.render("listarPerguntas", { perguntas: perguntas, titulo, descricao, usuario, tempo });
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Erro ao listar perguntas.');
    res.redirect("/");
  }
});

// método GET para READ (pergunta específica)
router.get("/:id", async (req, res) => {
  try {
    let pergunta = await Pergunta.findOne({
      where: { id: req.params.id },
      include: [Usuario],
    });

    if (pergunta) {
      let respostas = await Resposta.findAll({
        where: { perguntaId: req.params.id },
        include: [Usuario],
        order: [['createdAt', 'DESC']],
      });

      respostas = respostas.map(resposta => ({
        ...resposta.dataValues,
        tempo: moment(resposta.createdAt).fromNow()
      }));

      res.render("resposta", { pergunta, respostas });
    } else {
      req.flash('error_msg', 'Pergunta não encontrada.');
      res.redirect("/");
    }
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Erro ao buscar pergunta.');
    res.redirect("/");
  }
});

// método GET para READ (todas as perguntas)
router.get("/", async (req, res) => {
  try {
    let perguntas = await Pergunta.findAll({
      include: [Usuario],
    });
    res.render("index", { perguntas: perguntas });
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Erro ao listar perguntas.');
    res.redirect("/");
  }
});

// método GET para EDITAR perguntas
router.get("/editar/:id", async (req, res) => {
  if (!req.session.usuarioId) {
    return res.redirect("/usuario/login");
  }

  try {
    let pergunta = await Pergunta.findOne({
      where: { id: req.params.id, usuarioId: req.session.usuarioId },
    });

    if (pergunta) {
      res.render("editarPergunta", { pergunta: pergunta });
    } else {
      req.flash('error_msg', 'Pergunta não encontrada ou você não tem permissão para editá-la.');
      res.redirect("/pergunta/minhas");
    }
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Erro ao buscar pergunta.');
    res.redirect("/pergunta/minhas");
  }
});

// método POST para EDITAR perguntas
router.post("/editar/:id", async (req, res) => {
  if (!req.session.usuarioId) {
    return res.redirect("/usuario/login");
  }

  try {
    let pergunta = await Pergunta.findOne({
      where: { id: req.params.id, usuarioId: req.session.usuarioId },
    });

    if (pergunta) {
      await Pergunta.update(
        { titulo: req.body.titulo, descricao: req.body.descricao },
        { where: { id: req.params.id } }
      );
      req.flash('success_msg', 'Pergunta atualizada com sucesso.');
      res.redirect("/pergunta/minhas");
    } else {
      req.flash('error_msg', 'Pergunta não encontrada ou você não tem permissão para editá-la.');
      res.redirect("/pergunta/minhas");
    }
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Erro ao atualizar pergunta.');
    res.redirect("/pergunta/minhas");
  }
});

// método POST para deletar pergunta
router.post("/deletar/:id", async (req, res) => {
  if (!req.session.usuarioId) {
    return res.redirect("/usuario/login");
  }

  try {
    let pergunta = await Pergunta.findOne({
      where: { id: req.params.id, usuarioId: req.session.usuarioId },
    });

    if (pergunta) {
      await Resposta.destroy({
        where: { perguntaId: req.params.id }
      });

      await Pergunta.destroy({
        where: { id: req.params.id }
      });

      req.flash('success_msg', 'Pergunta deletada com sucesso.');
      res.redirect("/pergunta/minhas");
    } else {
      req.flash('error_msg', 'Pergunta não encontrada ou você não tem permissão para deletá-la.');
      res.redirect("/pergunta/minhas");
    }
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Erro ao deletar pergunta.');
    res.redirect("/pergunta/minhas");
  }
});

// Salvando uma nova pergunta
router.post("/salvar", async (req, res) => {
  const { title, question } = req.body;
  const usuarioId = req.session.usuarioId;

  if (usuarioId) {
    try {
      await Pergunta.create({
        titulo: title,
        descricao: question,
        usuarioId: usuarioId,
      });
      req.flash('success_msg', 'Pergunta criada com sucesso.');
      res.redirect('/');
    } catch (err) {
      console.error(err);
      req.flash('error_msg', 'Erro ao salvar a pergunta.');
      res.redirect('/');
    }
  } else {
    req.flash('error_msg', 'Você precisa estar logado para fazer uma pergunta.');
    res.redirect("/usuario/login");
  }
});

module.exports = router;
