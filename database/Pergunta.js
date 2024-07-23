const Sequelize = require("sequelize");
const connection = require("./database");

const Pergunta = connection.define('pergunta',{//Isso vai criar a tabela "Pergunta" no banco de dados
    titulo:{
        type: Sequelize.STRING,
        allowNull: false
    },
    descricao:{
        type: Sequelize.TEXT,
        allowNull: false
    }
});

Pergunta.sync({force: false}).then(()=>{
    console.log("Tabela criada!")
})