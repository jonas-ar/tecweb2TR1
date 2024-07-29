const express = require("express");
const router = express.Router();
const Pergunta = require("../database/Pergunta");
const Resposta = require("../database/Resposta");
const Usuario = require("../database/Usuario");
const moment = require("moment");

// ler pergunta específica (por ID)
router.get("/:id", async (req, res) => {
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
});

// ler todas as perguntas
router.get("/", async (req, res) => {
  let perguntas = await Pergunta.findAll({
    include: [Usuario],
  });
  res.render("index", { perguntas: perguntas });
});

// editar perguntas
router.put("/:id", async (req, res) => {
  let pergunta = await Pergunta.findOne({
    where: { id: req.params.id, usuarioId: req.session.usuarioId },
  });

  if (pergunta) {
    await Pergunta.update(req.body, { where: { id: req.params.id } });
    res.send("Pergunta atualizada com sucesso");
  } else {
    res.status(404).send("Pergunta não encontrada ou você não tem permissão para editá-la");
  }
});

// deletar perguntas
router.delete("/:id", async (req, res) => {
  let pergunta = await Pergunta.findOne({
    where: { id: req.params.id, usuarioId: req.session.usuarioId },
  });

  if (pergunta) {
    await Pergunta.destroy({ where: { id: req.params.id } });
    res.send("Pergunta deletada com sucesso");
  } else {
    res.status(404).send("Pergunta não encontrada ou você não tem permissão para deletá-la");
  }
});

// salvando uma nova pergunta
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
