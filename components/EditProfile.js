import { ActivityIndicator, Image, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Ionicons from 'react-native-vector-icons/Ionicons'
import * as ImagePicker from 'expo-image-picker'

const EditProfile = ({ navigation, route }) => {
    const URL = 'https://fair-cyan-chimpanzee-yoke.cyclic.app/'
    const { id, successUpdateProfile, setSuccessUpdateProfile } = route.params
    const [loading, setLoading] = useState(false)
    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [contactNo, setContactNo] = useState('')
    const [address, setAddress] = useState('') 
    const [street, setStreet] = useState('')
    const [barangay, setBarangay] = useState('')
    const [city, setCity] = useState('')
    const [profilePicture, setProfilePicture] = useState('')
    const [isMarikinaCitizen, setIsMarikinaCitizen] = useState()
    const [preview, setPreview] = useState('')

    const [fNameFocused, setFNameFocused] = useState(false)
    const [emailFocused, setEmailFocused] = useState(false)
    const [contactNoFocused, setContactNoFocused] = useState(false)
    const [addressFocused, setAddressFocused] = useState(false)
    const [streetFocused, setStreetFocused] = useState(false)
    const [barangayFocused, setBarangayFocused] = useState(false)
    const [cityFocused, setCityFocused] = useState(false)

    const getUser = async () => {
        const { data } = await axios.get(`${URL}api/users/getUserById/${id}`)
        setFullName(data.fullName)
        setEmail(data.email)
        setContactNo(data.contactNo)
        setAddress(data.address)
        setStreet(data.street)
        setBarangay(data.barangay)
        setCity(data.city)
        setIsMarikinaCitizen(data.isMarikinaCitizen)
        setPreview(data.profilePicture)   
    }

    const uploadHandler = (image) => {
        const data = new FormData()
        data.append('file', image)
        data.append('upload_preset', 'furryhopeimg')
        data.append('cloud_name', 'drvd7jh0b')
        fetch('https://api.cloudinary.com/v1_1/drvd7jh0b/image/upload', {
            method: 'post',
            body: data,
        })
        .then((res) => res.json())
        .then((data) => {
            console.log(data)
            let response = data.url
            setProfilePicture(response)
        })
        .catch((error) => {
            console.log(error)    
        })
    }

    const changePicture = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
            base64: true,
        })

        console.log(result)

        if(!result.cancelled) {
            let base64Img = `data:image/jpg;base64,${result.base64}`
            uploadHandler(base64Img)
            setPreview(result.uri)
        }
    }

    const updateHandler = async () => {
        // console.log(isMarikinaCitizen)
        try {
            const { data } = await axios.put(`${URL}api/users/updateProfilePicture/${id}`, { profilePicture })
        } catch (error) {
           console.log(error) 
        }

        try {
            setLoading(true)
            const { data } = await axios.put(`${URL}api/users/updateUserProfile/${id}`, { fullName, email, contactNo, address, street, barangay, city, isMarikinaCitizen })
            setLoading(false)
            navigation.navigate('My Profile')
            alert(`Your changes has been saved.`)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getUser()
    }, [])

    useEffect(() => {
        let lowered = city.split(" ")
        let temp = lowered[0].toLowerCase()
        console.log(temp)

        if(temp === 'marikina') {
            setIsMarikinaCitizen(true)
        } else {
            setIsMarikinaCitizen(false)
        }

        let tempAddress = `${street}, Brgy.${barangay}, ${city}, Philippines`
        setAddress(tempAddress)

        console.log(isMarikinaCitizen)
    }, [street, city, address])

    return (
        <SafeAreaView style={{ backgroundColor: 'white', flex: 1 }}>
            <ScrollView>

                <View style={styles.changePictureContainer}>
                    <Image source={preview} style={styles.profilePicture} />

                    <View>
                        <TouchableOpacity style={styles.changePictureBtn} onPress={() => changePicture()}>
                            <Ionicons name='image-outline' size={22} color='black' />
                            <Text style={styles.changePictureTxt}>Change Profile Picture</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <Text style={[styles.editLabel, styles.nameLabel]}>Name</Text>
                <TextInput
                    style={fNameFocused ? styles.editInputFocused : styles.editInput}
                    value={fullName}
                    onChangeText={setFullName}
                    onFocus={() => setFNameFocused(true)}
                    onBlur={() => setFNameFocused(false)}
                />

                <Text style={styles.editLabel}>Email</Text>
                <TextInput
                    style={emailFocused ? styles.editInputFocused : styles.editInput}
                    value={email}
                    onChangeText={setEmail}
                    onFocus={() => setEmailFocused(true)}
                    onBlur={() => setEmailFocused(false)}
                />

                <Text style={styles.editLabel}>Contact Number</Text>
                <TextInput
                    style={contactNoFocused ? styles.editInputFocused : styles.editInput}
                    value={contactNo}
                    onChangeText={setContactNo}
                    onFocus={() => setContactNoFocused(true)}
                    onBlur={() => setContactNoFocused(false)}
                />

                <Text style={styles.addressHeader}>Address</Text>

                <Text style={styles.editLabel}>Street</Text>
                <TextInput
                    style={addressFocused ? styles.editInputFocused : styles.editInput}
                    value={street}
                    onChangeText={setStreet}
                    onFocus={() => setAddressFocused(true)}
                    onBlur={() => setAddressFocused(false)}
                />

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginRight: 35, marginLeft: 35, }}>
                    <View style={styles.subAddressContainer}>
                        <Text style={styles.subAddressLabel}>Barangay</Text>
                        <TextInput
                            style={barangayFocused ? styles.subAddressInputFocused : styles.subAddressInput}
                            onFocus={() => setBarangayFocused(true)}
                            onBlur={() => setBarangayFocused(false)}
                            value={barangay}
                            onChangeText={setBarangay}
                        />
                    </View>

                    <View style={styles.subAddressContainer}>
                        <Text style={styles.subAddressLabel}>City</Text>
                        <TextInput
                            style={cityFocused ? styles.subAddressInputFocused : styles.subAddressInput}
                            onFocus={() => setCityFocused(true)}
                            onBlur={() => setCityFocused(false)}
                            value={city}
                            onChangeText={setCity}
                        />
                    </View>
                </View>

                <TouchableOpacity style={styles.saveBtn} onPress={() => updateHandler()}>
                    {loading ?
                        <ActivityIndicator size='small' color='white' />
                    :
                        <Text style={styles.saveTxt}>SAVE</Text>
                    }
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    changePictureContainer: {
        flexDirection: 'row',
        marginTop: 40,
        marginRight: 35,
        marginLeft: 35,
        alignItems: 'center',
    },

    profilePicture: {
        height: 120,
        width: 120,
        borderRadius: 100,
    },

    changePictureBtn: {
        alignItems: 'center',
        borderColor: 'black',
        borderWidth: .05,
        borderRadius: 5,
        flexDirection: 'row',
        marginLeft: 15,
        padding: 5,
    },

    changePictureTxt: {
        marginLeft: 5,
    },

    editLabel: {
        fontFamily: 'PoppinsRegular',
        fontSize: 14.5,
        marginLeft: 35,
        marginBottom: 5,
    },

    nameLabel: {
        marginTop: 50,
    },

    editInputFocused: {
        height: 46,
        width: '80%',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#111',
        color: '#111',
        backgroundColor: '#fff',
        marginLeft: 35,
        marginBottom: 20,
        fontFamily: 'PoppinsLight',
        fontSize: 13,
        paddingLeft: 10,
        paddingRight: 10,
    },

    editInput: {
        height: 46,
        width: '80%',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#D4D7D8',
        backgroundColor: '#F2F4F5',
        marginLeft: 35,
        marginBottom: 20,
        fontFamily: 'PoppinsLight',
        fontSize: 13,
        paddingLeft: 10,
        paddingRight: 10,
    },

    addressHeader: {
        fontFamily: 'PoppinsSemiBold',
        fontSize: 15,
        marginLeft: 35,
        marginTop: 20,
        marginBottom: 11,
    },

    subAddressLabel: {
        fontFamily: 'PoppinsRegular',
        fontSize: 14.5,
        marginBottom: 5,
    },

    subAddressInput: {
        height: 46,
        width: '82%',
        borderColor: '#D4D7D8',
        borderWidth: 1,
        backgroundColor: '#F2F4F5',
        color: '#8c8c8e',
        marginBottom: 20,
        fontFamily: 'PoppinsLight',
        fontSize: 13,
        paddingLeft: 10,
        paddingRight: 10,
    },

    subAddressInputFocused: {
        height: 46,
        width: '82%',
        borderColor: 'black',
        borderWidth: 3,
        backgroundColor: 'white',
        color: '#111',
        marginBottom: 20,
        fontFamily: 'PoppinsLight',
        fontSize: 13,
        paddingLeft: 10,
        paddingRight: 10,
        color: '#000',
    },

    saveBtn: {
        height: 55,
        width: '80%',
        backgroundColor: '#111',
        marginTop: 45,
        marginRight: 35,
        marginBottom: 30,
        marginLeft: 35,
        justifyContent: 'center',
        alignItems: 'center',
    },

    saveTxt: {
        color: 'white',
        fontFamily: 'PoppinsSemiBold',
        fontSize: 22,
    },
})

export default EditProfile