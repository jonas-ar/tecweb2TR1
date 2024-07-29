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

// metodo PUT para UPDATE (editar perguntas)
router.put("/", (req, res) => {
  res.send("NAO IMPLEMENTADO");
});

// metodo DELETE para DELETE (deletar perguntas)
router.delete("/", (req, res) => {
  res.send("NAO IMPLEMENTADO");
});

/// método get para a seção de perguntas
router.get("/", (req, res) => {
  res.render("perguntar");
});


module.exports = router;