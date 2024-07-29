const Sequelize = require("sequelize");
const connection = require("./database");

const Usuario = connection.define("usuario", {
  nome: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  senha: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

Usuario.sync({ force: false }).then(() => {
  console.log("Tabela de usuários criada!");
});

module.exports = Usuario;
