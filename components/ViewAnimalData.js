import React, { useState, useEffect, useContext } from 'react'
import { Image, ImageBackground, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, Pressable, useWindowDimensions } from 'react-native'
import { CredentialsContext } from './CredentialsContext'
import moment from 'moment'
import axios from 'axios'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useColorScheme } from 'react-native-web'

const ViewAnimalData = ({ navigation, route }) => {
    const URL = 'https://fair-cyan-chimpanzee-yoke.cyclic.app/'
    const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext)
    const [id, setId] = useState('')
    const [name, setName] = useState('');
    const [breed, setBreed] = useState('');
    const [description, setDescription] = useState('');
    const [color, setColor] = useState('')
    const [gender, setGender] = useState('');
    const [animalType, setAnimalType] = useState('');
    const [size, setSize] = useState('')
    const [adoptionStatus, setAdoptionStatus] = useState('');
    const [animalImg, setAnimalImg] = useState('');
    const [availUntil, setAvailUntil] = useState('')
    const [user, setUser] = useState()
    const [limit, setLimit] = useState()
    const window = useWindowDimensions()

    const current = moment().format('YYYY/MM/DD')
    // console.log(current)
    const added = moment(current).add(5, 'd').format('YYYY/MM/DD')
    // console.log(added)

    const pendingAdoption = adoptionStatus === 'Pending'
    const adopted = adoptionStatus === 'Adopted'

    const { animalId } = route.params;

    const getDataById = async () => {
        try {
            const { data } = await axios.get(`${useColorScheme}api/animals/${animalId}`)
            console.log(data)
            setId(data._id)
            setName(data.name)
            setBreed(data.breed)
            setDescription(data.description)
            setColor(data.color)
            setGender(data.gender)
            setAnimalType(data.type)
            setSize(data.size)
            setAdoptionStatus(data.adoptionStatus)
            setAnimalImg(data.animalImg)
            setAvailUntil(data.availUntil)
        } catch (error) {
            console.log(error)
            alert(error)
        }
    }

    const getUser = async () => {
        const { data } = await axios.get(`${useColorScheme}api/users/getUserById/${storedCredentials.id}`)
        setUser(data)
        setLimit(data.limit)
        console.log(data.limit)
        console.log(data)
    }

    const limitFormatted = limit && moment(limit).format('MMMM DD, YYYY')

    if(limit > current) {
        console.log(`You're not allowed to adopt yet`)
    } else {
        console.log(`You can adopt an animal.`)
    }

    useEffect(() => {
        getDataById();
        getUser()
    }, [animalId]);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white', position: 'relative' }}>
            {limit > current && 
                <Pressable style={{
                    width: window.width, 
                    height: window.height, 
                    backgroundColor: '#111',
                    opacity: .5,
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    zIndex: 25
                }}></Pressable>
            }

            {limit > current &&
                <View style={styles.notCitizenModal}>
                    <Text style={styles.notCitizenHeader}>You're not allowed to {'\n'}adopt yet.</Text>
                    <Text style={styles.notCitizednSub}>The app limits users from adopting once they've adopted, you can adopt on {limitFormatted}</Text>

                    <TouchableOpacity style={styles.redirectBtn} onPress={() => navigation.goBack()}>
                        <Text style={styles.redirectTxt}>Back to the list of animals.</Text>
                    </TouchableOpacity>
                </View>
            }

            <ImageBackground style={styles.animalImgBg} source={animalImg}>
                <TouchableOpacity style={styles.returnBtn} onPress={() => navigation.goBack()}>
                    <Ionicons name='chevron-back' size={24} color='#111' />
                </TouchableOpacity>
            </ImageBackground>
            
            <View style={styles.animalInfoContainer}>
                <ScrollView>
                    <View>
                        <View style={styles.mainInfoContainer}>
                            <View style={styles.nameBreedContainer}>
                                <Text style={styles.name}>{name},</Text>
                                <Text style={styles.breed}> {breed}</Text>
                            </View>
                            <Text style={styles.idLabel}>ID: <Text style={styles.idValue}>{id}</Text></Text>

                            <Text style={styles.availUntilLabel}>Available Until: 
                                <Text style={styles.availUntilValue}>{availUntil}</Text>
                            </Text>
                        </View>
                    </View>


                    <View style={styles.otherInfo}>
                        <View style={styles.otherInfoContainer}>
                            <Text style={styles.otherInfoValue}>{color}</Text>
                            <Text style={styles.otherInfoLabel}>Color</Text>
                        </View>

                        <View style={styles.otherInfoContainer}>
                            <Text style={styles.otherInfoValue}>{size}</Text>
                            <Text style={styles.otherInfoLabel}>Size</Text>
                        </View>

                        <View style={styles.otherInfoContainer}>
                            <Text style={styles.otherInfoValue}>{gender}</Text>
                            <Text style={styles.otherInfoLabel}>Gender</Text>
                        </View>
                    </View>

                    <Text style={styles.descriptionLabel}>Description</Text>
                    <Text style={styles.description}>{description}</Text>
                
                </ScrollView>

                <TouchableOpacity style={styles.adoptBtn} onPress={() => navigation.navigate('Adoption Form', { animalId: animalId })}>
                    <Text style={styles.adoptTxt}>ADOPT ME</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    animalImgBg: {
        height: 400,
        width: '100%',
        position: 'relative',
    },

    returnBtn: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 33,
        width: 33,
        position: 'absolute',
        top: 25,
        left: 30, // 20
        backgroundColor: 'white',
        borderRadius: 5,
        shadowColor: '#111',
        shadowOffset: {
            height: 0,
            width: 0,
        }, 
        shadowRadius: 5,
        shadowOpacity: .25,
    },

    animalInfoContainer: {
        flex: 1,
        backgroundColor: 'white',
        zIndex: 10,
        marginTop: -60,
        paddingRight: 30,
        paddingLeft: 30,
        position: 'relative',
        borderTopLeftRadius: 35,
        borderTopRightRadius: 35,
        shadowColor: '#111',
        shadowOffset: {
            height: -1,
            width: 0,
        },
        shadowRadius: 8,
        shadowOpacity: .1,
    },

    notCitizenModal: {
        height: 'auto',
        width: 330,
        backgroundColor: 'white',
        borderRadius: 5,
        position: 'absolute',
        top: '35%',
        left: '50%',
        transform: [{
            translateX: '-50%',
            translateY: '-50%',
        }],
        zIndex: 30,
    },

    notCitizenHeader: {
        fontFamily: 'PoppinsBold',
        fontSize: 18,
        textAlign: 'center',
        marginTop: 30,
        marginLeft: 20,
        marginRight: 20,
    },

    notCitizednSub: {
        textAlign: 'center',
        fontSize: 17,
        lineHeight: 28, 
        marginTop: 5, 
        marginLeft: 20,
        marginRight: 20,
    },

    redirectBtn: {
        height: 60,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        borderTopColor: '#b0b0b0',
        borderTopWidth: 1,
    },

    redirectTxt: {
        fontSize: 16,
        fontFamily:'PoppinsSemiBold',
    },

    nameBreedContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        marginTop: 35,
    },

    idLabel: {
        fontFamily: 'PoppinsMedium',
        fontSize: 14,
        marginTop: 3,
    },

    idValue: {
        fontFamily: 'PoppinsLight',
        marginLeft: 5,
    },

    availUntilLabel: {
        fontFamily: 'PoppinsMedium',
        fontSize: 14,
        marginTop: 3,
    },

    availUntilValue: {
        fontFamily: 'PoppinsLight',
        marginLeft: 5,
    },

    name: {
        fontFamily: 'PoppinsSemiBold',
        fontSize: 24,
    },

    breed: {
        fontFamily: 'PoppinsRegular',
        fontSize: 18,
    },

    otherInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 35,
    },

    otherInfoContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 95,
        width: 95,
        backgroundColor: '#ffff66',
        borderRadius: 5,
    },

    otherInfoValue: {
        fontFamily: 'PoppinsMedium',
        fontSize: 16,
    },

    otherInfoLabel: {
        fontFamily: 'PoppinsLight',
        fontSize: 13,
    },

    descriptionLabel: {
        fontFamily: 'PoppinsMedium',
        fontSize: 16,
        marginTop: 25,
    },

    description: {
        fontFamily: 'PoppinsLight',
        fontSize: 14,
        marginTop: 3,
        flexWrap: 'wrap',
    },

    adoptBtn: {
        position: 'absolute',
        bottom: 20,
        height: 60,
        width: '86%',
        borderRadius: 5,
        backgroundColor: '#111',
        justifyContent: 'center',
        alignItems: 'center',
    },

    adoptTxt: {
        color: 'white',
        fontFamily: 'PoppinsSemiBold',
        fontSize: 20,
    },

    disabledBtnContainer: {
        position: 'absolute',
        bottom: 20,
    },

    adoptDisabled: {
        height: 60,
        width: 350,
        borderRadius: 5,
        backgroundColor: '#111',
        justifyContent: 'center',
        alignItems: 'center',
    },

    adoptDisabledTxt: {
        color: 'white',
        fontFamily: 'PoppinsSemiBold',
        fontSize: 20,
    },
})

export default ViewAnimalData