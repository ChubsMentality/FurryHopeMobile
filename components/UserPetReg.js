import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useState, useEffect } from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons'
import axios from 'axios'

const UserPetReg = ({ navigation, route }) => {
    const [id, setId] = useState()
    const [address, setAddress] = useState()
    const [adoptionReference, setAdoptionReference] = useState()
    const [animalAge, setAnimalAge] = useState()
    const [animalBreed, setAnimalBreed] = useState()
    const [animalGender, setAnimalGender] = useState()
    const [animalColor, setAnimalColor] = useState()
    const [animalName, setAnimalName] = useState()
    const [animalType, setAnimalType] = useState()
    const [contactNo, setContactNo] = useState()
    const [date, setDate] = useState()
    const [email, setEmail] = useState()
    const [isFromAdoption, setIsFromAdoption] = useState()
    const [lengthOfStay, setLengthOfStay] = useState()
    const [name, setName] = useState()
    const [certOfResidencyComplete, setCertOfResidencyComplete] = useState()
    const [ownerPictureComplete, setOwnerPictureComplete] = useState()
    const [photocopyCertOfAntiRabiesComplete, setPhotocopyCertOfAntiRabiesComplete] = useState()
    const [proofOfAntiRabiesComplete, setProofOfAntiRabiesComplete] = useState()
    const [regFeeComplete, setRegFeeComplete] = useState()
    const [petPhotoComplete, setPetPhotoComplete] = useState()
    const [registrationStatus, setRegistrationStatus] = useState()
    const [registrationType, setRegistrationType] = useState()
    const [tagNo, setTagNo] = useState()
    const URL = 'https://fair-cyan-chimpanzee-yoke.cyclic.app/'

    const getRegistration = async () => {
        try {
            const { data } = await axios.get(`${URL}api/admins/getRegistration/${route.params.id}`)
            console.log(data)
            setId(data._id)
            setName(data.name)
            setAddress(data.address)
            setAdoptionReference(data.adoptionReference)
            setAnimalAge(data.animalAge)
            setAnimalBreed(data.animalBreed)
            setAnimalColor(data.animalColor)
            setAnimalGender(data.animalGender)
            setAnimalName(data.animalName)
            setAnimalType(data.animalType)
            setContactNo(data.contactNo)
            setDate(data.date)
            setEmail(data.email)
            setIsFromAdoption(data.isFromAdoption)
            setLengthOfStay(data.lengthOfStay)
            setCertOfResidencyComplete(data.certOfResidencyComplete)
            setOwnerPictureComplete(data.ownerPictureComplete)
            setPhotocopyCertOfAntiRabiesComplete(data.photocopyCertOfAntiRabiesComplete)
            setProofOfAntiRabiesComplete(data.proofOfAntiRabiesComplete)
            setPetPhotoComplete(data.petPhotoComplete)
            setRegFeeComplete(data.regFeeComplete)
            setRegistrationStatus(data.registrationStatus)
            
            setRegistrationType(data.registrationType)
            setTagNo(data.tagNo)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getRegistration()
    }, [])

    return (
        <SafeAreaView style={{ flex: 1, }}>
            <ScrollView style={{ flex: 1 }}>
                <View style={styles.registrationInfoContainer}>
                    <Text style={styles.infoHeader}>Registration Information</Text>


                    <Text style={styles.label}>Status:
                        {registrationStatus === 'Pending' &&
                            <Text style={styles.statusPending}>{registrationStatus}</Text>
                        } 

                        {registrationStatus === 'Accepted' &&
                            <Text style={styles.statusAccepted}>{registrationStatus}</Text>
                        } 

                        {registrationStatus === 'Rejected' &&
                            <Text style={styles.statusRejected}>{registrationStatus}</Text>
                        } 
                    </Text>
                    <Text style={styles.label}>ID: <Text style={styles.value}>{id}</Text></Text>
                    <Text style={styles.label}>Date Submitted: <Text style={styles.value}>{date}</Text></Text>
                    {isFromAdoption === true ?
                        <Text style={styles.label}>Adoption Ref: <Text style={styles.value}>{adoptionReference}</Text></Text>
                        :
                        <></>
                    }
                    <Text style={styles.label}>Registration Type: <Text style={styles.value}>{registrationType}</Text></Text>
                
                    <Text style={styles.reqHeader}>Requirements</Text>

                    <View style={styles.reqContainer}>
                        <Text style={styles.reqTxt}>Registration Fee (₱75.00)</Text>

                        {regFeeComplete === true ?
                            <View style={[styles.reqCheckBox, styles.reqCheckBoxFinished]}>
                                <Ionicons name='md-checkmark-outline' color='#111' size={14} />
                            </View>
                            :
                            <View style={styles.reqCheckBox}>
                                <Ionicons name='md-checkmark-outline' color='#111' size={14} />
                            </View>
                        }
                    </View>

                    <View style={styles.reqContainer}>
                        <Text style={styles.reqTxt}>Certificate of Residency / Valid ID</Text>

                        {certOfResidencyComplete === true ?
                            <View style={[styles.reqCheckBox, styles.reqCheckBoxFinished]}>
                                <Ionicons name='md-checkmark-outline' color='#111' size={14} />
                            </View>
                            :
                            <View style={styles.reqCheckBox}>
                                <Ionicons name='md-checkmark-outline' color='#111' size={14} />
                            </View>
                        }
                    </View>

                    <View style={styles.reqContainer}>
                        <Text style={styles.reqTxt}>Two (2) 2x2 picture of the owner</Text>

                        {ownerPictureComplete === true ?
                            <View style={[styles.reqCheckBox, styles.reqCheckBoxFinished]}>
                                <Ionicons name='md-checkmark-outline' color='#111' size={14} />
                            </View>
                            :
                            <View style={styles.reqCheckBox}>
                                <Ionicons name='md-checkmark-outline' color='#111' size={14} />
                            </View>
                        }
                    </View>

                    <View style={styles.reqContainer}>
                        <Text style={styles.reqTxt}>Photo of the pet (3R)</Text>

                        {petPhotoComplete === true ?
                            <View style={[styles.reqCheckBox, styles.reqCheckBoxFinished]}>
                                <Ionicons name='md-checkmark-outline' color='#111' size={14} />
                            </View>
                            :
                            <View style={styles.reqCheckBox}>
                                <Ionicons name='md-checkmark-outline' color='#111' size={14} />
                            </View>
                        }
                    </View>

                    <View style={styles.reqContainer}>
                        <Text style={styles.reqTxt}>Certificate or proof of Anti-Rabies</Text>

                        {proofOfAntiRabiesComplete === true ?
                            <View style={[styles.reqCheckBox, styles.reqCheckBoxFinished]}>
                                <Ionicons name='md-checkmark-outline' color='#111' size={14} />
                            </View>
                            :
                            <View style={styles.reqCheckBox}>
                                <Ionicons name='md-checkmark-outline' color='#111' size={14} />
                            </View>
                        }
                    </View>

                    <View style={styles.reqContainer}>
                        <Text style={styles.reqTxt}>Photocopy of certificate or proof of Anti-Rabies</Text>

                        {photocopyCertOfAntiRabiesComplete === true ?
                            <View style={[styles.reqCheckBox, styles.reqCheckBoxFinished]}>
                                <Ionicons name='md-checkmark-outline' color='#111' size={14} />
                            </View>
                            :
                            <View style={styles.reqCheckBox}>
                                <Ionicons name='md-checkmark-outline' color='#111' size={14} />
                            </View>
                        }
                    </View>
                </View>

                <View style={[styles.registrationInfoContainer]}>
                    <Text style={styles.infoHeader}>Pet's Information</Text>

                    <Text style={styles.label}>Name: <Text style={styles.value}>{animalName}</Text></Text>
                    <Text style={styles.label}>Breed: <Text style={styles.value}>{animalBreed}</Text></Text>
                    <Text style={styles.label}>Color: <Text style={styles.value}>{animalColor}</Text></Text>
                    <Text style={styles.label}>Gender: <Text style={styles.value}>{animalGender}</Text></Text>
                    <Text style={styles.label}>Type: <Text style={styles.value}>{animalType}</Text></Text>
                    <Text style={styles.label}>Age: <Text style={styles.value}>{animalAge}</Text></Text>
                    <Text style={styles.label}>Tag No: <Text style={styles.value}>{tagNo}</Text></Text>
                </View>

                <View style={[styles.registrationInfoContainer, { marginBottom: 30 }]}>
                    <Text style={styles.infoHeader}>Applicant's Information</Text>

                    <Text style={styles.label}>Name: <Text style={styles.value}>{name}</Text></Text>
                    <Text style={styles.label}>Email: <Text style={styles.value}>{email}</Text></Text>
                    <Text style={styles.label}>Contact No: <Text style={styles.value}>{contactNo}</Text></Text>
                    <Text style={styles.label}>Length of Stay: <Text style={styles.value}>{lengthOfStay}</Text></Text>
                    <Text style={styles.labelAddress}>Address</Text>
                    <Text style={styles.valueAddress}>{address}</Text>

                    <Text></Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default UserPetReg

const styles = StyleSheet.create({
    adoptionDetailsContainer: {
        height: 100,
        width: 100,
        borderRadius: 5,
    },

    statusPending: {
        fontFamily: 'PoppinsLight',
        fontSize: 10,
        backgroundColor: '#f4d952',
        borderRadius: 3,
        marginLeft: 5,
        paddingTop: 2,
        paddingRight: 6,
        paddingBottom: 2,
        paddingLeft: 6,
    },

    statusAccepted: {
        fontFamily: 'PoppinsLight',
        fontSize: 10,
        backgroundColor: 'green',
        color: 'white',
        borderRadius: 3,
        marginLeft: 5,
        paddingTop: 2,
        paddingRight: 6,
        paddingBottom: 2,
        paddingLeft: 6,
    },
    
    statusRejected: {
        fontFamily: 'PoppinsExtraLight',
        fontSize: 10,
        backgroundColor: '#ed5e68',
        color: 'white',
        borderRadius: 3,
        marginLeft: 5,
        paddingTop: 2,
        paddingRight: 6,
        paddingBottom: 2,
        paddingLeft: 6,
    },

    label: {
        fontFamily: 'PoppinsRegular',
        fontSize: 13,
        marginBottom: 3,
    },

    value: {
        fontFamily: 'PoppinsExtraLight',
        fontSize: 13,
    },

    labelAddress: {
        fontFamily: 'PoppinsRegular',
        fontSize: 13,
        marginTop: 5,
        marginBottom: 1,
    },

    valueAddress: {
        fontFamily: 'PoppinsLight',
        fontSize: 13,
    },

    infoHeader: {
        fontFamily: 'PoppinsSemiBold',
        fontSize: 13,
        marginBottom: 5,
    },

    registrationInfoContainer: {
        backgroundColor: '#fff',
        borderRadius: 5,
        marginTop: 30,
        marginRight: 30,
        marginLeft: 30,
        paddingTop: 15,
        paddingRight: 15,
        paddingBottom: 10,
        paddingLeft: 15,
    },

    reqHeader: {
        fontFamily: 'PoppinsSemiBold',
        fontSize: 13,
        marginTop: 25,
        marginBottom: 5,
    },

    reqContainer: {
        backgroundColor: '#111',
        borderRadius: 3,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        paddingTop: 5,
        paddingRight: 5,
        paddingBottom: 5,
        paddingLeft: 5,
        marginBottom: 10,
    },

    reqTxt: {
        fontFamily: 'PoppinsLight',
        color: 'white',
        fontSize: 10,
    },

    reqCheckBox: {
        height: 17,
        width: 17,
        borderRadius: 2,
        borderColor: 'white',
        borderWidth: 1,
    },

    reqCheckBoxFinished: {
        height: 18,
        width: 18,
        backgroundColor: 'white',
        borderRadius: 2,
        justifyContent: 'center',
        alignItems: 'center',
    }
})