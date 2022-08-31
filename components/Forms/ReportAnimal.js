import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import returnIcon from '../../assets/ReportAnimal/returnIcon-white.svg'
import cameraIcon from '../../assets/ReportAnimal/camera-icon.png'
import galleryIcon from '../../assets/ReportAnimal/gallery-icon.png'
import * as ImagePicker from 'expo-image-picker'
import * as Location from 'expo-location'
import { useNavigation } from '@react-navigation/native'
import { Alert, Image, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, useWindowDimensions, View } from 'react-native'
import { CredentialsContext } from '../CredentialsContext'
import BottomNav from '../SubComponents/BottomNav'
import TopNav from '../SubComponents/TopNav'

const ReportAnimal = () => {
    const URL = 'https://furryhopebackend.herokuapp.com/'
    const navigation = useNavigation()
    const window = useWindowDimensions()

    const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext)
    const [date, setDate] = useState()
    const [location, setLocation] = useState('')
    const [description, setDescription] = useState('')
    const [img, setImg] = useState('http://res.cloudinary.com/drvd7jh0b/image/upload/v1640256598/hyr5slabmcd9zf8xddrv.png')
    const [image, setImage] = useState('http://res.cloudinary.com/drvd7jh0b/image/upload/v1640256598/hyr5slabmcd9zf8xddrv.png')
    const [userToken, setUserToken] = useState('')
    const [toggleActive, setToggleActive] = useState('Submit')
    const [isCitizen, setIsCitizen] = useState()
    const [reports, setReports] = useState()

    const pickAnImage_Gallery = async () => {
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
            setImg(result.uri)
        }
    }

    const captureAnImage_Camera = async () => {
        const { granted } = await Permissions.askAsync(Permissions.CAMERA)

        if(granted) {
            let data = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            })

            if(!data.cancelled) {
                let base64Img = `data:image/jpg;base64,${result.base64}`
                uploadHandler(base64Img)
            }
        } else {
            alert('')
        }
    }

    const config = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${storedCredentials.token}`
        }
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
            setImage(response)
        })
        .catch((error) => {
            console.log(error)    
        })
        
    }

    const toggleSubmit = () => {
        setToggleActive('Submit')
        console.log('submit')
    }

    const toggleList = () => {
        setToggleActive('List')
        console.log('list')
    }

    const getUserById = async () => {
        const { data } = await axios.get(`http://localhost:5000/api/users/getUserById/${storedCredentials.id}`)
        console.log(data)
        setIsCitizen(data.isMarikinaCitizen)
    }

    const getReportsPerUser = async () => {
        const { data } = await axios.get(`http://localhost:5000/api/users/getReportsPerUser`, config)
        setReports(data)
        console.log(data)
    }

    useEffect(() => {
        let d = new Date()
        setDate(d.toLocaleDateString(undefined, { day: '2-digit', month: '2-digit', year: 'numeric' }))
        setUserToken(storedCredentials.token)
        getUserById()
        getReportsPerUser()
    }, [])

    const submitReport = async () => {
        if(image == '') {
            setImage(img)
        } else if(!description || !image || !userToken) {
            alert('Please enter the necessary information')
        } else {
            try {
                const { data } = await axios.post(`http://localhost:5000/api/users/report`, { date, location, description, image, userToken }, config)
                console.log(data)
                alert('Thank you for notifying us.')

                setLocation('')
                setDescription('')
                setImg('http://res.cloudinary.com/drvd7jh0b/image/upload/v1640256598/hyr5slabmcd9zf8xddrv.png')
            } catch (error) {
                console.log(error)
                alert(error)
            }
        }
    }

    const [locationFocused, setLocationFocused] = useState()
    const [descFocused, setDescFocused] = useState(false)

    return (
        <SafeAreaView style={styles.body}>
            {isCitizen || 
                <Pressable style={{
                    width: window.width, 
                    height: window.height, 
                    backgroundColor: '#111',
                    opacity: .5,
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    zIndex: 5
                }}></Pressable>
            }

            {isCitizen ||
                <View style={styles.notCitizenModal}>
                    <Text style={styles.notCitizenHeader}>Oops...</Text>
                    <Text style={styles.notCitizednSub}>This feature is only available{'\n'} for citizens of Marikina City</Text>

                    <TouchableOpacity style={styles.redirectBtn} onPress={() => navigation.navigate('Browse')}>
                        <Text style={styles.redirectTxt}>Back to the Main Screen.</Text>
                    </TouchableOpacity>
                </View>
            }

            <ScrollView>
                <TopNav ScreenName='Stray Animal Report' />

                <Text style={styles.heading}>REPORT A STRAY {'\n'}ANIMAL</Text>
                <Text style={styles.subHeading}>
                    Saw an animal wandering around {'\n'}
                    your neighborhood? or somewhere {'\n'}
                    along the streets. Notify us.
                </Text>

                <View style={styles.toggleReportsContainer}>
                    <TouchableOpacity style={toggleActive === 'Submit' ? styles.toggleReportsBtn : styles.toggleReportsBtnNotActive} onPress={() => toggleSubmit()}>
                        <Text style={toggleActive === 'Submit' ? styles.toggleReportsTxt : styles.toggleReportsTxtNotActive}>Submit Report</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={toggleActive !== 'Submit' ? styles.toggleReportsBtn : styles.toggleReportsBtnNotActive} onPress={() => toggleList()}>
                        <Text style={toggleActive !== 'Submit' ? styles.toggleReportsTxt : styles.toggleReportsTxtNotActive}>List of Reports</Text>
                    </TouchableOpacity>
                </View>

                {toggleActive === 'Submit' &&
                    <>
                        <Text style={[styles.reportLabel, { marginTop: 40, }]}>Location where you saw the animal</Text>
                        <TextInput
                            style={locationFocused ? styles.reportInputFocused : styles.reportInput}
                            onFocus={() => setLocationFocused(true)}
                            onBlur={() => setLocationFocused(false)}
                            value={location}
                            onChangeText={setLocation}
                        />

                        <Text style={styles.reportLabel}>Description</Text>
                        <TextInput
                            style={descFocused ? styles.descriptionFocused : styles.description}
                            value={description}
                            onChangeText={setDescription}
                            onFocus={() => setDescFocused(true)}
                            onBlur={() => setDescFocused(false)}
                            multiline={true}
                            numberOfLines={7}
                            placeholder='Describe the situation (the state of the animal, etc.)'
                        />

                        <Text style={styles.imageCaptureText}>Image Upload (Optional)</Text>
                        <View style={styles.imageCaptureContainer}>
                            {/* <TouchableOpacity style={styles.imageCaptureCamera} onPress={() => captureAnImage_Camera()}>
                                <Image style={styles.cameraIcon} source={cameraIcon}/>
                                <Text style={styles.captureText}>CAMERA</Text>
                            </TouchableOpacity> */}

                            <TouchableOpacity style={styles.imageCaptureGallery} onPress={() => pickAnImage_Gallery()}>
                                <Image style={styles.galleryIcon} source={galleryIcon} />
                                <Text style={styles.captureText}>GALLERY</Text>
                            </TouchableOpacity>
                        </View>

                        <Image style={styles.reportAnimalImage} source={img} />

                        <TouchableOpacity style={styles.btnSubmit} onPress={() => submitReport()}>
                            <Text style={styles.btnText}>SUBMIT</Text>
                        </TouchableOpacity>
                    </>
                }

                {toggleActive === 'List' &&
                    <ScrollView style={styles.listOfReportsScroll}>
                        {reports ?
                            reports.map((report) => (
                                <TouchableOpacity style={styles.reportContainer} key={report._id}>
                                    <View style={styles.reportDetails}>
                                        <Text style={styles.dateSubmitted}>Date Submitted: <Text style={styles.reportValue}>{report.date}</Text></Text>
                                        <Text style={styles.reportId}>ID: <Text style={styles.reportValue}>{report._id}</Text></Text>
                                    </View>

                                    <View style={styles.reportStatusContainer}>
                                        <Text style={styles.reportTxt}>{report.animalStatus}</Text>
                                    </View>
                                </TouchableOpacity>
                            ))
                            :
                            <Text>NO REPORTS</Text>
                        }
                    </ScrollView>
                }
            </ScrollView>

            <BottomNav />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    body: {
        flex: 1,
        backgroundColor: 'white',
        position: 'relative',
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
        zIndex: 10,
    },

    notCitizenHeader: {
        fontFamily: 'PoppinsBold',
        fontSize: 28,
        textAlign: 'center',
        marginTop: 30,
    },

    notCitizednSub: {
        textAlign: 'center',
        fontSize: 18,
        lineHeight: 28, 
        marginTop: 5, 
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

    heading: {
        fontFamily: 'PoppinsBold',
        fontSize: 40,
        lineHeight: 45,
        marginTop: 55,
        marginLeft: 35,
    },

    subHeading: {
        fontFamily: 'PoppinsExtraLight',
        fontSize: 19.2,
        lineHeight: 32,
        marginTop: 10,
        marginLeft: 35,
        marginRight: 20,
        marginBottom: 60,
    },

    toggleReportsContainer: {
        flexDirection: 'row',
    },

    toggleReportsBtn: {
        height: 38,
        width: '50%',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomColor: '#111',
        borderBottomWidth: 1.5,
    },

    toggleReportsTxt: {
        fontFamily: 'PoppinsBold',
        fontSize: 16,
    },

    toggleReportsBtnNotActive: {
        height: 35,
        width: '50%',
        justifyContent: 'center',
        alignItems: 'center',
    },

    toggleReportsTxtNotActive: {
        fontFamily: 'PoppinsLight',
        fontSize: 14,
    },
    
    reportLabel: {
        fontFamily: 'PoppinsRegular',
        fontSize: 16,
        marginBottom: 4,
        marginLeft: 35,
    },

    reportInput: {
        height: 45,
        width: '82.5%',
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
        marginRight: 35,
        marginLeft: 35,
    },

    reportInputFocused: {
        height: 45,
        width: '82.5%',
        borderColor: '#111',
        borderWidth: 1,
        borderRadius: 5,
        backgroundColor: 'white',
        fontFamily: 'PoppinsRegular',
        fontSize: 13,
        marginRight: 35,
        marginLeft: 35,
        marginBottom: 20,
        paddingLeft: 10,
        paddingRight: 10,
    },

    description: {
        fontFamily: 'PoppinsLight',
        fontSize: 13,
        marginLeft: 'auto',
        marginRight: 'auto',
        marginBottom: 40,
        padding: 10,
        width: '82.5%',
        borderColor: '#f1f3f7',
        borderWidth: 3,
        borderRadius: 5,
        backgroundColor: '#f3f5f9',
        color: '#8c8c8e',
    },

    descriptionFocused: {
        fontFamily: 'PoppinsLight',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginBottom: 40,
        padding: 10,
        fontSize: 13,
        width: '82.5%',
        borderColor: '#111',
        borderWidth: 1,
        borderRadius: 5,
        backgroundColor: 'white',
    },

    imageCaptureText: {
        fontFamily: 'PoppinsRegular',
        fontSize: 16,
        marginTop: 20,
        marginBottom: 12,
        marginLeft: 35,
    },

    imageCaptureContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginRight: 35,
        marginBottom: 30,
        marginLeft: 35,
    },

    imageCaptureCamera: {
        backgroundColor: '#111',
        borderWidth: 1,
        borderColor: '#111',
        borderRadius: 25,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        width: 140,
        height: 43,
        marginRight: 10,
    },

    cameraIcon: {
        width: 20,
        height: 18,
        marginLeft: 8
    },

    imageCaptureGallery: {
        backgroundColor: '#111',
        borderWidth: 1,
        borderColor: '#111' ,
        borderRadius: 25,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        width: 140,
        height: 43,
    },

    galleryIcon: {
        width: 20,
        height: 20,
        marginTop: 2,
        marginLeft: 8,
    },

    captureText: {
        color: 'white',
        fontFamily: 'PoppinsSemiBold',
        fontSize: 16,
        marginRight: 10,
    },

    reportAnimalImage: {
        marginRight: 35,
        marginBottom: 80,
        marginLeft: 35,
        width: '82.95%',
        height: 240,
        borderRadius: 5,
    },

    btnSubmit: {
        width: '82.95%',
        height: 60,
        backgroundColor: '#111',
        borderWidth: .5,
        borderRadius: 5,
        marginRight: 'auto',
        marginBottom: 100,
        marginLeft: 'auto',
        justifyContent: 'center',
        alignItems: 'center'
    },

    btnText: {
        color: 'white',
        fontFamily: 'PoppinsMedium',
        fontSize: 23.36,
        letterSpacing: 2,
    },

    listOfReportsScroll: {
        height: 335,
        width: '100%',
    },

    reportContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomColor: '#b0b0b0',
        borderBottomWidth: 1,
        paddingTop: 20,
        paddingBottom: 20,
        paddingRight: 15,
        paddingLeft: 15,
    },

    dateSubmitted: {
        fontFamily: 'PoppinsMedium',
        fontSize: 13,
    },

    reportId: {
        fontFamily: 'PoppinsMedium',
        fontSize: 13,
    },

    reportValue: {
        fontFamily: 'PoppinsLight',
        fontSize: 13,
        marginLeft: 2,
    },

    reportStatusContainer: {
        backgroundColor: '#111',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 6,
        paddingRight: 10,
        paddingBottom: 6,
        paddingLeft: 10,
        borderRadius: 5,
    },

    reportTxt: {
        fontFamily: 'PoppinsRegular',
        fontSize: 11,
        color: 'white',
    },
})
export default ReportAnimal
