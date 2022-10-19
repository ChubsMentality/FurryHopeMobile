import { Image, ImageBackground, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, useWindowDimensions, View } from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import EmptyList from '../assets/Images/emptyClipboard.png'
import { CredentialsContext } from './CredentialsContext'
import axios from 'axios'
import Ionicons from 'react-native-vector-icons/Ionicons'
import InterviewPng from '../assets/Images/interview.png'
import PetPickupPng from '../assets/Images/petPickup.png'

const UserAdoption = ({ navigation, route }) => {
    // Adoption
    const [animalId, setAnimalId] = useState('')
    const [animalName, setAnimalName] = useState('')
    const [animalBreed, setAnimalBreed] = useState('')
    const [animalGender, setAnimalGender] = useState('')
    const [animalImg, setAnimalImg] = useState('')
    const [animalColor, setAnimalColor] = useState('')
    const [animalType, setAnimalType] = useState('')
    const [adoptionStatus, setAdoptionStatus] = useState('')
    const [applicationStatus, setApplicationStatus] = useState('')
    const [adoptionReference, setAdoptionReference] = useState('')
    const [hasBeenInterviewed, setHasBeenInterviewed] = useState('')
    const [adoptionId, setAdoptionId] = useState('')
    const [dateCreated, setDateCreated] = useState('')
    const [tagNo, setTagNo] = useState('')

    // Applicant
    const [address, setAddress] = useState('')
    const [applicantImg, setApplicantImg] = useState('')
    const [applicantName, setApplicantName] = useState('')
    const [contactNo, setContactNo] = useState('')
    const [email, setEmail] = useState('')
    const [validId, setValidId] = useState('')

    // Interview Schedule
    const [interviewSched, setInterviewSched] = useState(null)
    const [viewInterviewSched, setViewInterviewSched] = useState(false)
    const [interviewDate, setInterviewDate] = useState()
    const [interviewTime, setInterviewTime] = useState()

    const [viewPickupSched, setViewPickupSched] = useState(false)
    const [pickupSched, setPickupSched] = useState()

    const [userId, setUserId] = useState()
    const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext)

    const getAdoption = async () => {
        try {
            const { data } = await axios.get(`http://localhost:5000/api/admins/adoptions/${route.params.id}`)
            setAnimalId(data.animalId)
            setAnimalName(data.animalName)
            setAnimalBreed(data.animalBreed)
            setAnimalGender(data.animalGender)
            setAnimalImg(data.animalImg)
            setAnimalColor(data.animalColor)
            setAnimalType(data.animalType)
            setAdoptionStatus(data.adoptionStatus)
            setApplicationStatus(data.applicationStatus)
            setAdoptionReference(data.adoptionReference)
            setHasBeenInterviewed(data.hasBeenInterviewed)
            setAdoptionId(data._id)
            setDateCreated(data.date)
            setAddress(data.address)
            setApplicantImg(data.applicantImg)
            setApplicantName(data.applicantName)
            setContactNo(data.contactNo)
            setEmail(data.email)
            setValidId(data.validId)    
            console.log(data.adoptionReference)        
        } catch (error) {
            console.log(error)
        }
    }

    const getInterviewSched = async () => {
        try {
            const { data } = await axios.get(`http://localhost:5000/api/admins/getInterviewSched/${route.params.id}`)
            setInterviewSched(data)
            console.log(data)
        } catch (error) {
            console.log(error)
        }
    }

    const getPickupMsg = async () => {
        const { data } = await axios.post(`http://localhost:5000/api/admins/getPickupMsg`, { adoptionReference })
        setPickupSched(data)
        console.log(data)
    }

    const getAnimalById = async () => {
        try {
            const { data } = await axios.get(`http://localhost:5000/api/animals/${animalId}`)
            console.log(data)
            setTagNo(data.tagNo)
        } catch (error) {
            console.log(error)
        }
    }
    
    const cancelAdoption = async () => {
        try {
            const { data } = await axios.put(`http://localhost:5000/api/users/removeRegFromAdoption`, { adoptionReference })
            console.log(data)
        } catch (error) {
            console.log(error)            
        }

        try {
            const { data } = await axios.post(`http://localhost:5000/api/users/cancelAdoption`, { adoptionId, animalId, userId })
            console.log(data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getAdoption()
        getInterviewSched()
        setUserId(storedCredentials.id)
    }, [])

    useEffect(() => {
        animalId && getAnimalById()
    }, [animalId])

    useEffect(() => {
        adoptionReference && getPickupMsg()
    }, [adoptionReference])
    
    return (
        <SafeAreaView style={{ flex: 1 }}>
            {/* #F0F0F0 */}
            <ScrollView style={{ flex: 1, backgroundColor: '#f3f5f8' }}>

                <ImageBackground style={styles.animalImgBg} source={animalImg}>
                    <View style={styles.overlay}></View>

                    <View style={styles.returnContainer}>
                        <TouchableOpacity style={styles.returnBtn} onPress={() => navigation.goBack()}>
                            <Ionicons name='chevron-back' size={24} color='#111' />
                        </TouchableOpacity>

                        <Text style={styles.screenName}>Adoption Details</Text>
                    </View>

                    <Text style={styles.animalName}>{animalName}</Text>
                    <Text style={styles.animalBreed}>{animalBreed}</Text>
                </ImageBackground>

                <View style={styles.adoptionInfoContainer}>
                    <Text style={styles.label}>Status:
                        {applicationStatus === 'Pending' &&
                            <Text style={styles.statusPending}>{applicationStatus}</Text>
                        } 

                        {applicationStatus === 'Accepted' &&
                            <Text style={styles.statusAccepted}>{applicationStatus}</Text>
                        } 

                        {applicationStatus === 'Rejected' &&
                            <Text style={styles.statusRejected}>{applicationStatus}</Text>
                        } 

                        {applicationStatus === 'Cancelled' &&
                            <Text style={styles.statusRejected}>{applicationStatus}</Text>
                        } 
                    </Text>
                    <Text style={styles.label}>ID: <Text style={styles.value}>{adoptionId}</Text></Text>
                    <Text style={styles.label}>Date Submitted: <Text style={styles.value}>{dateCreated}</Text></Text>
                </View>

                <View style={styles.animalInfoContainer}>
                    <Text style={styles.infoHeader}>Pet's Information</Text>

                    <Text style={styles.label}>ID: <Text style={styles.value}>{animalId}</Text></Text>
                    <Text style={styles.label}>Tag No.: <Text style={styles.value}>{tagNo}</Text></Text>
                    <Text style={styles.label}>Type: <Text style={styles.value}>{animalType}</Text></Text>
                    <Text style={styles.label}>Color: <Text style={styles.value}>{animalColor}</Text></Text>
                    <Text style={styles.label}>Gender: <Text style={styles.value}>{animalGender}</Text></Text>
                </View>

                <View style={styles.userInfoContainer}>
                    <Text style={styles.infoHeader}>Adopter's Information</Text>

                    <Text style={styles.label}>Name: <Text style={styles.value}>{applicantName}</Text></Text>
                    <Text style={styles.label}>Email: <Text style={styles.value}>{email}</Text></Text>
                    <Text style={styles.label}>Contact No.: <Text style={styles.value}>{contactNo}</Text></Text>
                    <Text style={styles.labelAddress}>Address</Text>
                    <Text style={styles.valueAddress}>{address}</Text>
                </View>

                <View style={styles.scheduleContainerInterview}>
                    {viewInterviewSched === true ?
                        <TouchableOpacity style={styles.scheduleHeadingActive} onPress={() => setViewInterviewSched(!viewInterviewSched)}>
                            <Text style={styles.scheduleTitle}>Interview Schedule</Text>

                            <TouchableOpacity style={styles.toggleSchedContainer} onPress={() => setViewInterviewSched(!viewInterviewSched)}>
                                <Ionicons name='ios-chevron-down' size={20} color='#111' />
                            </TouchableOpacity>
                        </TouchableOpacity>
                        :
                        <TouchableOpacity style={styles.scheduleHeading} onPress={() => setViewInterviewSched(!viewInterviewSched)}>
                            <Text style={styles.scheduleTitle}>Interview Schedule</Text>

                            <TouchableOpacity style={styles.toggleSchedContainer} onPress={() => setViewInterviewSched(!viewInterviewSched)}>
                                <Ionicons name='ios-chevron-forward' size={20} color='#111' />
                            </TouchableOpacity>
                        </TouchableOpacity>
                    }

                    <View style={styles.scheduleBody}>
                        {viewInterviewSched === true ?
                            interviewSched && interviewSched ?
                                <View style={styles.interviewSchedContainer}>
                                    <Image source={InterviewPng} style={styles.emptyPng}/>
                                    <View>
                                        <Text style={styles.label}>Date: <Text style={styles.value}>{interviewSched && interviewSched.date}</Text></Text>
                                        <Text style={styles.label}>Time: <Text style={styles.value}>{interviewSched && interviewSched.time}</Text></Text>
                                    </View>
                                </View>
                                :
                                <View style={styles.interviewSchedContainer}>
                                    <Text>No Schedule set.</Text>
                                </View>
                            :
                            <></>
                        }
                    </View>
                </View>

                <View style={styles.scheduleContainer}>
                    {viewPickupSched === true ?
                        <TouchableOpacity style={styles.scheduleHeadingActive} onPress={() => setViewPickupSched(!viewPickupSched)}>
                            <Text style={styles.scheduleTitle}>Pet Pickup Schedule</Text>

                            <TouchableOpacity style={styles.toggleSchedContainer} onPress={() => setViewPickupSched(!viewPickupSched)}>
                                <Ionicons name='ios-chevron-down' size={20} color='#111' />
                            </TouchableOpacity>
                        </TouchableOpacity>
                        :
                        <TouchableOpacity style={styles.scheduleHeading} onPress={() => setViewPickupSched(!viewPickupSched)}>
                            <Text style={styles.scheduleTitle}>Pet Pickup Schedule</Text>

                            <TouchableOpacity style={styles.toggleSchedContainer} onPress={() => setViewPickupSched(!viewPickupSched)}>
                                <Ionicons name='ios-chevron-forward' size={20} color='#111' />
                            </TouchableOpacity>
                        </TouchableOpacity>
                    }

                    <View style={styles.scheduleBody}>
                        {viewPickupSched === true ?
                            pickupSched && pickupSched ?
                                <View style={styles.interviewSchedContainer}>
                                    <Image source={InterviewPng} style={styles.emptyPng}/>
                                    <View>
                                        <Text style={styles.label}>Date: <Text style={styles.value}>{pickupSched && pickupSched.pickupDate}</Text></Text>
                                        <Text style={styles.label}>Time: <Text style={styles.value}>{pickupSched && pickupSched.pickupTime}</Text></Text>
                                    </View>
                                </View>
                                :
                                <View style={styles.interviewSchedContainer}>
                                    <Text>No Schedule set.</Text>
                                </View>
                            :
                            <></>
                        }
                    </View>
                </View>

                {applicationStatus === 'Pending' ?
                    <>
                        <TouchableOpacity style={styles.cancelAdoptionBtn} onPress={() => cancelAdoption()}>
                            <Text>Cancel Adoption</Text>
                        </TouchableOpacity>
                    </>
                    :
                    <>
                    </>
                }
                
            </ScrollView>
        </SafeAreaView>
    )
}

export default UserAdoption

const styles = StyleSheet.create({
    animalImgBg: {
        height: 340,
        width: '100%',
        zIndex: 1,
        position: 'relative',
    },

    overlay: {
        position: 'absolute',
        backgroundColor: '#111',
        opacity: .25,
        top: 0,
        left: 0,
        height: '100%',
        width: '100%',
        zIndex: 5,
    },

    returnContainer: {
        position: 'absolute',
        top: 25,
        left: 30, // 20,
        zIndex: 10,
        flexDirection: 'row',

    },

    returnBtn: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 33,
        width: 33,
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

    screenName: {
        fontFamily: 'PoppinsExtraLight',
        fontSize: 14,
        color: 'white',
        zIndex: 10,
        marginTop: 7,
        marginLeft: 10,
    },

    animalName: {
        fontFamily: 'PoppinsBold',
        fontSize: 45,
        zIndex: 10,
        color: 'white',
        marginTop: 225,
        marginLeft: 30,
        zIndex: 10,
    },

    animalBreed: {
        fontFamily: 'PoppinsExtraLight',
        fontSize: 24,
        zIndex: 10,
        color: 'white',
        marginTop: -8,
        marginLeft: 30,
        zIndex: 10,
    },

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
    
    adoptionInfoContainer: {
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
    
    animalInfoContainer: {
        backgroundColor: 'white',
        borderRadius: 5,
        marginTop: 15,
        marginRight: 30,
        marginLeft: 30,
        paddingTop: 15,
        paddingRight: 15,
        paddingBottom: 10,
        paddingLeft: 15,
    },

    userInfoContainer: {
        backgroundColor: 'white',
        borderRadius: 5,
        marginTop: 15,
        marginRight: 30,
        marginLeft: 30,
        paddingTop: 15,
        paddingRight: 15,
        paddingBottom: 10,
        paddingLeft: 15,
    },

    scheduleContainer: {
        marginTop: 15,
        marginRight: 30,
        marginBottom: 30,
        marginLeft: 30,
        backgroundColor: 'white',
    },

    scheduleContainerInterview: {
        marginTop: 15,
        marginRight: 30,
        marginLeft: 30,
        backgroundColor: 'white',
    },

    scheduleHeading: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: 5,
        paddingTop: 7,
        paddingRight: 15,
        paddingBottom: 7,
        paddingLeft: 15,
    },

    scheduleHeadingActive: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        paddingTop: 7,
        paddingRight: 15,
        paddingBottom: 7,
        paddingLeft: 15,
        borderBottomColor: '#b0b0b0',
        borderBottomWidth: .5,
    },

    scheduleTitle: {
        fontFamily: 'PoppinsMedium',
        fontSize: 13,
    },  

    scheduleBody: {
        
    },

    interviewSchedContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        paddingTop: 15,
        paddingBottom: 15,
    },

    emptyPng: {
        height: 100,
        width: 100,
    }
})