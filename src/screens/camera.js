import React from 'react'
import { View, StyleSheet, Text, ToastAndroid } from 'react-native'
import { RNCamera } from 'react-native-camera'
import { useCamera } from 'react-native-camera-hooks'
import CustomButton from '../utils/customButton';
import { useSelector, useDispatch } from 'react-redux';
import { setTasks } from '../redux/actions';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Camera({ navigation, route }){

    const [{cameraRef}, {takePicture}] = useCamera(null);
    const {tasks} = useSelector(state => state.taskReducer)
    const dispatch = useDispatch();

    const captureHandle = async () => {
        try {
            const data = await takePicture()
            const filePath = data.uri
            updateTask(route.params.id, filePath)
        } catch (error) {
            console.log(error)
        }
    }

    const updateTask = (id, path) => {
        const index = tasks.findIndex(task => task.ID === id)
        if (index > -1) {
            let newTasks = [...tasks];
            newTasks[index].Image = path;
            AsyncStorage.setItem('Tasks', JSON.stringify(newTasks))
            .then(()=>{
                dispatch(setTasks(newTasks))
                ToastAndroid.show('Task image is saved.', ToastAndroid.SHORT)
                navigation.goBack()
            })
            .catch(err=>console.log(err))
        }
    }

    return(
        <View style={styles.body}>
            <RNCamera
                ref={cameraRef}
                type={RNCamera.Constants.Type.back}
                style={styles.preview}
            >
                <CustomButton
                    title="Capture"
                    color='#262835'
                    androidRipple = '#46495b'
                    onPressFunction={() => captureHandle()}
                />
            </RNCamera>
        </View>
    )
}

const styles = StyleSheet.create({
    body:{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    preview:{
        flex:1,
        alignContent: 'center',
        justifyContent: 'flex-end',
    },
})