const { authSecret } = require('../.env')
//Uma vez que os dados enviados pelo cliente tenham 
//sido autenticados no servidor, este criará um token JWT
//Método de autenticação entre duas partes
const jwt = require('jwt-simple')
const bcrypt = require('bcrypt-nodejs')

module.exports = app => {
    //Uma função com async eu posso usar o await, 
    //retornando função com  Promise seja tratada como função sincrona 
    const signin = async (req, res) => {
        if (!req.body.email || !req.body.password) {
            return res.status(400).send('Dados incompletos')
        }
        //De forma sicrona o await vai esperar obter os dados do banco
        //E só depois irar continuar com o metodo
        const user = await app.db('users')//estou pegando os usuarios na base
            //Onde o email é o email passado no processo de autenticação
            //passando assim com a função LOWER o texto para minusculo
            .whereRaw("LOWER(email) = LOWER(?)", req.body.email )
            .first()

        if (user) {
            //A senha que recebi na requição vou comparar com a senha 
            //do usuario que está no banco
            //Depois passo uma callback que é uma comparasão assincrona
            bcrypt.compare(req.body.password, user.password, (err, isMatch) => {
                if (err, !isMatch) {
                    return res.status(401).send()
                }

                //caso ele passe no primeiro teste indiaca que deu certo e 
                //ele validou o usuario
                //O payload é o valor que irei amazenar dentro do token
                const payload = { id: user.id }
                res.json({
                    name: user.name,
                    email: user.email,
                    //Com o payload irei gerar o token
                    //assinado com o segredo do authDecret
                    token: jwt.encode(payload, authSecret),

                })

            })
            
        }else {
            res.status(400).send('Usuário não cadastrado!')
        }
    }
    return { signin }
}
