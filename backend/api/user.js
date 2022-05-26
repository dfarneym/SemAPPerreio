const bcrypt = require('bcrypt-nodejs')

module.exports = app => {
    //Esta função ira gerar o hash para 
    const obterHash = (password, callback) => {
        //o salt é o valor de entrada para gerar um numero aleatorio para hash
        //Com é gerado o hash ele não é capaz de voltar para senha do usuario, ou seja, apartir de uma unica senha
        //posso ter diferentes hash's.
        //Ao se logar o usuario tem um hash no banco que é diferente do hash gerado, 
        //Só que atravez do algoritmo ele sabe que os dois hash's foram gerados apartir de uma mesma origem, 
        //sendo assim ele valida a senha ou não.
        //Usando a função do bcrypt.
        bcrypt.genSalt(10, (err, salt) => {
            //quando o hash for gerado ele ira chamar o função callback
            bcrypt.hash(password, salt, null, (err, hash) => callback(hash))

        })
    }

    //Método middleware que ira salvar um usuario no banco de dados
    const save = (req, res) => {
        //Obtendo o hash em cima da senha que usuario informou
        obterHash(req.body.password, hash => {
            //com o hash gerado nunca salvo a senha no body da requição, a que o usuario digitou, 
            //mais sim o hash calculado usando a senha que o usuario digitou
            //Eu nunca salvo a senha nua e sim o hash
            const password = hash

            app.db('users')
                .insert({ 
                    name: req.body.name,
                    email: req.body.email.toLowerCase(),
                    password
                })
                .then(_ => res.status(204).send())
                .catch(err => res.status(400).json(err))


        })
    }

    return { save }
}