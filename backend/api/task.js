const moment = require('moment')

//module.exports recebendo app e retornando uma função middleware
//Atribuindo a data passada pela requisição ou ela pega a data de hoje 
module.exports = app => {
    const getTasks = (req, res) => {
        const date = req.query.date ? req.query.date
            : moment().endOf('day').toDate()

        //O proprio passport vai colocar dentro da
        //requisição o usuario a partir do token e o usuario vai ter id em cima daquilo
        //que você colocou lá na parte do passaport
        //Ele interpreta o token e pega o pyload e do pyload ele pega o id do usuario
        //consulta ele na base de dados e joga o usuario na requisição
        app.db('tasks')
            //Filtrei tadas as tarefas por usuario
            .where({ userId: req.user.id })
            //Fazendo agora outro where com as datas estimadas
            //Filtrei tadas as tarefas pela data estimadas sendo elas menores da data que calculei
            .where('estimateAt', '<=', date)
            //ordenai pela data estimada
            .orderBy('estimateAt')
            //passar todas as tarefas para json
            .then(tasks => res.json(tasks))
            //se cair no catch é porque deu erro de cliente e não de servidor
            .catch(err => res.status(400).json(err))
    }

    const save = (req, res) => {
        //Se a descrição não estiver presente
        if (!req.body.desc.trim()) {
            //Sendo que quem não mandou a requisição foi o cliente
            return res.status(400).send('Descrição é um campo obrigatório')
        }
        //No body é onde tem as informações que vou pesistir no banco
        //Pegando assim um usuario que vem atraves do token
        req.body.userId = req.user.id

        //fazendo a inserção
        app.db('tasks')
            .insert(req.body)
            .then(_ => res.status(204).send())
            .catch(err => res.status(400).json(err))
    }

    const remove = (req, res) => {
        app.db('tasks')
            //Só irei poder excluir a tarefa se for usuario 
            //do usuário que estiver logado, ou seja com o mesmo Id.
            .where({ id: req.params.id, userId: req.user.id })
            .del()
            //O then ira mostrar a quantidades de linha deletadas
            .then(rowsDeleted => {
                if (rowsDeleted > 0) {
                    res.status(204).send()
                } else {
                    const msg = `Não foi encontrada task com id ${req.params.id}.`
                    res.status(400).send(msg)
                }
            })
            .catch(err => res.status(400).json(err))
    }

    //Esse método vai alternar o estado da propriedade DonAt,
    //sendo data de conclusão vai ser alternada de acordo com 
    //aquilo que for passado como parametro 
    const updateTaskDoneAt = (req, res, doneAt) => {
        app.db('tasks')
            .where({ id: req.params.id, userId: req.user.id })
            .update({ doneAt })
            .then(_ => res.status(204).send())
            .catch(err => res.status(400).json(err))
    }

    const toggleTask = (req, res) => {
        app.db('tasks')
            .where({ id: req.params.id, userId: req.user.id })
            .first()
            .then(task => {
                if (!task) {
                    const msg = `Task com id ${req.params.id} não encontrada.`
                    return res.status(400).send(msg)
                }
                //Se chegou nesse ponto a tarefa existe, se o task.doneAt estiver setado vou alterna-lo para ficar nulo
                //Ou seja eu zero a data ou coloco new Date invertendo o que estava antes
                const doneAt = task.doneAt ? null : new Date()
                updateTaskDoneAt(req, res, doneAt)
            })
            //Se chegou aqui é por deu algum erro
            .catch(err => res.status(400).json(err))
    }

    return { getTasks, save, remove, toggleTask }
}