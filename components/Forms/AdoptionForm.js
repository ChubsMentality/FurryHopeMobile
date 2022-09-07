import React, { useState, useEffect, useContext } from 'react'
import { ActivityIndicator, Image, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, Touchable, TouchableOpacity, View } from 'react-native'
import { CredentialsContext } from '../CredentialsContext'
import moment from 'moment'
import Ionicons from 'react-native-vector-icons/Ionicons'
import * as DocumentPicker from 'expo-document-picker'
import axios from 'axios'
import uuid from 'react-native-uuid'

const AdoptionForm = ({ route, navigation }) => {
    const { storedCredentials, setStoredCredentials } = useContext(CredentialsContext)
    const d = new Date()
    const URL = 'https://furryhopebackend.herokuapp.com/'
    const { animalId } = route.params
    console.log(animalId)

    const [name, setName] = useState('')
    const [applicantName, setApplicantName] = useState('')
    const [email, setEmail] = useState('')
    const [contactNo, setContactNo] = useState('')
    const [address, setAddress] = useState('')  
    const [isMarikinaCitizen, setIsMarikinaCitizen] = useState()
    const [animalName, setAnimalName] = useState('')
    const [animalBreed, setAnimalBreed] = useState('')
    const [animalType, setAnimalType] = useState('')
    const [animalGender, setAnimalGender] = useState('')
    const [animalColor, setAnimalColor] = useState('')
    const [animalAge, setAnimalAge] = useState('Unknown')
    const [animalImg, setAnimalImg] = useState('')
    const [validId, setValidId] = useState()
    const [fileName, setFileName] = useState()
    const [date, setDate] = useState(d.toLocaleDateString(undefined, { day: '2-digit', month: '2-digit', year: 'numeric' }))
    const [applicantImg, setApplicantImg] = useState('')
    const [lengthOfStay, setLengthOfStay] = useState('')
    const [adoptionReference, setAdoptionReference] = useState()
    const [loading, setLoading] = useState(false)
    const [applicantNameFocused, setApplicantNameFocused] = useState(false)
    const [emailFocused, setEmailFocused] = useState(false)
    const [contactNoFocused, setContactNoFocused] = useState(false)
    const [addressFocused, setAddressFocused] = useState(false)
    const [tagNo, setTagNo] = useState('')
    const [lengthOfStayFocused, setLengthOfStayFocused] = useState(false)
    const [tempLimit, setTempLimit] = useState()

    const applicationStatus = 'Pending'

    // update adoption status to 'Pending'
    const adoptionStatus = 'Pending'

    
    const current = moment().format('YYYY/MM/DD')
    // console.log(current)
    tempLimit && console.log(tempLimit)
    let limit = tempLimit && moment(current).add(14, 'd').format('YYYY/MM/DD')

    const getAnimalById = async () => {
        const { data } = await axios.get(`http://localhost:5000/api/animals/${animalId}`)
        setAnimalName(data.name)
        setAnimalBreed(data.breed)
        setAnimalType(data.type)
        setAnimalGender(data.gender)
        setAnimalColor(data.color)
        setAnimalImg(data.animalImg)

    }

    const getUserById = async () => {
        const { data } = await axios.get(`http://localhost:5000/api/users/getUserById/${storedCredentials.id}`)
        setName(data.fullName)
        setApplicantName(data.fullName)
        setEmail(data.email)
        setContactNo(data.contactNo)
        setAddress(data.address)
        setApplicantImg(data.profilePicture)
        setIsMarikinaCitizen(data.isMarikinaCitizen)
        setTempLimit(data.limit)
    }

    const generateTagNo = () => {
        let tagNo = ''

        for (let i = 0; i <= 3; i++) {
            const randomNum = Math.round(Math.random() * 9)
            tagNo += randomNum
        }

        setTagNo(tagNo)
    }

    const pickDocument = async () => {
        let result = await DocumentPicker.getDocumentAsync({ type: '*/*', copyToCacheDirectory: true, base64: true})
            .then((response) => {
                if(response.type = 'success') {
                    
                    let { name, uri, size } = response
                    let nameParts = name.split('.')
                    let fileType = nameParts[nameParts.length - 1]
                    
                    var fileToUpload = {
                        name: name,
                        size: size,
                        uri: uri,
                        type: 'application/' + fileType
                    }

                    console.log(fileToUpload)
                    uploadHandler(fileToUpload.uri)
                    setFileName(fileToUpload.name)  
                }
            })
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
            setValidId(response)
            console.log(response)
        })
        .catch((error) => {
            console.log(error)    
        })
        
    }
    
    const submit = async () => { 
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${storedCredentials.token}`
            }
        }

        setLoading(true)

        if(!applicantName || !email || !contactNo || !address) {
            alert('Please fill out all the necessary fields')
            setLoading(false)
            return
        } else if(!validId) {
            alert('Please attach your valid I.D.')
            setLoading(false)
            return
        } else if(contactNo.match(/[^$,.\d]/)) {
            alert('Invalid contact number, please enter a valid contact number.')
            setLoading(false)
            return 
        } else {
            if(isMarikinaCitizen) {
                console.log('register and submit adoption')

                // Submit Adoption
                try {
                    let hasBeenInterviewed = false
                    let hasPaid = false
                    
    
                    const data = await axios.post(`http://localhost:5000/api/users/submitAdoption`, {
                        animalId, applicantName, email, contactNo, address, applicantImg, validId, animalName, animalBreed,
                        animalType, animalGender, animalColor, animalImg, adoptionStatus, tagNo, date, applicationStatus, hasBeenInterviewed, hasPaid, adoptionReference
                    }, config)
    
                    console.log(data)
                    alert('Successfully submitted, check your profile to see your adoptions and check your email for messages.')
                } catch (error) {
                    console.log(error)
                }
    
                // Update adoption status - of the animal
                try {                
                    const { data } = await axios.put(`http://localhost:5000/api/admins/updateAdoptionStatus/${animalId}`, { adoptionStatus })
                    // console.log(data)
                } catch (error) {
                    console.log(error)
                }

                // Update user's limitation for adopting
                try {   
                    const { data } = await axios.put(`http://localhost:5000/api/users/updateLimitation/${storedCredentials.id}`, { limit })
                } catch (error) {
                    console.log(Error)
                }
                
                // Submit animal registration
                try {
                    const registrationType = 'New'
                    const registrationStatus = 'Pending'
                    const isFromAdoption = true
                    const regFeeComplete = false
                    const certOfResidencyComplete = false
                    const ownerPictureComplete = false
                    const petPhotoComplete = false
                    const proofOfAntiRabiesComplete = false
                    const photocopyCertOfAntiRabiesComplete = false

                    const { data } = await axios.post(`http://localhost:5000/api/users/registerAnimal`, {
                        animalType, registrationType, applicantImg, name, contactNo, lengthOfStay, address,
                        animalName, animalBreed, animalAge, animalColor, animalGender, tagNo, date, registrationStatus, email, adoptionReference, isFromAdoption,
                        regFeeComplete, certOfResidencyComplete, ownerPictureComplete, petPhotoComplete, proofOfAntiRabiesComplete, photocopyCertOfAntiRabiesComplete,
                    }, config)
                    console.log(data)
                } catch (error) {
                    console.log(error)
                }
    
                setLoading(false)
            
                setTimeout(() => {
                    navigation.navigate('Browse')
                }, 500)
            } else {
                console.log('submit adoption')
                alert('Successfully submitted, check your profile to see your adoptions.')
                try {
                    let hasBeenInterviewed = false
                    let hasPaid = false
    
                    const data = await axios.post(`http://localhost:5000/api/users/submitAdoption`, {
                        animalId, applicantName, email, contactNo, address, applicantImg, validId, animalName, animalBreed,
                        animalType, animalGender, animalColor, animalImg, adoptionStatus, date, applicationStatus, hasBeenInterviewed, hasPaid, adoptionReference
                    }, config)
    
                    console.log(data)
                    alert('Successfully submitted, check your profile to see your adoptions.')
                } catch (error) {
                    console.log(error)
                    alert(error)
                }
                
                // Update animal's adoption status
                try {                
                    const data = await axios.put(`http://localhost:5000/api/admins/updateAdoptionStatus/${animalId}`, { adoptionStatus })
                    // console.log(data)
                } catch (error) {
                    console.log(error)
                }

                // Update user's limitation for adopting
                try {   
                    const { data } = await axios.put(`http://localhost:5000/api/users/updateLimitation/${storedCredentials.id}`, { limit })
                } catch (error) {
                    console.log(Error)
                }
    
                setLoading(false)
            
                setTimeout(() => {
                    navigation.navigate('Browse')
                }, 500)
            }
        }
    }

    useEffect(() => {
        setAdoptionReference(uuid.v4())
        getUserById()
        getAnimalById()
        generateTagNo()
    }, [animalId])

    return (
        <SafeAreaView style={styles.body}>
            <ScrollView>
                <View style={styles.paddedView}>
                    <Text style={[styles.adopterInfoLabel, { marginTop: 40 }]}>Name</Text>
                    <TextInput
                        style={applicantNameFocused ? styles.adopterInfoInputFocused : styles.adopterInfoInput}
                        value={applicantName}
                        onChangeText={setApplicantName}
                        onFocus={() => setApplicantNameFocused(true)}
                        onBlur={() => setApplicantNameFocused(false)} 
                    />

                    <Text style={styles.adopterInfoLabel}>Email Address</Text>
                    <TextInput
                        style={emailFocused ? styles.adopterInfoInputFocused : styles.adopterInfoInput}
                        value={email}
                        onChangeText={setEmail}
                        onFocus={() => setEmailFocused(true)}
                        onBlur={() => setEmailFocused(false)} 
                    />

                    <Text style={styles.adopterInfoLabel}>Contact Number</Text>
                    <TextInput
                        style={contactNoFocused ? styles.adopterInfoInputFocused : styles.adopterInfoInput}
                        keyboardType='numeric'
                        value={contactNo}
                        onChangeText={setContactNo} 
                        maxLength={11}
                        onFocus={() => setContactNoFocused(true)}
                        onBlur={() => setContactNoFocused(false)}
                    />
                    
                    <Text style={styles.adopterInfoLabel}>Address</Text>
                    <TextInput
                        style={addressFocused ? styles.adopterInfoInputFocused : styles.adopterInfoInput}
                        value={address}
                        onChangeText={setAddress}
                        onFocus={() => setAddressFocused(true)}
                        onBlur={() => setAddressFocused(false)}
                    />

                    {isMarikinaCitizen ?
                        <>
                            <Text style={styles.adopterInfoLabel}>Length of stay in the city</Text>
                            <TextInput
                                style={lengthOfStayFocused ? styles.adopterInfoInputFocused : styles.adopterInfoInput}
                                value={lengthOfStay}
                                onChangeText={setLengthOfStay}
                                onFocus={() => setLengthOfStayFocused(true)}
                                onBlur={() => setLengthOfStayFocused(false)}
                            />
                        </>
                        :   
                        <></>
                    }

                    <Text style={styles.adopterInfoLabel}>Please attach your valid Id</Text>
                    <View style={styles.chooseFileContainer}>
                        <TouchableOpacity style={styles.chooseFileBtn} onPress={() => pickDocument()}>
                            <Ionicons name='md-document-attach' size={18} color='black' />
                            <Text style={styles.chooseFileText}>Choose File</Text>
                        </TouchableOpacity>

                        <Text style={styles.fileName}>{fileName}</Text>
                    </View>

                    {isMarikinaCitizen ?
                        <View style={styles.noteAdoptionContainer}>
                            <Text style={styles.noteAdoptionTxt}>Note: Users from Marikina City are required to register to the city pound the animal they want to adopt once it's finished. You can see the progress of both the adoption and the registration on your profile screen and be on the lookout for message on your email.</Text>
                        </View>
                        :
                        <></>
                    }

                    {isMarikinaCitizen ?
                        <View style={styles.petRegistrationContainer}>
                            <Text style={styles.petRegReqHeader}>Requirements for registering a pet:</Text>
                            <Text style={styles.petRegRequirements}>Registration fee of ₱ 75.00</Text>
                            <Text style={styles.petRegRequirements}>Certificate of Residency issued by barangay or any valid ID.</Text>
                            <Text style={styles.petRegRequirements}>Two (2) pcs of 2x2 picture of owner</Text>
                            <Text style={styles.petRegRequirements}>Photo of the pet in 3R size (Whole body, Side view)</Text>
                            <Text style={styles.petRegRequirements}>Certificate or proof of Anti-Rabies Vaccination</Text>
                            <Text style={styles.petRegRequirements}>Photocopy of the certificate that the pet has already been vaccinated for anti-rabies.</Text>
                        </View>
                        :
                        <></>
                    }
                    
                    {isMarikinaCitizen ?
                        <TouchableOpacity style={styles.submitBtn} onPress={() => submit()}>
                            {loading ?
                                    <ActivityIndicator color='white' style={{ marginTop: '14px' }} />
                                :
                                    <Text style={styles.submitBtnText}>SUBMIT</Text>
                            }
                        </TouchableOpacity>
                        :
                        <TouchableOpacity style={styles.submitBtnNotCitizen} onPress={() => submit()}>
                            {loading ?
                                    <ActivityIndicator color='white' style={{ marginTop: '14px' }} />
                                :
                                    <Text style={styles.submitBtnText}>SUBMIT</Text>
                            }
                        </TouchableOpacity>
                    }
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default AdoptionForm

const styles = StyleSheet.create({
    body: {
        flex: 1,
        backgroundColor: 'white',
    },

    paddedView: {
        paddingLeft: 35,
        paddingRight: 35,
    },

    backBtn: {
        display: 'flex',
        flexDirection: 'row',
        marginTop: 25,
        marginBottom: 60,
        marginLeft: 20,
    },

    icon: {
        width: 23,
        height: 23,
    },

    backBtnText: {
        fontFamily: 'PoppinsMedium',
        fontSize: 14.5,
        marginTop: 2,
        marginLeft: 7,
    },

    header: {
        fontFamily: 'PoppinsBold',
        fontSize: 25,
    },

    dateLabel: {
        display: 'flex',
        flexDirection: 'row',
        fontFamily: 'PoppinsMedium',
        fontSize: 16,
        marginTop: 5,

    },

    dateValue: {
        fontFamily: 'PoppinsLight',
        fontSize: 16,
        marginLeft: 5,
    },

    adopterInfoHeader: {
        alignSelf: 'flex-start',
        backgroundColor: '#FFF9B5',
        fontFamily: 'PoppinsLight',
        fontSize: 11,
        marginTop: 40,
        marginBottom: 10,
        paddingTop: 3,
        paddingRight: 7,
        paddingBottom: 3,
        paddingLeft: 7,
    },

    adopterInfoLabel: {
        fontFamily: 'PoppinsRegular',
        fontSize: 15,
        marginBottom: 5,
    },

    adopterInfoInput: {
        height: 45,
        width: '100%',
        borderRadius: 5,
        borderColor: '#f1f3f7',
        borderWidth: 3,
        backgroundColor: '#f3f5f9',
        color: '#8c8c8e',
        fontFamily: 'PoppinsRegular',
        fontSize: 13,
        marginBottom: 20,
        paddingLeft: 10,
        paddingRight: 10,
    },

    adopterInfoInputFocused: {
        height: 45,
        width: '100%',
        borderColor: '#111',
        borderWidth: 1,
        borderRadius: 5,
        backgroundColor: 'white',
        fontFamily: 'PoppinsRegular',
        fontSize: 13,
        marginBottom: 20,
        paddingLeft: 10,
        paddingRight: 10,
    },

    chooseFileContainer: {
        display: 'flex',
    },

    chooseFileBtn: {
        borderWidth: .5,
        borderColor: '#000',
        borderStyle: 'solid',
        borderRadius: 5,
        marginTop: 3,
        paddingTop: 5,
        paddingRight: 10,
        paddingBottom: 5,
        paddingLeft: 10,
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
    },

    chooseFileText: {
        color: '#000',
        marginLeft: 5,
    },

    fileName: {
        color: 'green',
        fontFamily: 'PoppinsLight',
        marginTop: 10,
    },

    isCitizenLabel: {
        fontFamily: 'PoppinsRegular',
        fontSize: 16,
        marginTop: 50,
        marginBottom: 8,
    },

    citizenCheckBoxContainer: {
    },

    citizenYesContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
        marginBottom: 15,
        borderRadius: 5,
    },

    citizenYesContainerActive: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
        marginBottom: 15,
        backgroundColor: '#b3ffb3',
        borderRadius: 5,
        padding: 10,
    },

    citizenNoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 5,
    },

    citizenNoContainerActive: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ff9999',
        borderRadius: 5,
        padding: 10,
    },

    citizenCheckBox: {
        borderColor: '#111',
        borderWidth: 1,
        borderRadius: 5,
        marginRight: 7,
        height: 28,
        width: 28,
        justifyContent: 'center',
        alignItems: 'center',
    },

    citizenCheckBoxActive: {
        backgroundColor: '#111',
        borderColor: '#111',
        borderWidth: 1,
        borderRadius: 5,
        marginRight: 7,
        height: 28,
        width: 28,
        justifyContent: 'center',
        alignItems: 'center',
    },

    citizenCheckBoxLabel: {
        fontSize: 15,
        fontFamily: 'PoppinsLight',
    },

    citizenCheckBoxLabelActive: {
        fontSize: 15,
        fontFamily: 'PoppinsBold',
    },

    petRegistrationContainer: {
        backgroundColor: '#111',
        paddingRight: 20,
        paddingLeft: 20,
        paddingBottom: 20,
        marginTop: 30,
        overflow: 'hidden',
        borderRadius: 5,
    },

    petRegistrationHeader: {
        color: 'white',
        fontFamily: 'PoppinsMedium',
        fontSize: 16,
        marginTop: -20,
    },

    petRegCheckBoxContainer: {
        marginTop: 25,
    },

    noteAdoptionContainer: {
        marginTop: 30,
        padding: 20,
        backgroundColor: '#111',
        borderRadius: 5,
        overflow: 'hidden',
    },

    noteAdoptionTxt: {
        fontFamily: 'PoppinsRegular',
        fontSize: 14.5,
        color: 'white',
        lineHeight: 30,
    },

    petRegYesContainer: {
        flexDirection: 'row',
    },

    petRegNoContainer: {
        flexDirection: 'row',
        marginTop: 10,
    },

    petRegCheckBox: {
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: 'white',
        borderRadius: 5,
        borderWidth: 1,
        height: 28,
        width: 28,
    },

    petRegCheckBoxActive: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        borderColor: 'white',
        borderRadius: 5,
        borderWidth: 1,
        height: 28,
        width: 28,
    },

    petRegLabel: {
        color: 'white',
        fontFamily: 'PoppinsLight',
        fontSize: 15,
        marginLeft: 10,
    },

    petRegLabelActive: {
        color: 'white',
        fontFamily: 'PoppinsMedium',
        fontSize: 15,
        marginLeft: 10,
    },

    petRegReqHeader: {
        fontFamily: 'PoppinsRegular',
        color: 'white',
        fontSize: 15,
        marginTop: 27,
        marginBottom: 5,
    },

    petRegRequirements: {
        color: 'white',
        fontFamily: 'PoppinsExtraLight',
        fontSize: 13.5,
        marginTop: 10,
    },

    petRegLabelLength: {
        fontSize: 14.5,
        marginTop: 40,
        fontFamily: 'PoppinsRegular',
        color: 'white',
    },

    lengthOfStayInput: {
        height: 40,
        width: '100%',
        borderRadius: 5,
        borderColor: '#f1f3f7',
        borderWidth: 3,
        backgroundColor: '#f3f5f9',
        color: '#8c8c8e',
        fontFamily: 'PoppinsRegular',
        fontSize: 11.5,
        paddingLeft: 10,
        paddingRight: 10,
        marginTop: 8,
        marginBottom: 15,
    },

    lengthOfStayInputActive: {
        height: 40,
        width: '100%',
        borderRadius: 5,
        borderColor: '#fff',
        borderWidth: 3,
        backgroundColor: '#ffffff',
        color: '#111',
        fontFamily: 'PoppinsRegular',
        fontSize: 11.5,
        paddingLeft: 10,
        paddingRight: 10,
        marginTop: 8,
        marginBottom: 15,

    },

    // animalInfoHeader: {
    //     alignSelf: 'flex-start',
    //     backgroundColor: '#FFF9B5',
    //     fontFamily: 'PoppinsLight',
    //     fontSize: 11,
    //     marginTop: 40,
    //     marginBottom: 10,
    //     paddingTop: 3,
    //     paddingRight: 7,
    //     paddingBottom: 3,
    //     paddingLeft: 7,
    // },

    // animalInfoLabel: {
    //     fontFamily: 'PoppinsRegular',
    //     fontSize: 16,
    //     marginBottom: 3,
    // },

    // animalInfoInput: {
    //     width: '100%',
    //     height: 40,
    //     borderColor: '#b0b0b0',
    //     borderStyle: 'solid',
    //     borderWidth: 1,
    //     marginBottom: 15,
    //     paddingTop: 10,
    //     paddingRight: 7,
    //     paddingLeft: 7,
    // },

    // animalInfoInputHalf: {
    //     width: '50%',
    //     height: 40,
    //     borderColor: '#b0b0b0',
    //     borderStyle: 'solid',
    //     borderWidth: 1,
    //     marginBottom: 15,
    //     paddingTop: 10,
    //     paddingRight: 7,
    //     paddingLeft: 7,
    // },

    // animalInfoInputText: {
    //     fontFamily: 'PoppinsRegular',
    //     fontSize: 14,
    // },

    submitBtn: {
        width: '100%',
        height: 60,
        backgroundColor: '#111',
        borderRadius: 5,
        marginTop: 50,
        marginBottom: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },

    submitBtnNotCitizen: {
        width: '100%',
        height: 60,
        backgroundColor: '#111',
        borderRadius: 5,
        marginTop: 190,
        marginBottom: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },

    submitBtnText: {
        color: 'white',
        fontFamily: 'PoppinsSemiBold',
        fontSize: 21,
        letterSpacing: 2,
    },


})
