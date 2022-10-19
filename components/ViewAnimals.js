import React, { useState, useEffect, useContext, useRef } from 'react'
import { ActivityIndicator, Animated, FlatList, Image, ImageBackground, RefreshControl, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { quickSort } from './SubComponents/QuickSort'
import { CredentialsContext } from './CredentialsContext'
import SuggestedCard from './SubComponents/SuggestedCard'
import TopNav from './SubComponents/TopNav'
import BottomNav from './SubComponents/BottomNav'
import EmptyList from '../assets/Images/empty-adoption-list.png'
import catIllustration from '../assets/Images/catIllustration.png'
import dogIllustration from '../assets/Images/dogIllustration.png'
import logoBlack from '../assets/Logo/logo-black.png'
import axios from 'axios'
import avatar from '../assets/Images/avatar-vector.png'
import heroLeftMost from '../assets/Home/heroLeftMost.png'
import heroUpperRight from '../assets/Home/dogs-container.png'
import heroLowerMostRight from '../assets/Home/cat-container.png'

const ViewAnimals = ({ navigation }) => {
    const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext)
    const URL = 'https://furryhopebackend.herokuapp.com/'
    // console.log(storedCredentials)
    const [fName, setFName] = useState('')
    // const [currentTab, setCurrentTab] = useState('Browse')
    const [browseActive, setBrowseActive] = useState(true)
    // const [suggestedActive, setSuggestedActive] = useState(false)
    const scrollX = useRef(new Animated.Value(0)).current

    const [animalPreferences, setAnimalPreferences] = useState()
    const [breedPreference, setBreedPreference] = useState()
    const [colorPreferences, setColorPreferences] = useState()
    const [genderPreference, setGenderPreference] = useState()
    const [sizePreference, setSizePreference] = useState()
    const [notAdopted, setNotAdopted] = useState([])

    const [list, setList] = useState([])
    const [breedList, setBreedList] = useState([])
    const [colorList, setColorList] = useState([])
    const [genderList, setGenderList] = useState([])
    const [sizeList, setSizeList] = useState([])

    const filterPreferences = async () => {
        let user = {}

        try {
            const { data } = await axios.get(`http://localhost:5000/api/users/getUserById/${storedCredentials.id}`)
            user = data
        } catch (error) {
            console.log(error)
        }

        if(user && user.animalPreference === 'Dog') {
            console.log('get dogs')
            try {
                const { data:userData } = await axios.get(`http://localhost:5000/api/users/getUserById/${storedCredentials.id}`)
                const { data:animalData } = await axios.get(`http://localhost:5000/api/animals/getDogs`)
                setAnimalPreferences(userData.animalPreference)
                setBreedPreference(userData.breedPreferences)
                setColorPreferences(userData.colorPreferences)
                setGenderPreference(userData.genderPreference)
                setSizePreference(userData.sizePreference)
                setNotAdopted(animalData)
            } catch (error) {
                console.log(error)
            }
        } else if(user && user.animalPreference === 'Cat') {
            console.log('get cats')
            try {
                const { data:userData } = await axios.get(`http://localhost:5000/api/users/getUserById/${storedCredentials.id}`)
                const { data:animalData } = await axios.get(`http://localhost:5000/api/animals/getCats`)
                setAnimalPreferences(userData.animalPreference)
                setBreedPreference(userData.breedPreferences)
                setColorPreferences(userData.colorPreferences)
                setGenderPreference(userData.genderPreference)
                setSizePreference(userData.sizePreference)
                setNotAdopted(animalData)
            } catch (error) {
                console.log(error)
            }
        } else if(user && user.animalPreference === 'Both') {
            console.log('get both')
            try {
                const { data:userData } = await axios.get(`http://localhost:5000/api/users/getUserById/${storedCredentials.id}`)
                const { data:animalData } = await axios.get(`http://localhost:5000/api/animals/getBoth`)
                setAnimalPreferences(userData.animalPreference)
                setBreedPreference(userData.breedPreferences)
                setColorPreferences(userData.colorPreferences)
                setGenderPreference(userData.genderPreference)
                setSizePreference(userData.sizePreference)
                setNotAdopted(animalData)
            } catch (error) {
                console.log(error)
            }
        }
    }

    const renderPreferences = () => {
        // console.log(breedPreference && breedPreference)
        // console.log(colorPreference && colorPreference)

        if(breedList.length >= 1) {
            console.log('List has already been set')
            return
        } else {
            let breeds = []
            let colors = []
            let animalGender = []
    
            notAdopted.forEach((item) => {
                breeds.push(item.breed)
                colors.push(item.color)
                animalGender.push(item.gender)
            })
    
            let uniqueBreeds = [...new Set(breeds)]
            let uniqueColors = [...new Set(colors)]
            let uniqueAnimalGender = [...new Set(animalGender)]

            breedPreference && breedPreference.forEach((pref) => {
                if(uniqueBreeds.includes(pref)) {
                    let filteredBreed = notAdopted.filter(animal => animal.breed === pref)
                    setBreedList(...breedList, filteredBreed)
                    console.log(filteredBreed)
                } 
            })

            colorPreferences && colorPreferences.forEach((pref) => {
                if(uniqueColors.includes(pref)) {
                    let filtered = notAdopted.filter(animal => animal.color === pref)
                    setColorList(...colorList, filtered)
                }
            })

            let filteredGender = notAdopted.filter(animal => animal.gender === genderPreference)
            setGenderList(...genderList, filteredGender)

            let filteredSize = notAdopted.filter(animal => animal.size === sizePreference)
            setSizeList(...sizeList, filteredSize)
        }
    }

    const getUser = async () => {
        try {
            const { data } = await axios.get(`http://localhost:5000/api/users/getUserById/${storedCredentials.id}`)
            let split = data.fullName.split(' ')
            let firstName = split[0]
            setFName(firstName)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        filterPreferences()
        getUser()
    }, [])

    // useEffect(() => {
    //     let split = storedCredentials.fullName.split(' ')
    //     let firstName = split[0]
    //     setFName(firstName)
    // }, [])

    const toggleBrowse = () => {
        setBrowseActive(true)
    }

    const toggleSuggested = () => {
        renderPreferences()
        setBrowseActive(false)
    }

    const emptyList = () => {
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <Image
                    style={{
                        width: 300,
                        height: 300,
                        marginLeft: 'auto',
                        marginRight: 'auto',
                    }}
                    source={EmptyList}
                />
                <Text
                    style={{
                        textAlign: 'center',
                        fontSize: 18,
                        fontFamily: 'Poppins_300Light',
                    }}
                >
                    Oh, it seems like there are no animals{'\n'}
                    for adoption. All our animals have{'\n'}
                    been adopted.
                </Text>
            </div>
        )
    }

    const renderLoadMore = () => {
        return (
            <ActivityIndicator size='large' color='#111' style={styles.loadMoreIndicator}/>
        )
    }

    return (
        <SafeAreaView style={styles.body}>
            <ScrollView style={styles.flexContainer}>
                <View style={styles.topNavContainer}>
                    <TopNav ScreenName='Animals' color='#111' />

                    <View style={styles.toggleTabContainer}>
                        <TouchableOpacity style={browseActive ? styles.toggleTabActive : styles.toggleTab} onPress={() => toggleBrowse()}>
                            <Text style={browseActive ? styles.toggleTabTxtActive : styles.toggleTabTxt}>Browse</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={browseActive ? styles.toggleTab : styles.toggleTabActive} onPress={() => toggleSuggested()}>
                            <Text style={browseActive ? styles.toggleTabTxt : styles.toggleTabTxtActive}>For You</Text>
                        </TouchableOpacity>
                    </View>
                </View>


                {/* <View style={{ position: 'absolute', top: 320, left: 0, }}> 
                    <Text style={styles.heading}>Hello {fName}</Text>
                    <Text style={styles.subHeading}>Make a new friend today</Text>
                </View> */}

                <View style={styles.top_margin}></View>

                <Text style={styles.screenHeading}>EXPLORE</Text>
                <Text style={styles.screenSubHeading}>Find your new buddy</Text>

                <View style={styles.heroSection}>
                    <View style={styles.heroLeftMost}>
                        <Image source={heroLeftMost} style={{ height: 200, width: 200, marginLeft: 30, }} />
                    </View>

                    <View style={styles.heroRight}>
                        <View style={styles.heroUpperRight}>
                            <Image source={heroUpperRight} style={{ height: 150, width: 160, marginTop: 40 }}/>
                        </View>

                        <View style={styles.heroLowerRight}>
                            <Image source={avatar} style={styles.heroLowerMostLeft} />

                            <View style={styles.heroLowerMostRight}>
                                <Image source={heroLowerMostRight} style={{ height: 90, width: 100, marginTop: 15, marginLeft: 30 }} />
                            </View>
                        </View>
                    </View>
                </View>

                {browseActive ?
                    <View>
                        {/* <View style={styles.testimonyContainer}>
                            <Image source={avatar} style={styles.avatar}/>
                            <Text style={styles.testimonyHeader}>Save lives.</Text>
                            <Text style={styles.testimonySub}>Adopt one today.</Text>
                        </View> */}


                        <Text style={styles.categoryHeading}>Choose among our different animals</Text>
                        <TouchableOpacity style={styles.animalCategoryContainer} onPress={() => navigation.navigate('Dogs')}>
                            <Image source={dogIllustration} style={styles.dogIllustration} />
                            <Text style={styles.categoryTxt}>DOGS</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.animalCategoryContainer, styles.catCategory]} onPress={() => navigation.navigate('Cats')}>
                            <Image source={catIllustration} style={styles.catIllustration} />
                            <Text style={styles.categoryTxt}>CATS</Text>
                        </TouchableOpacity>
                    </View>
                    :   
                    <View>
                        <Text style={{ fontSize: 25, fontFamily: 'PoppinsBold', marginLeft: 30, marginRight: 30 ,marginBottom: 15, }}>Animals suggested for you</Text>

                        <Text style={styles.suggestedLabel}>Based on breed</Text>
                        <ScrollView horizontal={true}>
                            <View style={styles.suggestedContainer}>
                                {breedList && breedList.map((item) => (
                                    <SuggestedCard
                                        key={item._id}
                                        _id={item._id}
                                        animalImg={item.animalImg}
                                        name={item.name}
                                        breed={item.breed} 
                                    />
                                ))}

                                {breedList && breedList.length === 0 &&
                                    <>
                                        <Text style={{ textAlign: 'center' }}>No animals</Text>
                                    </>

                                }
                                </View>
                        </ScrollView>

                        <Text style={styles.suggestedLabel}>Based on color</Text>
                        <ScrollView horizontal={true}>
                            <View style={styles.suggestedContainer}>
                                {colorList && colorList.map((item) => (
                                    <SuggestedCard
                                        key={item._id}
                                        _id={item._id}
                                        animalImg={item.animalImg}
                                        name={item.name}
                                        breed={item.breed}
                                    />
                                ))}

                                {colorList && colorList.length === 0 &&
                                    <>
                                        <Text style={{ textAlign: 'center' }}>No animals</Text>
                                    </>

                                }
                            </View>
                        </ScrollView>

                        <Text style={styles.suggestedLabel}>Based on gender</Text>
                        <ScrollView horizontal={true}>
                            <View style={styles.suggestedContainer}>
                                {genderList && genderList.map((item) => (
                                    <SuggestedCard
                                        key={item._id}
                                        _id={item._id}
                                        animalImg={item.animalImg}
                                        name={item.name}
                                        breed={item.breed}
                                    />
                                ))}

                                {genderList && genderList.length === 0 &&
                                    <>
                                        <Text style={{ textAlign: 'center' }}>No animals</Text>
                                    </>

                                }
                            </View>
                        </ScrollView>

                        <Text style={styles.suggestedLabel}>Based on size</Text>
                        <ScrollView horizontal={true}>
                            <View style={styles.suggestedContainer}>
                                {sizeList && sizeList.map((item) => (
                                    <SuggestedCard
                                        key={item._id}
                                        _id={item._id}
                                        animalImg={item.animalImg}
                                        name={item.name}
                                        breed={item.breed}
                                    />
                                ))}

                                {sizeList && sizeList.length === 0 &&
                                    <>
                                        <Text style={{ textAlign: 'center' }}>No animals</Text>
                                    </>

                                }
                            </View>
                        </ScrollView>
                    </View>
                }
                
                <View style={styles.bot_margin}></View>
            </ScrollView>
            <BottomNav />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    body: {
        flex: 1,
        // backgroundColor: '#f5f5f5',
        backgroundColor: '#fff',
        position: 'relative',
    },

    topNavContainer: {
        shadowColor: '#111',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        backgroundColor: 'white',
    },

    toggleTabContainer: {
        width: '100%',
        flexDirection: 'row',
        // justifyContent: 'space-evenly',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 1,
        borderBottomColor: '#111',
    },

    toggleTab: {
        width: '50%',
        paddingBottom: 7,
    },

    toggleTabActive: {
        width: '50%',
        borderBottomColor: '#111',
        borderBottomWidth: 2,
        paddingBottom: 7,
    },

    toggleTabTxt: {
        textAlign: 'center',
    },

    toggleTabTxtActive: {
        fontFamily: 'PoppinsMedium',
        textAlign: 'center',
    },

    screenHeading: {
        fontFamily: 'PoppinsSemiBold',
        fontSize: 20,
        marginLeft: 30
    },

    screenSubHeading: {
        fontFamily: 'PoppinsLight',
        fontSize: 14,
        marginTop: -3,
        marginBottom: 10,
        marginLeft: 30
    },

    heroSection: {
        marginRight: 30,
        marginLeft: 30,
        flexDirection: 'row',
        gap: 10,
    },

    heroLeftMost: {
        height: 250,
        width: 130,
        backgroundColor: '#6bffb8',
        borderRadius: 5,
        overflow: 'hidden',
        justifyContent: 'flex-end',
        alignItems: 'center',
        zIndex: 5,
    },
    
    heroRight: {
        gap: 10,
    },

    heroUpperRight: {
        width: 210,
        height: 140,
        backgroundColor: 'aqua',
        borderRadius: 5,
        overflow: 'hidden',
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },

    heroLowerRight: {
        flexDirection: 'row',
        gap: 10
    },

    heroLowerMostLeft: {
        height: 100,
        width: 100,
        borderRadius: 100,
    },
    heroLowerMostRight: {
        height: 100,
        width: 100,
        backgroundColor: '#ffff66',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        overflow: 'hidden',
    },

    suggestedLabel: {
        marginTop: 25,
        marginLeft: 30,
        marginBottom: 10,
        fontFamily: 'PoppinsMedium',
        fontSize: 12.5,
        backgroundColor: '#e6e6e6',
        borderRadius: 5,
        alignSelf: 'flex-start',
        padding: 5,
    },

    suggestedContainer: {
        flexDirection: 'row',
        // marginRight: 30,
        alignItems: 'center',
        gap: 12,
        marginLeft: 30,
        marginBottom: 12,
    },

    top_margin: {
        marginTop: 55,
    },

    heading: {
        fontFamily: 'PoppinsSemiBold',
        fontSize: 50,
        marginLeft: 30,
        color: 'white',
        lineHeight: 55,
    },

    subHeading: {
        fontFamily: 'PoppinsExtraLight',
        fontSize: 21,
        marginTop: 10,
        marginLeft: 30,
        color: 'white',
    },

    testimonyContainer: {
        backgroundColor: '#FFEDD2',
        height: 140,
        marginLeft: 30,
        marginRight: 30,
        position: 'relative',
    },

    testimonyHeader: {
        fontFamily: 'PoppinsBold',
        fontSize: 30,
        marginTop: 33,
        marginLeft: 130,
    },

    testimonySub: {
        fontFamily: 'PoppinsLight',
        fontSize: 20,
        marginTop: -8,
        marginLeft: 130,
    },

    avatar: {
        height: 85,
        width: 85,
        position: 'absolute',
        borderColor: 'white',
        top: 30,
        left: 20,
    },

    categoryHeading: {
        fontFamily: 'PoppinsLight',
        fontSize: 16,
        marginTop: 40,
        marginBottom: 10,
        marginLeft: 30,
    },

    animalCategoryContainer: {
        borderRadius: 5,
        marginRight: 'auto',
        marginLeft: 'auto',
        height: 161,
        width: 352,
        overflow: 'hidden',
        backgroundColor: '#111',
        position: 'relative',
        zIndex: 1,
    },

    catCategory: {
        marginTop: 10,
    },

    dogIllustration: {
        height: 160,
        width: 160,
        position: 'absolute',
        top: 18,
        left: 16,
        zIndex: 2
    },

    catIllustration: {
        height: 150,
        width: 150,
        position: 'absolute',
        top: 12,
        left: 20,
        zIndex: 2
    },

    categoryTxt: {
        color: 'white',
        fontFamily: 'PoppinsBold',
        fontSize: 40,
        marginTop: 'auto',
        marginBottom: 'auto',
        marginLeft: 200,
    },
   
    bot_margin: {
        marginBottom: 100,
    },

    loadMoreIndicator: {
        marginTop: 15,
        marginBottom: 20,
    },
})

export default ViewAnimals