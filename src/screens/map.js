import React from 'react'
import { View, StyleSheet, Text } from 'react-native'
import MapView from 'react-native-maps';
import GlobalStyle from '../utils/GlobalStyle'

export default function Map({ route }){

    const { city, lat, lng } = route.params;

    return(
        <View style={styles.body}>
            <Text style={[
                GlobalStyle.CustomFont,
                styles.text
                ]}>
                {city}
            </Text>
            <MapView
            style={styles.map}
            initialRegion={{
                latitude: lat,
                longitude: lng,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    body:{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    text:{
      fontSize: 40,
      margin: 10,
    },
    map: {
        width: '100%',
        height: '100%',
    }
})