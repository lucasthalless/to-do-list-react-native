import AsyncStorage from '@react-native-async-storage/async-storage';
import CheckBox from '@react-native-community/checkbox';
import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity, FlatList, ToastAndroid, Alert } from 'react-native'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useSelector, useDispatch } from 'react-redux';
import { setTaskID, setTasks } from '../redux/actions';

export default function done({ navigation }) {

    const {tasks} = useSelector(state => state.taskReducer)
    const dispatch = useDispatch();

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
                data={tasks.filter(task => task.Done === true)}
                renderItem={({ item }) => (
                    <TouchableOpacity 
                    style={styles.item}
                    onPress={()=>{
                        dispatch(setTaskID(item.ID))
                        navigation.navigate('Task')
                    }}
                    >
                        <View style={styles.item_row}>
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
        </View>
    )
}

const styles = StyleSheet.create({
    body:{
        flex: 1
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
        paddingHorizontal: 10,
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
    }

})
