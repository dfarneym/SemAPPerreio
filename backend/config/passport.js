const { authSecret } = require('../.env')
const passport = require('passport')
const passportJwt = require('passport-jwt')
const { Strategy, ExtractJwt } = passportJwt

//O ExtractJwt ira ler a informação da autorização do Token
//E a Strategy é para fazer a validação
module.exports = app => {
    const params = {
        secretOrKey: authSecret,//informando o authSecret e sabendo onde o JWt está na requisição ele vai fazer a validação
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    }
    //Se estiver ok a validação ele entra na estrategia
    //ele pega o usuario e caso o usuario não venha ele retorna false
    //caso retorne algum erro provávelmente ele esta com problema no banco de dados
    //no final ele retorna um objeto com o initialize e o authenticate
    //Definindo a estrategia
    const strategy = new Strategy(params, (payload, done) => {
        //Acessando tabela users
        app.db('users')
            //Fazendo uma consulta e trazendo o usuario pelo id
            .where({ id: payload.id })
            //pego o primeiro usuario
            .first()
            //se ele obter o usuario
            .then(user => {
                //Ele vai entrar nessa função já com usuario carregado
                if (user) {
                    done(null, { id: user.id, email: user.email })
                    //Quando o passport deixa você passar ele vai continuar 
                    //a requisição e vai colocar dentro do request o usuario que vovê digitou e
                    //ele vai ter acesso tanto ao nome e ao email do usuario
                } else {
                    //se o usuario veio vazio ele cai no else e você não se autenticou e ele vai barrar a entrada
                    done(null, false)
                }
            })//caso aja um erro no banco de dados ele cai no catch
            .catch(err => done(err, false))
            //Nesse caso ouvi erro e vo passou o erro e não autenticou o usuario
    })

    passport.use(strategy)
    //Retorna um objeto
    // esse dois atributos irão servir para fazer a autenticação
    return {
        initialize: () => passport.initialize(),
        authenticate: () => passport.authenticate('jwt', { session: false }),
        //não estamos se baseando em sessão, não existe uma sessão envolvida na geração do token 
    }
}
