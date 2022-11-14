import React, { useEffect, useRef } from 'react'
import { Animated, Easing, Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View, SafeAreaView } from 'react-native'
import { StackActions } from '@react-navigation/native'
import { useNavigation } from '@react-navigation/native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import FontAwesome from 'react-native-vector-icons/FontAwesome5'
import Feather from 'react-native-vector-icons/Feather'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import logoBlack from '../assets/Logo/logo-black.svg'
import UpdatedLogo from '../assets/Logo/refined-logo.png'
import OnBoardingImg from '../assets/Images/onBoarding.png'

const OnBoarding = () => {
    const navigation = useNavigation()
    const bgOpacity = useRef(new Animated.Value(0)).current
    const txtHead1 = useRef(new Animated.Value(0)).current
    const txtHead2 = useRef(new Animated.Value(0)).current
    const txtSubHead = useRef(new Animated.Value(0)).current
    const getStartedBtn = useRef(new Animated.Value(0)).current
    const getStartedBtnIcon = useRef(new Animated.Value(0)).current
    const getStartedTxt = useRef(new Animated.Value(0)).current

    const animate = () => {
        Animated.sequence([
            Animated.timing(bgOpacity, {
                toValue: 1,
                duration: 600,
                easing: Easing.in,
                useNativeDriver: true,
            }),
            Animated.parallel([
                Animated.timing(txtHead1, {
                    toValue: 1,
                    useNativeDriver: true
                }),
                Animated.timing(txtHead2, {
                    toValue: 1,
                    delay: 150,
                    useNativeDriver: true,
                }),
                Animated.timing(txtSubHead, {
                    toValue: 1,
                    delay: 250,
                    useNativeDriver: true,
                }),
            ]),
            Animated.timing(getStartedBtn, {
                toValue: 1,
                easing: Easing.in,
                useNativeDriver: true
            }),
            Animated.parallel([
                Animated.timing(getStartedBtnIcon, {
                    toValue: 1,
                    easing: Easing.in,
                    useNativeDriver: true
                }),
                Animated.timing(getStartedTxt, {
                    toValue: 1,
                    easing: Easing.in,
                    useNativeDriver: true
                })
            ])               
        ]).start()
    }

    useEffect(() => {
        animate()
    }, [])

    return (
        <SafeAreaView style={{ flex: 1, position: 'relative' }}>
            <Animated.Image source={OnBoardingImg} style={[ styles.bgImg, { opacity: bgOpacity } ]} />
            
            <Animated.Text 
                style={[
                    styles.txtHead, 
                    { 
                        opacity: txtHead1, 
                        marginTop: 460,
                        transform: [{
                            translateY: txtHead1.interpolate({
                                inputRange: [0, 1],
                                outputRange: [-70, 0]
                            })}
                        ],
                    }
                ]}>Discover
            </Animated.Text>

            <Animated.Text 
                style={[
                    styles.txtHead, 
                    { 
                        color: '#ffff66',
                        marginTop: -22,
                        opacity: txtHead2,
                        transform: [{
                            translateY: txtHead2.interpolate({
                                inputRange: [0, 1],
                                outputRange: [-70, 0]
                            })}
                        ],
                    }
                ]}>COMPANIONS
            </Animated.Text>
            
            <Animated.Text 
                style={[ 
                    styles.txtSubHead,
                    { 
                        opacity: txtSubHead,
                        transform: [{
                            translateY: txtSubHead.interpolate({
                                inputRange: [0, 1],
                                outputRange: [30, 0]
                            })
                        }] 
                    }
                ]}>Adopt <Text style={{ color: '#ffff66' }}>Now</Text>
                </Animated.Text>

            <TouchableOpacity style={{ alignSelf: 'flex-start', marginRight: 'auto', marginLeft: 'auto', zIndex: 5 }} onPress={() => navigation.dispatch(StackActions.push('Login'))}>
                <Animated.View 
                    style={[
                        styles.getStartedBtn,
                        {
                            opacity: getStartedBtn,
                            transform: [{
                                translateY: getStartedBtn.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [30, 0]
                                }),
                                scale: getStartedBtn.interpolate({
                                    inputRange: [0, 0.5, 1],
                                    outputRange: [.5, 10, 1]
                                })
                            }]
                        }
                    ]}>
                    <Animated.View style={{ opacity: getStartedBtnIcon }}>
                        <Feather name='arrow-right' color='#111' size={25} />
                    </Animated.View>
                </Animated.View>
            </TouchableOpacity>

            <Animated.Text style={[styles.getStartedTxt, { opacity: getStartedTxt }]}>Get Started</Animated.Text>
        </SafeAreaView>
    )
}

export default OnBoarding

const styles = StyleSheet.create({
    bgImg: {
        position: 'absolute',
        zIndex: 1,
        height: '100%',
        width: '100%',
    },

    txtHead: {
        fontFamily: 'PoppinsBold',
        fontSize: 48,
        textAlign: 'center',
        // opacity: .55,
        color: 'white',
        zIndex: 5,
    },

    txtSubHead: {
        color: 'white',
        fontFamily: 'PoppinsLight',
        fontSize: 20,
        textAlign: 'center',
        opacity: .75,
        zIndex: 5
    },
    
    getStartedBtn: {
        height: 50,
        width: 50,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 100,
        marginTop: 60,
        marginRight: 'auto',
        marginLeft: 'auto',
    },

    getStartedTxt: {
        fontFamily: 'PoppinsExtraLight',
        fontSize: 12,
        textAlign: 'center',
        color: 'white',
        marginTop: 10,
        zIndex: 5
    },
})