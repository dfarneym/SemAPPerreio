const bodyParser = require('body-parser')
const cors = require('cors')//O cors ele habilita requisições de origens diferentes ex:outras Urls
//Recebendo app como parametro
module.exports = app => {
    //O BodyParser vai poder interpretar qualquer json ue venha no body da requisição
    app.use(bodyParser.json())
    app.use(cors({
        //Qualquer origem
        origin: '*'
    }))
}