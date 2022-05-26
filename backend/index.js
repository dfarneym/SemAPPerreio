const express = require('express')
const app = express()
const db = require('./config/db')
const consign = require('consign')
var port = process.env.PORT || 3005;

//tendo assim acesso ao knex e todas as suas funções
app.db = db

// consign para facilitar na comunicação dos modulos
//Sempre que o consign for carregar ele vai passar o app como parametro para todos os modulos do consign
consign()
    .include('./config/passport.js')
    .then('./config/middlewares.js')
    .then('./api')
    .then('./config/routes.js')
    .into(app)

//Serviço para atender URL's, chamando a função middleware
//que funciona  como uma camada oculta de tradução, 
//permitindo a comunicação e o gerenciamento de dados 
//para aplicativos distribuídos
// app.get('/', (req, res) => {
//     res.status(200).send('Meu Backend!')
// })

app.listen(port, () => {
    console.log('Backend executando....')
})


