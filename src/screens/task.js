import React, { useState, useEffect } from 'react'
import { Alert, Modal, StyleSheet, Text, ToastAndroid, TouchableOpacity, View, Image, ScrollView } from 'react-native'
import { TextInput } from 'react-native-gesture-handler';
import CustomButton from '../utils/customButton';
import { useSelector, useDispatch } from 'react-redux';
import { setTasks } from '../redux/actions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CheckBox from '@react-native-community/checkbox';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import PushNotification from 'react-native-push-notification';
import RNFS from 'react-native-fs'

export default function task({ navigation }) {

    const {tasks, taskID} = useSelector(state => state.taskReducer)
    const dispatch = useDispatch();
    
    const [title, setTitle] = useState('')
    const [desc, setDesc] = useState('')
    const [done, setDone] = useState('')
    const [color, setColor] = useState('white')
    const [showBellModal, setShowBellModal] = useState(false)
    const [bellTime, setBellTime] = useState('1')
    const [image, setImage] = useState('')
    
    useEffect(() => {
        navigation.addListener('focus', () => {
            getTask()
        })
        getTask()
    }, [])

    const getTask = () => {
        const Task = tasks.find(task=>task.ID === taskID)
        if(Task){
            setTitle(Task.title)
            setDesc(Task.Desc)
            setDone(Task.Done)
            setColor(Task.Color)
            setImage(Task.Image)
        }
    }

    const setTask = () => {
        if(title.length == 0){
            Alert.alert('Warning!', 'Please write your task title.')
        }else{
            try {
                var Task = {
                    ID: taskID,
                    title: title,
                    Desc: desc,
                    Done: done,
                    Color: color,
                    Image: image
                }
                const index = tasks.findIndex(task=>task.ID===taskID)
                let newTasks = [];
                if (index > -1){
                    newTasks = [...tasks];
                    newTasks[index] = Task
                }else{
                    newTasks = [...tasks, Task];
                }
                AsyncStorage.setItem('Tasks', JSON.stringify(newTasks))
                .then(() => {
                    dispatch(setTasks(newTasks));
                    ToastAndroid.show('Task saved successfully.', ToastAndroid.SHORT)
                    navigation.goBack()
                })
                .catch(err=>console.log(err))
            } catch (error) {
                console.log(error)
            }
        }
    }

    const setTaskAlarm = () => {
        PushNotification.localNotificationSchedule({
            channelId:'task-channel',
            title: title,
            message: desc,
            date: new Date(Date.now()+parseInt(bellTime)*60*1000),
            allowWhileIdle: true,
        })
    }

    const deleteImage = () => {
        RNFS.unlink(image)
        .then(()=>{
            const index = tasks.findIndex(task => task.ID === taskID)
            if (index > -1) {
                let newTasks = [...tasks];
                newTasks[index].Image = '';
                AsyncStorage.setItem('Tasks', JSON.stringify(newTasks))
                .then(()=>{
                    dispatch(setTasks(newTasks))
                    getTask()
                    ToastAndroid.show('Task image removed.', ToastAndroid.SHORT)
                })
                .catch(err=>console.log(err))
            }
        })
        .catch(err=>console.log(err))
    }

    return (
        <ScrollView>
            <View style={styles.body}>
            <Modal
            visible={showBellModal}
            transparent
            onRequestClose={() => setShowBellModal(false)}
            // animationType='slide'
            hardwareAccelerated
            >
                <View style={styles.centered_view}>
                    <View style={styles.bellModal}>
                        <View style={styles.bellBody}>
                            <Text style={styles.text}>Remind me After</Text>
                            <TextInput
                                style={styles.bellInput}
                                keyboardType = 'numeric'
                                value={bellTime}
                                onChangeText={(value)=>setBellTime(value)}
                            />
                            <Text style={styles.text}>minute(s)</Text>
                        </View>
                        <View style={styles.bellButtons}>
                            <TouchableOpacity
                                style={styles.bellCancelButton}
                                onPress={()=>{setShowBellModal(false)}}
                            >
                                <Text style={styles.text}>cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.bellOkButton}
                                onPress={()=>{
                                    setShowBellModal(false)
                                    setTaskAlarm();
                                }}
                            >
                                <Text style={styles.text}>ok</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            <TextInput
                value={title}
                style={styles.input}
                placeholder='Title'
                onChangeText={(value)=>setTitle(value)}
            />
            <TextInput
                value={desc}
                style={styles.input}
                placeholder='Description'
                multiline
                onChangeText={(value)=>setDesc(value)}
            />
            <View style={styles.color_bar}>
                <TouchableOpacity 
                style={styles.color_white}
                onPress={()=>{ setColor('white') }}
                >
                    {color === 'white' &&
                        <FontAwesome5
                            name = {'check'}
                            size = {25}
                            color = {'#000'}
                        />
                    }
                </TouchableOpacity>
                <TouchableOpacity 
                style={styles.color_red}
                onPress={()=>{ setColor('red') }}
                
                >
                    {color === 'red' &&
                        <FontAwesome5
                            name = {'check'}
                            size = {25}
                            color = {'#000'}
                        />
                    }
                </TouchableOpacity>
                <TouchableOpacity 
                style={styles.color_blue}
                onPress={()=>{ setColor('blue') }}
                
                >
                    {color === 'blue' &&
                        <FontAwesome5
                            name = {'check'}
                            size = {25}
                            color = {'#000'}
                        />
                    }
                </TouchableOpacity>
                <TouchableOpacity 
                style={styles.color_green}
                onPress={()=>{ setColor('green') }}
                
                >
                    {color === 'green' &&
                        <FontAwesome5
                            name = {'check'}
                            size = {25}
                            color = {'#000'}
                        />
                    }
                </TouchableOpacity>
            </View>
            <View style={styles.extra_row}>
                <TouchableOpacity
                    style={styles.extra_button}
                    onPress={() => { setShowBellModal(true) }}
                >
                    <FontAwesome5
                        name={'bell'}
                        size={25}
                        color={'#fff'}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.extra_button}
                    onPress={() => { navigation.navigate('Camera', { id:taskID }) }}
                >
                    <FontAwesome5
                        name={'camera'}
                        size={25}
                        color={'#fff'}
                    />
                </TouchableOpacity>
            </View>
            {image?
                <View>
                    <Image
                        style={styles.image}
                        source={{ uri: image }}
                    />
                    <TouchableOpacity
                        style={styles.delete}
                        onPress={() => { deleteImage() }}
                    >
                        <FontAwesome5
                            name={'trash'}
                            size={25}
                            color={'#da4d3b'}
                        />
                    </TouchableOpacity>
                </View> 
                :
                null
            }
            <View style={styles.checkbox}>
                <CheckBox
                    value = {done}
                    onValueChange={(newValue)=>setDone(newValue)}
                />
                <Text style={styles.text}>
                    Is Done
                </Text>
            </View>
            <CustomButton
                title='Save Task'
                color='#262835'
                androidRipple = '#46495b'
                onPressFunction={setTask}
            />
        </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    body:{
        flex: 1,
        alignItems: 'center',
        padding: 10,
    },
    input:{
        width: '100%',
        fontSize:20,
        marginTop:10,
        marginBottom:10,
        paddingHorizontal: 15,
        borderBottomWidth:1,
        borderColor:'#d5d5d5',
    },
    checkbox:{
        flexDirection: 'row',
        margin: 10,
    },
    text:{
        fontSize: 20,
        color: '#000',
    },
    color_bar:{
        flexDirection: 'row',
        height: 50,
        borderWidth: 2,
        borderColor: 'transparent',
        marginVertical: 10,
    },
    color_white:{
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    color_red:{
        flex: 1,
        backgroundColor: '#f28b82',
        justifyContent: 'center',
        alignItems: 'center',
    },
    color_blue:{
        flex: 1,
        backgroundColor: '#aecbfa',
        justifyContent: 'center',
        alignItems: 'center',
    },
    color_green:{
        flex: 1,
        backgroundColor: '#ccff90',
        justifyContent: 'center',
        alignItems: 'center',
    },
    extra_row:{
        flexDirection: 'row',
        marginVertical: 10,
    },
    extra_button:{
        flex: 1,
        height: 50,
        backgroundColor: '#262835',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 5,
        borderRadius: 5,
    },
    centered_view:{
        flex: 1,
        backgroundColor:'#00000066',
        justifyContent: 'center',
        alignItems: 'center',
    },
    bellModal:{
        width: 300,
        height: 200,
        backgroundColor: '#fff',
        borderRadius: 5
    },
    bellBody:{
        height: 150,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bellButtons:{
        flexDirection: 'row',
        height: 50
    },
    bellInput:{
        width:50,
        borderBottomWidth: 1,
        borderColor:'#d5d5d5',
        textAlign: 'center',
        fontSize: 20,
        margin: 10
    },
    bellCancelButton:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderTopWidth: 1,
        borderRightWidth: .5,
        // backgroundColor: '#f8f8f8',
        borderColor: '#555',
        borderBottomLeftRadius: 5,
    },
    bellOkButton:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderTopWidth: 1,
        // borderLeftWidth: .5,
        // backgroundColor: '#f8f8f8',
        borderColor: '#555',
        borderBottomRightRadius: 5,
    },
    image:{
        width: 300,
        height: 300,
        margin: 20,
        borderRadius: 5
    },
    delete:{
        width: 50,
        height: 50,
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        right: 20,
        bottom: 20,
        backgroundColor: '#ffffff80',
        margin: 10,
        borderRadius: 5,
    }
})
