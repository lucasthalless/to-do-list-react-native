import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import PushNotification from "react-native-push-notification"
import GlobalStyle from '../utils/GlobalStyle';

export default function Splash({ navigation }) {

    useEffect(() => {
        createChannels();
        setTimeout(() => {
            navigation.replace('My Tasks');
        }, 2000);
    }, [])
    
    const createChannels = () => {
        PushNotification.createChannel(
            {
                channelId: "task-channel",
                channelName: "Task Channel",
            }
        )
    }

    return(
        <View style = { styles.body } >
            <Image
                style = { styles.logo }
                source = {require('../../assets/checklist.png')}
                resizeMode = 'contain'
            />
            <Text
             style = {[ 
                 GlobalStyle.CustomFont,
                 styles.text
             ]}
            >
                To-Do List
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    body:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    logo:{
        width: 230,
        height: 140,
        marginBottom: 25,
    },
    text:{
        fontSize:40,
        color: '#080808',
    },
    input:{
        fontSize:20,
        marginTop:10,
        marginBottom:10,
        width:300,
        borderBottomWidth:1,
        borderColor:'#d5d5d5',
    },
})