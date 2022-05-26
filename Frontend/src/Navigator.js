import React from 'react'
import {TextInput, Text} from 'react-native'
import { createSwitchNavigator, createAppContainer } from 'react-navigation'
import { createDrawerNavigator } from 'react-navigation-drawer'

import TelaLogin from './screens/TelaLogin'
import TasksTodo from './screens/TasksTodo'

import AuthOrApp from './screens/AuthOrApp'
import Menu from './screens/Menu'
import commonStyles from './commonStyles'

const menuConfig = {
    initialRouteName: 'Today',
    //Componente que vai ter o conteudo do Drawer
    contentComponent: Menu,
    //Opções do conteudo do Drawer
    contentOptions: {
        labelStyle: {
            fontFamily: commonStyles.fontFamily,
            fontWeight: 'normal',
            fontSize: 20
        },
        //Quando estiver com algum item ativo ou selecionado com irei trabalhar o label do item
        activeLabelStyle: {
            color: '#080',
            fontWeight: 'bold',
        }

    }
}

const menuRoutes = {
    Today: {
        name: 'Today',
        screen: props => <TasksTodo title='Hoje' daysAhead = {0} {...props}/>,
        navigationOptions: {
            title: 'Hoje'
        }
    },
    Tomorrow: {
        name: 'Tomorrow',
        screen: props => <TasksTodo title='Amanhã' daysAhead = {1} {...props}/>,
        navigationOptions: {
            title: 'Amanhã'
        }
    },
    Week: {
        name: 'Week',
        screen: props => <TasksTodo title='Semana' daysAhead = {7} {...props}/>,
        navigationOptions: {
            title: 'Semana'
        }
    },
    Month: {
        name: 'Month',
        screen: props => <TasksTodo title='Mês' daysAhead = {30} {...props}/>,
        navigationOptions: {
            title: 'Mês'
        }
    },
    Year: {
        name: 'Year',
        screen: props => <TasksTodo title='Ano' daysAhead = {365} {...props}/>,
        navigationOptions: {
            title: 'Ano'
        }
    }, 
    // ShoppingList: {
    //     name: 'ShoppingList',
    //     screen: props => <TasksTodo title='Lista de Compras' daysAhed = {3} {...props}/>,
    //     navigationOptions: {
    //         title: 'Lista de Compras'
    //     }
    // },
    // NewList: {
    //     name: 'NewList',
    //     screen: props => <TasksTodo title='Nova Lista' daysAhed = {4} {...props}/>,
    //     navigationOptions: {
    //         title: 'Nova Lista'
    //     }
    // },
    // UndatedTasks: {
    //     name: 'Undated Tasks',
    //     screen: props => <TasksTodo title='Tarefas sem data' daysAhed = {5} {...props}/>,
    //     navigationOptions: {
    //         title: 'Tarefas sem data'
    //     }
    // },      
    
}

//A partir do momento que defino as rotas e crio o menuNavigator
//Irei passar o menuNavigator para ser minha home
const menuNavigator =  createDrawerNavigator(menuRoutes, menuConfig)

const mainRoutes = {
    AuthOrApp: {
        name: 'AuthOrApp',
        screen: AuthOrApp
    },
    TelaLogin: {
        name: 'TelaLogin',
        screen: TelaLogin
    },
    Home: {
        name: 'Home',
        screen: menuNavigator
    }
}

const mainNavigator = createSwitchNavigator(mainRoutes, {
    //Passando a rota inicia como parametro
    initialRouteName: 'AuthOrApp'

})

export default createAppContainer(mainNavigator)
