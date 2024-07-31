const Sequelize = require('sequelize')

const connection = new Sequelize('guiaperguntas','root','',{
    host: "localhost",
    dialect: "mysql"
});

connection
  .authenticate()
  .then(() => {
    console.log('Conexão feita com o banco de dados!');
  })
  .catch((err) => {
    console.error('Não foi possível conectar ao banco de dados:', err);
  });

module.exports = connection;