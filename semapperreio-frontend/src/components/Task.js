import React from 'react'
import { View, Text, StyleSheet, TouchableWithoutFeedback,TouchableOpacity } from 'react-native'

import Icon from 'react-native-vector-icons/FontAwesome'
import Swipeable from 'react-native-gesture-handler/Swipeable'

import moment from 'moment'
import 'moment/locale/pt-br'

import commonStyles from '../commonStyles'

export default props => {
     
    //Determinando se a tarefa está concluida ou não
    const doneOrNotStyle = props.doneAt != null ?
        //Se a tarefa está concluida ele vai passar um traço no texto
        //se não ele vai aplicar um estilo vazio
        {textDecorationLine: 'line-through' } : {}
    //Data de conclusão para uma tarefa concluida e uma data estimada para uma tarefa não concluida
    const date = props.doneAt ? props.doneAt : props.estimateAt
    const formatedDate = moment(date).locale('pt-br')
        .format('ddd, D [de] MMMM')
    
    const getRightContent = () => {
        return (
            <TouchableOpacity style={styles.right}
                //Se props.onDelete estiver setado 
                //Ai que vou chamar o props.onDelete(id)
                //para só ai clicar atraves do TouchableOpacity
                //no botão da lixeira e apagar a tarefa 
                onPress={() => props.onDelete && props.onDelete(props.id)}>
                <Icon name="trash" size={25} color = '#FFF' />
            </TouchableOpacity>
        )
    }

    const getLeftContent = () => {
        return (
            <View style={styles.left}>
                <Icon name="trash" size={20} color = '#FFF'
                style={styles.excludeIcon}/>
                <Text style={styles.excludeText}>Excluir</Text>
            </View>
        )
    }
    return (
        <Swipeable
            renderRightActions={getRightContent}
            renderLeftActions={getLeftContent} 
            //Quando o lado Left o usuario abrir vai disparar o evento de exclusão
            onSwipeableLeftOpen ={() => props.onDelete && props.onDelete(props.id) }>        
            <View style={styles.container}>
                {/* Região que pode ser tocada */}
            <TouchableWithoutFeedback
            //Passando o Id do elemento que vai ser clicado atravez de uma função callback
            //Quando o usuário clicar ele vai chamar essa função que ele espera ter recebido via props
            //Ele passa o ID do elemento que está sendo clicado e a função no Pai é chamada
            //Essa é a comunicação indireta quando você passa via propriedade uma função para filho
            //e o componente filho chama essa função comunicando com o pai de forma indireta a partir de uma função callback
                    onPress={() => props.onToggleTask(props.id)}>         
                    <View style={styles.checkContainer}>
                        {getCheckView(props.doneAt)}
                    </View>
            </TouchableWithoutFeedback>           
            
                <View>
                    {/* Descrição da tarefa */}
                    <Text style={[styles.desc, doneOrNotStyle]}>{props.desc}</Text>
                    {/* Estimativa da tarefa pronta */}
                    <Text style={styles.date}>{formatedDate}</Text>

                    {/* Quando a tarefa for concluída
                    <Text>{props.doneAt + ""}</Text>
                    */}
                </View>                
            </View>
        </Swipeable>
    )
}

function getCheckView(doneAt) {
    if(doneAt != null) {
        return (
            <View style={styles.done}>
                <Icon name='check' size={20} color='#FFF'></Icon>
            </View>
        )
    } else {
        return (
            <View style={styles.pending}></View>

        )
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12 ,
        backgroundColor: 'rgba(0,0,0,0.7)',
        marginVertical: 8,
        marginHorizontal:10 ,
        borderRadius: 15,
        
    },
    checkContainer: {
        width: '20%',
        alignItems: 'center',
        justifyContent: 'center'

    },
    pending: {
        height: 25,
        width: 25,
        borderRadius: 13,
        borderWidth: 1,
        borderColor: '#C0C0C0'
    },
    done: {
        height: 25,
        width: 25,
        borderRadius: 13,
        backgroundColor: '#87CEFA',
        alignItems: 'center',
        justifyContent: 'center'
    },
    desc: {
        fontFamily: 'Helvetica, sans-serif',
        color: '#FFF',
        fontSize: 15
    },
    date: {
        fontFamily: commonStyles.fontFamily,
        color: '#FFF',
        fontSize: 12
    },
    right: {
        backgroundColor: 'rgba(0,0,0,0.7)',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        
    }, 
    left: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        flexDirection: 'row',
        alignItems: 'center',              

    },
    excludeIcon: {
        marginLeft: 10
    },
    excludeText: {
        fontFamily: commonStyles.fontFamily,
        color: '#FFF',
        fontSize: 20,
        margin: 10,

    }


})
