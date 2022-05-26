import React, { Component } from 'react'
import { View, ActivityIndicator, StyleSheet } from 'react-native'

import axios from 'axios'
import AsyncStorage from '@react-native-community/async-storage'
import { showError } from '../common'

export default class AuthOrApp extends Component {
    //Dentro do ciclo de vida AuthOrApp
    
    async componentDidMount() {
        //Para poder ele esperar e ir para proxima linha depois que 
        //o userDataJson estiver pronto preciso do await e metodo tem que ser assincrono
        //2º) AsyncStorage está pegando o dado do usuario
        const userDataJson = await AsyncStorage.getItem('userData')
        let userData = null 

        try {
            //3º)Faço um parser no JSON e gero um userData
            userData = JSON.parse(userDataJson)

        } catch(e){
            //Se cair no catch o userData está invalido
            
        }
        
        //userData e userData.token estiverem setados
        //Irei entrar na parte que vai setar o token no headers do axios para sempre que na proxima requisição
        //dentro do autorization está o token e irei navegar para tela de home
        if (userData && userData.token){
            //4º)Verifico se o objeto tem token e se tiver token coloco no
            // header do Authorization para fazer as proximas requisições
            axios.defaults.headers.common['Authorization'] = `bearer ${userData.token}`
            //5º)E em seguida navego para tela principal
            this.props.navigation.navigate('Home', userData)
        }//Caso contrario
        else{
            //Se não estiver o token  e os dados do usuario ele ira  para tela de atenticação
            this.props.navigation.navigate('TelaLogin')

        }

    }

    render() {
        return (
            <View style={styles.container}>
                {/* 1º) O componente vai ser montado */}
                <ActivityIndicator size='large'/>
            </View>
        )
    }
} 

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000'
    }
})