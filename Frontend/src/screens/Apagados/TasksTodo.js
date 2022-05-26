import React, { Component } from 'react'
import { Alert, View, Text, ImageBackground, StyleSheet, FlatList, TouchableOpacity, Platform } from 'react-native'

import Icon from 'react-native-vector-icons/FontAwesome'
import axios from 'axios'
import moment from 'moment'//importando a data de hoje
import 'moment/locale/pt-br'//Traduz o valor das datas
import AsyncStorage from "@react-native-community/async-storage"

import todayImage from '../../assets/imgs/today.jpg'
import tomorrowImage from '../../assets/imgs/tomorrow.jpg'
import weekImage from '../../assets/imgs/week.jpg'
import monthImage from '../../assets/imgs/month.jpg'
import yearImage from '../../assets/imgs/year.jpg'
import shoppingListImage from '../../assets/imgs/shoppingList.jpg'
import newListImage from '../../assets/imgs/newList.jpg'
import undatedTasksImage from '../../assets/imgs/undatedTasks.jpg'

import { server, showError } from '../common'
import commonStyles from '../commonStyles.js'
import Task from '../components/Task'//Usa uma comunicação direta com do pai pata o filho Task
import AddTask from './AddTask'

const initialSate = { 
        //Esse atributo vai ser baseado no estado das showDoneTasks 
        //se estiver verdadeiro ele vai pegar todas as tasks e mostrar
        //Caso esteja falso ele não vai mostrar as tarefas concluidas 
        //ele vai tirar todas as tarefas concluidas
        visibleTasks: [],
        //Criando atributo que vai mostrar ou não as tasks concluídas
        showDoneTasks: true,
        showAddTask: false,
        tasks: []
}

export default class TasksTodo extends Component {
    
     //Criando um estado no componente
     state = {
         //Usuando o operador exprede
        ...initialSate
    }
    //Assim que o componente for montado ou chamado ele vai 
    //restaurar o estado da aplicação baseado no que passei para o setItem
    componentDidMount = async () => {
        //caso recebo uma string irei chamar o JSON
        //Ele vai pegar no AsyncStorage o que foi setado
        const stateString = await AsyncStorage.getItem('tasksState')
        //Caso o JSON receba o parse ele já gera o estado
        //Caso ele não receba um estado valido, passo o estado initialSate
        const saveState = JSON.parse(stateString) || initialSate
        //Vou criar um novo objeto e setando o estado
        //recebendo o estado showDoneTasks apartir do AsyncStorage
        this.setState({
            showDoneTasks: saveState.showDoneTasks
        }, this.filterTasks)

        this.loadTasks()
    }

    //Função responsavel por carregar as tarefas
    loadTasks = async () => {
        try {
            //Constante que vai definir a data maxima
            //No moment ele ira pegar a data atual do dia
            const maxDate = moment()
                //Adicionando uma quantidades de dias de acorda com a propriedade
                //passando um objeto edepois a propriedade do dias a frente
                //Estou colocando data adicional em cima da formatação e passando para servidor
                .add({ days: this.props.daysAhead})
                .format('YYYY-MM-DD 23:59:59')
            //Fazendo a requisição no axios
            //No cod abaixo tenho o server,end point da 
            //tarefa e parametro da Data e recebe a data do dia 
            const res = await axios.get(`${server}/tasks?date=${maxDate}`)
            //Lista das tarefas que foram obtidas do banco de dados
            //E depois passo this.filterTasks para filtrar as tarefas
            //para ele mostrar apenas visiveis
            this.setState({ tasks: res.data }, this.filterTasks)

        } catch(e){
            showError(e)
        }

    }

    //Fazendo a alternancia do valor
    //Sempre qu chamar o metodo ele vai pegar o estado atual e colocar uma negação logica
    //para ele setar no valor, fazendo assim a alternancia do valor seestá verdadeiro fica 
    //falso e se está falso fica verdadeiro
    toggleFilter = () => {
        this.setState({ showDoneTasks: !this.state.showDoneTasks}, this.filterTasks)

    }

    filterTasks = () => {
        let visibleTasks= null
        if(this.state.showDoneTasks) {
            //clonando um array e pegando um array diferente 
            //com os mesmos elementos
            //Com operador spred ele vai espalhar pegando cada um dos elementos do array
            //espalhando e colocando os elementos dentro do array
            visibleTasks = [...this.state.tasks]
        }else {
            //Ele vai retornar as Tarefas que estão pendentes
            const pending = task => task.doneAt === null
            visibleTasks = this.state.tasks.filter(pending)
        }
        //setando no estado
        this.setState({ visibleTasks })
        //Ele vai pegar o estado transforma ele em um string e vai setar no async-storage
        //Essa linha de cod abaixo é a ida dos dados, ou seja, o momento que pego o estado
        //atual da aplicação e quando ouver uma mudança do estado atual ele vai lá 
        //e sobrescreve o item chamado state
        //Ao gravar as tarefas no banco de dados vou gravar só a
        //a parte showDoneTasks no AsyncStorage ao 
        //invés de setar o estado completo vou pegar a informação showDoneTasks
        //salvando o objeto que tenha essa informação AsyncStorage
        AsyncStorage.setItem('tasksState', JSON.stringify({
            showDoneTasks: this.state.showDoneTasks
        }))
    }


    //Logica de alteração da classe, pois essa classe tem o estado
    //Essa função vai receber o id da tarefa
    // Alterar o estado da tarefa se eu estiver concluida ela fica
    // aberta e se tiver aberta ele fica concluida

    toggleTask =  async taskId => {
        // //Todos os elementos com todos os elementos
        // const tasks = [...this.state.tasks]
        // //vou achar qual tarefa tem o mesmo id que eu recebi como parametro
        // tasks.forEach(task => {
        //     if(task.id === taskId) {
        //         //Se tiver setado a data done vou limpar e se ela tiver limpa nula eu coloco uma data nova
        //         task.doneAt = task.doneAt ? null : new Date()
        //     }

        // })
        // //Passando um novo objeto com tasks e passando 
        // //Logo depois o filtro das tarefas para que a tarefa 
        // //que já foi concluida fique oculta.
        // this.setState({ tasks }, this.filterTasks)
        
        try {
            await axios.put(`${server}/tasks/${taskId}/toggle`)
            //feito as alternancias ele retorna o estado mais novo das tarefas
            this.loadTasks()
        } catch(e){
            showError(e)
        }


    }
    //Adicionando uma nova tarefa no array
    //passando por parametro a newTask para modal
    addTask = async newTask => {
        //Se nao estir uma descrição ou vazia e se a descrição não for verdadeira e sem espaços em brancos
        //Ela entra no if.
        if(!newTask.desc || !newTask.desc.trim()) {
            Alert.alert('Dados Inválidos', 'Descrição não informada!')
            return
        }

        // //Gerando um clone das minhas tarefas
        // //Apartir do clone vou adicionar dentro da lista a 
        // //nova tarefa que recebi da função
        // const tasks = [ ...this.state.tasks]
        // //Passando um novo objeto
        // tasks.push({
        //     //ID vai ser temporario só para preenher os requisitos de ter um ID unico por tarefa
        //     id: Math.random(),
        //     desc: newTask.desc,
        //     estimateAt: newTask.date,
        //     doneAt: null

        // })

        // Alterando o estado da tarefa e fechando o modal após criar a tarefa
        // Criado a nova tarefa passo a callback que será chamado depois do estado for atualizado
        // atualizando filterTask 

        try{
            await axios.post(`${server}/tasks`, {
                desc: newTask.desc,
                estimateAt: newTask.date
            })
            //showAddTask: false para sumir o modal
            //this.loadTasks vai chamar as tarefas mais nova e chamas o filter
            this.setState({ showAddTask: false}, this.loadTasks)

        } catch(e){
            showError(e)
        }

    }

    //Método que vai remover  uma tarefa
    deleteTask = async taskId => {
        // //Recebendo cada uma das tarefas e em seguida 
        // //vou filtrar todas as tarefas que tem o id
        // //diferente do id que foi passado
        // //Se o id for diferente do id que foi passado 
        // //essa tarefa vai estar contida em um novo array final
        // //O filter vai criar um novo array diferente do 
        // //array original, ele não vai pegar o array original
        // //e tirar elemento, ele vai gerar um novo array sem o 
        // //elemento que foi filtrado 
        // const tasks = this.state.tasks.filter(task => task.id !== id)
        // //Chamando o setState e passando o array de tarefas
        // //Dessa forma garanto que a tarefa que foi excluida
        // // vai sumir da lista de tarefas atuais
        // this.setState({ tasks }, this.filterTasks)
        try {
            await axios.delete(`${server}/tasks/${taskId}`)
            this.loadTasks()
        } catch(e) {
            showError(e)
        }
    }

    getImage = () => {
        switch(this.props.daysAhead) {
            case 0: return todayImage
            case 1: return tomorrowImage
            case 7: return weekImage
            case 30: return monthImage
            default: return yearImage

        }
    }

    
    getColor = () => {
        switch(this.props.daysAhead) {
            case 0: return commonStyles.colors.today
            case 1: return  commonStyles.colors.tomorrow
            case 7: return  commonStyles.colors.week
            case 30: return  commonStyles.colors.month
            default: return  commonStyles.colors.year

        }
    }



    render() {
        const today = moment().locale('pt-br').format('ddd, D [de] MMM')
        return (
            <View style={styles.container}>
                <AddTask isVisible={this.state.showAddTask} 
                    //Esse metodo vai ser chamado ao clicar na aplicação da tela de tarefas
                    //que está dentro do meu modal
                    onCancel={() => this.setState({showAddTask:false})}
                    onSave={this.addTask}/>
                <ImageBackground source={this.getImage()} 
                    style={styles.background}>
             
                    <View style={styles.titleBar}>
                        <Text style={styles.title}>{this.props.title}</Text>
                        <Text style={styles.subtitle}>{today}</Text>
                    </View>                                                    
                                      
                </ImageBackground>                               
               
                {/* Passando as propriedades para o componente TasksTodo que é o 
                pai passando via props para as tasks uma comunicação direta*/}
                <View style={styles.tasksTodo}>
                    {/* O FlatList está percorrendo um array de objetos javascript 
                    puro sem conexão com algum componente react-native e criando a escrou */}
                    <FlatList data={this.state.visibleTasks} 
                        //Pega a chave gerada a partir de cada um dos itens
                        //Redenrizando cada um dos itens
                        keyExtractor={item => `${item.id}`}
                       // na função render eu recebo o item sendo ele já desestruturado
                       // Pegando cada atributo e passando para a tarefa, como o id, descrição,
                       //data estimada e a data de conclusão
                       //Tendo assim uma comunicação direta, o componente Pai que é TasksTodo passa para
                       //o componente Tasks o componente filho os  parametros que ele quer que seja usado na hora ,
                       //de rederizar cada uma das Tasks. O pai passando via props os parametros para o filho
                       //Sempre que acontecer um evento de delete dentro da tasks nas duas formas de deletar a 
                       //tarefa do lado direito ou esquerdo, ele vai chamar o metodo deleteTasks e a tarefa vai ser excluida
                       
                        renderItem={({item}) => <Task {...item} onToggleTask={this.toggleTask} onDelete={this.deleteTask} />}/>
                </View>
                <ImageBackground style={[
                    styles.barraImageBackground,
                    { backgroundColor: this.getColor()
                    }]}>
                    <View style={styles.iconBar}>
                        {/* Botão para Menu */}
                        <TouchableOpacity onPress={() => this.props.navigation.openDrawer()}>
                            <Icon name='ellipsis-v'
                                size={20} color={commonStyles.colors.secondary}/>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.toggleFilter}>
                            {/* Aqui ele ira fazer uma operação ternaria escolhendo se
                             showDoneTasks estiver true(as tarefas concluidas) ele ira mostrar 'eye'(Olho)
                            se o valor estiver falso ele ira mostrar 'eye-slash'(Olho cortado) */}
                            <Icon name={this.state.showDoneTasks ? 'eye' : 'eye-slash'}
                                size={20} color={commonStyles.colors.secondary}/>
                        </TouchableOpacity>
                    </View>

                </ImageBackground>

                {/*Botão adicionando uma tarefa*/}
                <TouchableOpacity style={[
                    styles.addButton,
                    { backgroundColor: this.getColor()
                    }]}
                    //Botão ao clicar fica com um cor opaca
                    activeOpacity={0.7}
                    //Quando clicarmos no botão o onPress vai alterar o estado do atributo
                    onPress={() => this.setState({ showAddTask: true })}>
                    <Icon name="plus" size={25}
                        color={commonStyles.colors.secondary}/>
                </TouchableOpacity>
                           
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        //Permitindo que o componente cresça 100% da tela
        flex: 1
    },
    background: {
        flex: 1
    },  
    tasksTodo: {
        flex: 10
    },
    barraImageBackground: {
        justifyContent: 'flex-end', 
        width: 414,
        height: 43, 
        borderStyle: "solid"               
    },
    titleBar: {
        flex: 1,
        justifyContent: 'flex-end'        
    },
    title: {
        fontFamily: commonStyles.fontFamily,
        color: '#FFFF',
        fontSize: 45,
        marginLeft: 20,        
        marginBottom: -5,        
        
    },
    subtitle: {
        fontFamily: commonStyles.fontFamily,
        color: '#FFFF',
        fontSize: 20,
        marginLeft: 20,
        marginBottom: 7
    },
    iconBar: {
        flexDirection: 'row',
        marginHorizontal: 15,
        marginVertical: 15,        
        justifyContent: 'space-between',
        // Nesse caso se for IOS ele vai dar um margiTop 40 e se for android ele da um marginTop 10 
        marginTop: Platform.OS === 'ios' ? 40 : 10
    },
    addButton: {
        position: 'absolute',
        marginHorizontal: 190,
        bottom: 10,
        backgroundColor: commonStyles.colors.today,
        justifyContent: 'center',
        alignItems: 'center'
    }
 

})