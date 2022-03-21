import AsyncStorage from '@react-native-async-storage/async-storage';
import CheckBox from '@react-native-community/checkbox';
import React, { useEffect } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, FlatList, ToastAndroid, Alert } from 'react-native'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useSelector, useDispatch } from 'react-redux';
import { setTaskID, setTasks } from '../redux/actions';

export default function ToDo({ navigation }) {

    const {tasks} = useSelector(state => state.taskReducer)
    const dispatch = useDispatch();

    useEffect(() => {
        getTasks();
    }, [])

    const getTasks = () => {
        AsyncStorage.getItem('Tasks')
            .then(tasks => {
                const parsedTasks = JSON.parse(tasks);
                if(parsedTasks && typeof parsedTasks === 'object'){
                    dispatch(setTasks(parsedTasks))
                }
            })
            .catch(err=>console.log(err))
    }

    const deleteTask = (id) => {
        const filteredTask = tasks.filter(task => task.ID !== id)
        AsyncStorage.setItem('Tasks', JSON.stringify(filteredTask))
        .then(()=>{
            dispatch(setTasks(filteredTask))
            ToastAndroid.show('Task deleted successfully.', ToastAndroid.SHORT)
        })
        .catch(err => console.log(err))
    }

    const checkTask = (id, newValue) => {
        const index = tasks.findIndex(task=>task.ID === id)
        if(index > -1){
            let newTasks = [...tasks];
            newTasks[index].Done = newValue;
            AsyncStorage.setItem('Tasks', JSON.stringify(newTasks))
            .then(() => {
                dispatch(setTasks(newTasks));
                ToastAndroid.show('Task state is changed.', ToastAndroid.SHORT)
            })
            .catch(err=>console.log(err))
        }
    }

    return (
        <View style={styles.body}>
            <FlatList
                data={tasks.filter(task => task.Done === false)}
                renderItem={({ item }) => (
                    <TouchableOpacity 
                    style={styles.item}
                    onPress={()=>{
                        dispatch(setTaskID(item.ID))
                        navigation.navigate('Task')
                    }}
                    >
                        <View style={styles.item_row}>
                            <View
                                style={[
                                    {
                                        backgroundColor:
                                        item.Color === 'red' ? '#f28b82':
                                        item.Color === 'blue' ? '#aecbfa':
                                        item.Color === 'green' ? '#ccff90':
                                        '#fff'
                                    },
                                    styles.color
                                ]}
                            />
                            <CheckBox
                                value={item.Done}
                                onValueChange ={(newValue)=>{checkTask(item.ID,newValue)}}
                            />
                            <View style={styles.item_body}>
                                <Text 
                                style={styles.title}
                                numberOfLines={1}
                                >
                                    {item.title}
                                </Text>
                                <Text 
                                style={styles.subtitle}
                                numberOfLines={1}
                                >
                                    {item.Desc}
                                </Text>
                            </View>
                            <TouchableOpacity 
                            style={styles.delete}
                            onPress={()=>{
                                deleteTask(item.ID);
                            }}
                            >
                                <FontAwesome5
                                    name={'trash'}
                                    size={25}
                                    color={'#da4d3b'}
                                />
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                )}
                keyExtractor={(item, index)=>index.toString()}
            />
            <TouchableOpacity
                style={styles.button}
                onPress={()=>{
                    dispatch(setTaskID(tasks.length + 1))
                    navigation.navigate('Task')
                }}
            >
                <FontAwesome5
                    name = {'plus'}
                    size = {20}
                    color = {'#ffffff'}
                />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    body:{
        flex: 1
    },
    button:{
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#262835',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 10,
        right: 10,
        elevation: 5,
    },
    item_row:{
        flexDirection: 'row',
        alignItems: 'center'
    },
    item_body:{
        flex: 1,

    },
    item:{
        marginHorizontal: 10,
        marginVertical: 7,
        paddingRight: 10,
        backgroundColor: '#fff',
        elevation: 3,
    },
    title:{
        color: '#000',
        fontSize: 26,
        margin: 5,
        fontWeight: 'bold',
    },
    subtitle:{
        color: '#000',
        fontSize: 20,
        margin: 5,
    },
    delete:{
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    color:{
        width: 20,
        height: 100,
    }

})
