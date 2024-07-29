const Sequelize = require("sequelize");
const connection = require("./database");
const Usuario = require("./Usuario");

const Pergunta = connection.define("pergunta", {
  titulo: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  descricao: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  usuarioId: {
    type: Sequelize.INTEGER,
    references: {
      model: Usuario,
      key: 'id',
    },
    allowNull: false,
  },
});

Usuario.hasMany(Pergunta, { foreignKey: 'usuarioId' });
Pergunta.belongsTo(Usuario, { foreignKey: 'usuarioId' });

Pergunta.sync({ force: false }).then(() => {
  console.log("Tabela de perguntas atualizada!");
});

module.exports = Pergunta;
