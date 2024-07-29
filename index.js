const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");

const perguntaRouter = require("./routes/pergunta");
const Pergunta = require("./database/Pergunta");
const { where } = require("sequelize");

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

app.get("/", function (req, res) {
  Pergunta.findAll({raw: true, order: [
    ['id', 'DESC']
  ]}).then(pergunta=> {
    res.render("index", {
      pergunta: pergunta
    })
  })
});

// metodo POST para CREATE (salvar perguntas)
app.post("/salvarpergunta", (req, res) => {
  var titulo = req.body.titulo;
  var descricao = req.body.descricao;

  Pergunta.create({
    titulo: titulo,
    descricao: descricao
  }).then(()=> {
    res.redirect('/');
  })
});

app.use("/perguntar", perguntaRouter);

app.listen(4000, () => {
  console.log("App rodando!");
});