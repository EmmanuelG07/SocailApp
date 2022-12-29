import React from 'react';
import {View, Text, Button, TouchableOpacity, StyleSheet} from 'react-native';
import {windowHeight} from '../utils/Dimension';



const FormButton = ({buttonTitle, ...rest}) => {
    return(
        <TouchableOpacity style={styles.buttonContainer} {...rest} >
        <Text style={styles.buttonText}>{buttonTitle}</Text>
        </TouchableOpacity>
    );
};



const styles = StyleSheet.create({
    buttonContainer: {
        marginTop: 10,
        width: '100%',
        height: windowHeight / 15,
        backgroundColor: '#2e64e5',
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 3,

    },
    buttonText: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#fff',
        
        
    }

})

export default FormButton;


