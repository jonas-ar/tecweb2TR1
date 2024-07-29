const Sequelize = require("sequelize");
const connection = require("./database");
const Usuario = require("./Usuario");
const Pergunta = require("./Pergunta");

const Resposta = connection.define("resposta", {
  conteudo: {
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
  perguntaId: {
    type: Sequelize.INTEGER,
    references: {
      model: Pergunta,
      key: 'id',
    },
    allowNull: false,
  },
});

Usuario.hasMany(Resposta, { foreignKey: 'usuarioId' });
Pergunta.hasMany(Resposta, { foreignKey: 'perguntaId' });
Resposta.belongsTo(Usuario, { foreignKey: 'usuarioId' });
Resposta.belongsTo(Pergunta, { foreignKey: 'perguntaId' });

Resposta.sync({ force: false }).then(() => {
  console.log("Tabela de respostas criada!");
});

module.exports = Resposta;
