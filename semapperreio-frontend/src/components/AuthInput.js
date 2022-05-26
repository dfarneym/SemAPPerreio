import React from 'react'
import { View, TextInput, StyleSheet } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'

//Responsavel por encapsular o input dentro da tela de autenticação/Login
export default props => {
    return (
        <View style={[styles.container, props.style]}>
            <Icon name={props.icon} size={20} style={styles.icon} />
            {/* Pegando as propriedades e setando dentro de TextInput */}
            <TextInput {...props} style={styles.input}  />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {  
        width: '100%',
        height: 40,
        backgroundColor:'#EEE',
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center'        
    },
    icon: {
        color: '#333',
        marginLeft: 20
    },
    input: {
        marginLeft: 20,
        width: '70%'
    }
})

