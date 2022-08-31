import React from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import Ionicons from 'react-native-vector-icons/Ionicons'

const TopNavAbsolute = (props) => {
    // Context
    const navigation = useNavigation();

    return (
        <View style={{ height: 'auto', width: '100%', flexDirection: 'row', alignItems: 'center', zIndex: 5,  position: 'absolute', top: 0, left: 0,}}>
            <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
                <Ionicons name='ios-menu-outline' size={33} style={{ marginTop: 27, marginLeft: 27 }} color={props.color} />
            </TouchableOpacity>
            <Text style={{ color: `${props.color}`, fontFamily: 'PoppinsLight', fontSize: 14.8, marginTop: 27, marginLeft: 10 }}>{props.ScreenName}</Text> 
        </View>
    )
}

export default TopNavAbsolute
