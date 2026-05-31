import { Linking, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { dimentions } from '../../constants/dimentions'
import colors from '../../constants/Colors'
import CustomButton from '../../components/CustomBotton/CustomButton'
import Spacer from '../../components/Spacer/Spacer'
import Logo from '../../components/Logo/Logo'

type Props = {
  uri:string
}

const UpdateAppScreen = ({uri}: Props) => {
  
  return (
    <SafeAreaView style={{flex:1}} >
        <View style={{width:dimentions.vw,height:dimentions.vh,backgroundColor:colors.white,justifyContent:"center",alignItems:"center",paddingHorizontal:50}}>

             <Logo/>
             <Spacer height={20}/>
             <Text style={{fontSize:18,fontWeight:"bold",color:colors.black}}>
                UPDATE APP
             </Text>

         
             <Spacer/>
             <Text style={{fontSize:14,fontWeight:"400",color:colors.gray500,textAlign:"center"}}>
                The version of the app your using is nolonger supported; please click the button below to get a new version
             </Text>

             <Spacer height={30} />

             <CustomButton
                title='UPDATE NOW'
                onPress={()=>{
                  uri &&  Linking.openURL(uri);
                }}
              />
        </View>
    </SafeAreaView>
  )
}

export default UpdateAppScreen

const styles = StyleSheet.create({})

