const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const session = require("express-session");
const connection = require("./database/database");

const perguntaRouter = require("./routes/pergunta");
const respostaRouter = require("./routes/resposta");
const usuarioRouter = require("./routes/usuario");
const Pergunta = require("./database/Pergunta");
const Usuario = require("./database/Usuario");
const moment = require("moment");

connection
  .authenticate()
  .then(() => {
    console.log("Conexão feita com o banco de dados!");
  })
  .catch((msgErro) => {
    console.log(msgErro);
  });

app.set("view engine", "ejs");
app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(session({
  secret: "sua-chave-secreta",
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Use true se estiver usando HTTPS
}));

app.use(async (req, res, next) => {
  if (req.session.usuarioId) {
    const usuario = await Usuario.findByPk(req.session.usuarioId);
    res.locals.usuario = usuario ? { id: usuario.id, nome: usuario.nome } : null;
  } else {
    res.locals.usuario = null;
  }
  res.locals.moment = moment;
  next();
});

app.get("/", async function (req, res) {
  const perguntas = await Pergunta.findAll({ raw: true, order: [['id', 'DESC']] });
  res.render("index", { perguntas: perguntas });
});

app.get("/perguntar", function (req, res) {
  if (req.session.usuarioId) {
    res.render("perguntar");
  } else {
    res.redirect("/usuario/login");
  }
});

app.use("/pergunta", perguntaRouter);
app.use("/resposta", respostaRouter);
app.use("/usuario", usuarioRouter);

app.listen(4000, () => {
  console.log("App rodando na porta 4000!");
});
