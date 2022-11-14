import { Image, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useState, useEffect } from 'react'
import axios from 'axios'

const SpecReport = ({ route }) => {
    const [id, setId] = useState()
    const [date, setDate] = useState()
    const [location, setLocation] = useState()
    const [description, setDescription] = useState()
    const [image, setImage] = useState()
    const [animalStatus, setAnimalStatus] = useState()
    const [status, setStatus] = useState()
    const URL = 'https://fair-cyan-chimpanzee-yoke.cyclic.app/'

    const getReport = async () => {
        try {
            const { data } = await axios.get(`${URL}api/admins/getReports/${route.params.id}`)
            setId(data._id)
            setDate(data.date)
            setLocation(data.location)
            setDescription(data.description)
            setImage(data.image)
            setAnimalStatus(data.animalStatus)
            setStatus(data.status)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getReport()
    }, [route])

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView style={{ flex: 1, backgroundColor: 'white', paddingTop: 45, paddingBottom: 25 }}>

                <Text style={styles.label}>Date Submitted: <Text style={styles.headValue}>{date}</Text></Text>
                <Text style={styles.label}>Report ID: <Text style={styles.headValue}>{id}</Text></Text>

                <Text style={[styles.label, { marginTop: 10 }]}>
                    Animal Status: 
                    {animalStatus === 'Not Captured' ? 
                        <Text style={styles.notCaptured}>Not Captured</Text>
                        :
                        <Text style={styles.captured}>Captured</Text>
                    }
                </Text>
                
                <Text style={[styles.labelLocDesc, { marginTop: 30 }]}>Location where the animal was seen</Text>
                <Text style={styles.value}>{location}</Text>

                <Text style={styles.labelLocDesc}>Description</Text>
                <Text style={styles.value}>{description}</Text>

                <Text style={styles.labelLocDesc}>Submitted Image</Text>
                <Image style={styles.image} source={image} />
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    label: {
        fontFamily: 'PoppinsMedium',
        fontSize: 17,
        marginRight: 30,
        marginLeft: 30,
        marginBottom: 8,
    },

    labelLocDesc: {
        fontFamily: 'PoppinsMedium',
        fontSize: 17,
        marginRight: 30,
        marginLeft: 30,
        marginBottom: 3,
    },

    headValue: {
        fontFamily: 'PoppinsLight',
        fontSize: 17,
        marginLeft: 4,
    },

    notCaptured: {
        backgroundColor: 'red',
        borderRadius: 5,
        color: 'white',
        fontFamily: 'PoppinsRegular',
        fontSize: 12,
        marginLeft: 5,
        paddingTop: 3,
        paddingRight: 7,
        paddingBottom: 3,
        paddingLeft: 7,
    },

    captured: {
        backgroundColor: 'green',
        borderRadius: 5,
        color: 'white',
        fontFamily: 'PoppinsRegular',
        fontSize: 12,
        marginLeft: 5,
        paddingTop: 3,
        paddingRight: 7,
        paddingBottom: 3,
        paddingLeft: 7,
    },

    value: {
        fontFamily: 'PoppinsLight',
        fontSize: 16,
        marginLeft: 30,
        marginRight: 30,
        marginBottom: 20,
    },

    image: {
        marginTop: 10,
        marginRight: 30,
        marginLeft: 30,
        height: 250,
        width: '84.5%',
    },
})

export default SpecReport