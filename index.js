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

app.get("/perguntar", function (req, res) {
  res.render("perguntar");
});

app.use("/pergunta", perguntaRouter);

app.listen(4000, () => {
  console.log("App rodando!");
});