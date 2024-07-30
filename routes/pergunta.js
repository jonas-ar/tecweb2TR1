const express = require("express");
const router = express.Router();
const Pergunta = require("../database/Pergunta");
const Resposta = require("../database/Resposta");
const Usuario = require("../database/Usuario");
const moment = require("moment");

// listar todas as perguntas com detalhes
router.get("/listar", async (req, res) => {
  try {
    let perguntas = await Pergunta.findAll({
      include: [Usuario],
      order: [['createdAt', 'DESC']]
    });

    perguntas = perguntas.map(pergunta => ({
      ...pergunta.dataValues,
      tempo: moment(pergunta.createdAt).fromNow()
    }));

    res.render("listarPerguntas", { perguntas: perguntas });
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao listar perguntas");
  }
});

// ler todas as perguntas
router.get("/", async (req, res) => {
  try {
    let perguntas = await Pergunta.findAll({
      include: [Usuario],
    });
    res.render("index", { perguntas: perguntas });
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao listar perguntas");
  }
});

// ler pergunta específica
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
      res.status(404).send("Pergunta não encontrada");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao buscar pergunta");
  }
});


// editar perguntas
router.put("/:id", async (req, res) => {
  try {
    let pergunta = await Pergunta.findOne({
      where: { id: req.params.id, usuarioId: req.session.usuarioId },
    });

    if (pergunta) {
      await Pergunta.update(req.body, { where: { id: req.params.id } });
      res.send("Pergunta atualizada com sucesso");
    } else {
      res.status(404).send("Pergunta não encontrada ou você não tem permissão para editá-la");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao atualizar pergunta");
  }
});

// deletar perguntas
router.delete("/:id", async (req, res) => {
  try {
    let pergunta = await Pergunta.findOne({
      where: { id: req.params.id, usuarioId: req.session.usuarioId },
    });

    if (pergunta) {
      await Pergunta.destroy({ where: { id: req.params.id } });
      res.send("Pergunta deletada com sucesso");
    } else {
      res.status(404).send("Pergunta não encontrada ou você não tem permissão para deletá-la");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao deletar pergunta");
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
      res.redirect('/');
    } catch (err) {
      console.error(err);
      res.status(500).send("Erro ao salvar a pergunta");
    }
  } else {
    res.status(401).send("Você precisa estar logado para fazer uma pergunta");
  }
});

module.exports = router;
