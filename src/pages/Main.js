import React, { useEffect, useState } from 'react'
import { StyleSheet, Image, View, Text, TextInput, TouchableOpacity } from 'react-native'
import MapView, { Marker, Callout } from 'react-native-maps'
import { requestPermissionsAsync, getCurrentPositionAsync } from 'expo-location'
import { MaterialIcons } from '@expo/vector-icons'
import api from '../services/api'

function Main({ navigation }) {
   const [currentRegion, setCurrentRegin] = useState(null)
   const [devs, setDevs] = useState([])

    useEffect(() => {
        async function loadInitialPosition() {
           const { granted } = await requestPermissionsAsync()

           if (granted) {
               const { coords } = await getCurrentPositionAsync({
                   enableHighAccuracy: true,
               })
            
               const { latitude, longitude } = coords

               setCurrentRegin({
                   latitude,
                   longitude,
                   latitudeDelta: 0.04,
                   longitudeDelta: 0.04,
               })
           }
        }

        loadInitialPosition()
    })
    async function loadDevs() {
        const { latitude, longitude } = currentRegion

        const response = await api.get('/search', {
            params: {
                latitude,
                longitude,
                techs: 'NodeJs'
            }
        })

        setDevs(response.data.devs)
    }

    function handleRegionChaged(region) {
        setCurrentRegin(region)
    }

    if (!currentRegion) {
        return null
    }
    return (
            <>
            <MapView onRegionChangeComplete={handleRegionChaged} initialRegion={currentRegion} style={styles.map}>
                {devs.map(devs => (
                    <Marker key={devs._id} coordinate={{ latitude: devs.location.coordinates[1], longitude: devs.location.coordinates[0]}}>
                    <Image style={styles.avatar} source={{ uri: devs.avatar_url}} />
                    <Callout onPress={() => {
                        navigation.navigate('Profile', { github_username: devs.github_username})
                    }}>
                        <View style={styles.callout}>
                            <Text style={styles.devname}>{devs.name}</Text>
                            <Text style={styles.devbio}>{devs.bio}</Text>
                            <Text style={styles.devtechs}>{devs.techs.join(', ')}</Text>
                        </View>
                    </Callout>
                </Marker>
                ))}
            </MapView>
            <View style={styles.searchFrom}>
                <TextInput 
                    style={styles.searchInput} 
                    placeholder="Buscar devs por tecnologia..."
                    placeholderTextColor= "#999"
                    autoCapitalize="words"
                    autoCorrect={false}
                />
                <TouchableOpacity onPress={loadDevs} style={styles.loadButton}>
                    <MaterialIcons style={{ color: "#FFF" }} name="gps-not-fixed" size={20} />
                </TouchableOpacity>
            </View>
            </>
            )
}

const styles = StyleSheet.create({
    map: {
        flex: 1
    },
    avatar: {
        width: 54,
        height: 54,
        borderRadius: 26,
        borderWidth: 4,
        borderColor: '#DDD',
    },
    callout: {
        width: 260,
    },
    devname: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    devbio: {
        color: '#666',
        marginTop: 5,
    },
    devtechs: {
        marginTop: 5,
    },
    searchFrom: {
        position: 'absolute',
        top: 20,
        left: 20,
        right: 20,
        zIndex: 5,
        flexDirection: 'row',
    },
    searchInput: {
        flex: 1,
        height: 50,
        backgroundColor: '#FFF',
        color: '#333',
        borderRadius: 25,
        paddingHorizontal: 20,
        fontSize: 16,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: {
            width: 4,
            height: 4,
        },
        elevation: 2,
    },
    loadButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#8E4Dff',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 15,
    }
})

export default Main