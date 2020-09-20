const moment = require('moment')

//module.exports recebendo app e retornando uma função middleware
//Atribuindo a data passada pela requisição ou ela pega a data de hoje 
module.exports = app => {
    const getTasks = (req, res) => {
        const date = req.query.date ? req.query.date
            : moment().endOf('day').toDate()
        
        app.db('tasks')
            //O proprio passport vai colocar dentro da
            //requisição o usuario a partir do token e o usuario vai ter id em cima daquilo
            //que você colocou lá na parte do passaport
            //Ele interpreta o token e pega o pyload e do pyload ele pega o id do usuario
            //consulta ele na base de dados e joga o usuario na requisição
            .where({ userId: req.user.id})//Filtrei tadas as tarefas por usuario
            //Fazendo agora outro where com as datas estimadas
            .where('estimateAt', '<=', date) //Filtrei tadas as tarefas pela data estimadas sendo elas menores da data que calculei
            .orderBy('estimateAt')//ordenai pela data estimada
            .then(taks => res.json(taks))//passar todas as tarefas para json
            .catch(err => res.status(400).json(err))//se cair no catch é porque deu erro de cliente e não de servidor

    }
    const save = (req, res) => {
        //Se a descrição não estiver presente
        if (!req.body.desc.trim) {
            return res.status(400).send('A descrição é um erro obrigatório')//Sendo que quem não mandou a requisição foi o cliente
        }
        //No body é onde tem as informações que vou pesistir no banco
        //Pegando assim um usuario que vem atraves do token
        req.body.userId = req.user.id

        //fazendo a inserção

        app.db('tasks')
            .insert(req.body)
            .then(_ => res.status(204).send())
            .catch(err => res.status(400).json)
    }

    const remove = (req, res) => {
        app.db('tasks')
            //Só irei poder excluir a tarefa se for usuario 
            //do usuário que estiver logado, ou seja com o mesmo Id.
            .where({id: req.params.id, userId: req.user.id})
            .del()
            //O then ira mostrar a quantidades de linha deletadas
            .then(rowDeleted => {
                if (rowDeleted > 0) {
                    res.status(204).send()
                } else {
                    const msg = `Não foi encontrada task com Id ${req.params.id}.`
                    res.status(400).send(msg)
                }

            })
            //Caso der alguma mensagen via json alguma mensagem que caiu no catch
            .catch(err => res.status(400).json(err))
    }

    //Esse método vai alternar o estado da propriedade DonAt,
    //sendo data de conclusão vai ser alternada de acordo com 
    //aquilo que for passado como parametro 
    const updateTaskDoneAt = (re, res, doneAt) => {
        app.db('tasks')
            .where({ id: req.params.id, userId: req.user.id })
            
    }
}