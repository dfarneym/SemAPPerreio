import React from 'react'
import { Platform, ScrollView, View, Text, StyleSheet, TouchableOpacity }from 'react-native'
import { DrawerItems } from 'react-navigation-drawer'
import { Gravatar } from 'react-native-gravatar'
import commonStyles from '../commonStyles'

import axios from 'axios'
import AsyncStorage from '@react-native-community/async-storage'
import Icon from 'react-native-vector-icons/FontAwesome'

export default props => {
    {/* Fazendo a implementação do Logout */}
    const logout = () => {
        //Limpando o autorization, o token, o local storage e o header do axios
        delete axios.defaults.headers.common['Authorization']
        AsyncStorage.removeItem('userData')
        //Se o usuário acabou de se logar ele 
        //vai pode deslogar e voltar para tela de login
        props.navigation.navigate('AuthOrApp')

    }
    
    return (
        <ScrollView style={styles.scrollViewStyle}>
            {/* Informações do usuario Logado, colocando email do usuário, 
            nome do usuário, gravatar do usuario  */}
            <View style={styles.header}>
                <Text style={styles.title}>Sem APPerreio</Text>
                <Gravatar style={styles.avatar} 
                    //Dentro de options crio um objeto
                    options={{
                        email: props.navigation.getParam('email'),
                        secure: true
                    }}/>
                {/* Mostrando as informações de usuário*/}
                <View style={styles.userInfo}>
                    <Text style={styles.name}>
                        {props.navigation.getParam('name')}
                    </Text>
                    <Text style={styles.email}>
                        {props.navigation.getParam('email')}
                    </Text>
                </View>
                {/* Criando o icone e o toque no botão Logout */}
                <TouchableOpacity onPress={logout}>
                    <View style={styles.logoutIcon}>
                        <Icon name='sign-out' size={30} color='#191970'/>
                    </View>
                </TouchableOpacity>
            </View>
            {/* Usando o operador expred e passando a props como parametro*/}
            <DrawerItems {...props} />
        </ScrollView>
    )

}

const styles = StyleSheet.create({
    header: {
        borderBottomWidth: 1,
        borderColor: '#DDD',
    },
    scrollViewStyle: {
        backgroundColor: '#FFF',
        
    },
    title: {
        color: '#000',
        fontFamily: commonStyles.fontFamily,
        fontSize: 30,
        padding: 10,
        marginTop: Platform.OS === 'ios' ? 70 : 10

    },
    avatar: {
        width: 60,
        height: 60,
        borderWidth: 3,
        borderRadius: 30,
        margin: 10        

    },
    userInfo: {
        marginLeft: 10
    },
    name: {
        fontFamily: commonStyles.fontFamily,      
        fontSize: 20,
        color: commonStyles.colors.mainText,
        marginBottom: 5
        

    },
    email: {
        fontFamily: commonStyles.fontFamily,
        fontSize: 15,
        color: commonStyles.colors.subText,
        marginBottom: 10
    },
    logoutIcon: {
        marginLeft: 10,
        marginBottom: 10

    }

})