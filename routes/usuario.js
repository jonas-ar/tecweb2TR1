const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const Usuario = require("../database/Usuario");

// Página de registro
router.get("/registrar", (req, res) => {
  res.render("registrar");
});

// Página de login
router.get("/login", (req, res) => {
  res.render("login");
});

// Criar um novo usuário
router.post("/registrar", async (req, res) => {
  const { nome, email, senha } = req.body;
  const salt = bcrypt.genSaltSync(10);
  const senhaHash = bcrypt.hashSync(senha, salt);

  try {
    await Usuario.create({ nome, email, senha: senhaHash });
    res.redirect("/usuario/login");
  } catch (err) {
    res.status(500).send("Erro ao registrar usuário");
  }
});

// Login do usuário
router.post("/login", async (req, res) => {
  const { email, senha } = req.body;

  try {
    const usuario = await Usuario.findOne({ where: { email } });

    if (usuario && bcrypt.compareSync(senha, usuario.senha)) {
      req.session.usuarioId = usuario.id;
      res.redirect("/");
    } else {
      res.status(401).send("Email ou senha incorretos");
    }
  } catch (err) {
    res.status(500).send("Erro ao fazer login");
  }
});

// Logout do usuário
router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

module.exports = router;
