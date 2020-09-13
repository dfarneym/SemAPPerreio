//Acessando app e cadastrando as rotas
module.exports = app => {
    //Rota para cadastro
    app.post('/signup', app.api.user.save)
    //Rota para o login
    app.post('/signin', app.api.auth.signin)

}