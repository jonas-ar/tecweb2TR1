const express = require("express");
const router = express.Router();
const Resposta = require("../database/Resposta");
const Usuario = require("../database/Usuario");
const Pergunta = require("../database/Pergunta");

//criar uma nova resposta
router.post("/salvar", async (req, res) => {
  const { conteudo, perguntaId } = req.body;
  const usuarioId = req.session.usuarioId;

  if (usuarioId) {
    try {
      await Resposta.create({
        conteudo: conteudo,
        usuarioId: usuarioId,
        perguntaId: perguntaId,
      });
      res.redirect(`/pergunta/${perguntaId}`);
    } catch (err) {
      console.error(err);
      res.status(500).send("Erro ao salvar a resposta");
    }
  } else {
    res.status(401).send("Você precisa estar logado para responder uma pergunta");
  }
});

module.exports = router;
