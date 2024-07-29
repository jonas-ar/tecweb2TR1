const express = require("express");
const router = express.Router();

const Pergunta = require("../database/Pergunta");

// metodo GET para READ (pergunta especifica)
router.get("/:id", async (req, res) => {
  let pergunta = await Pergunta.findOne({
    where: { id: req.params.id },
  });

  pergunta
    ? res.send(pergunta)
    : res.status(404).send("Pergunta não encontrada");
});

// metodo GET para READ (todas as perguntas)
router.get("/", (req, res) => {
  res.render("index");
});

// metodo POST para CREATE (salvar perguntas)
router.post("/", (req, res) => {
  let titulo = req.body.titulo;
  let descricao = req.body.descricao;

  Pergunta.create({
    titulo: titulo,
    descricao: descricao,
  });

  res.send("Pergunta salva com sucesso!");
});

// metodo PUT para UPDATE (editar perguntas)
router.put("/", (req, res) => {
  res.send("NAO IMPLEMENTADO");
});

// metodo DELETE para DELETE (deletar perguntas)
router.delete("/", (req, res) => {
  res.send("NAO IMPLEMENTADO");
});

router.get("/", (req, res) => {
  res.render("perguntar");
});

router.post("/salvar", (req, res) => {
  var titulo = req.body.titulo;
  var descricao = req.body.descricao;

  Pergunta.create({
    titulo: titulo,
    descricao: descricao
  }).then(()=> {
    res.redirect('/');
  })
});

module.exports = router;