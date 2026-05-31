import { useNavigation } from "@react-navigation/native"
import { handleVerificationImageUploads } from "../../api/auth/auth.api"
import CustomAppBar from "../../components/CustomAppBar/CustomAppBar"
import CustomButton from "../../components/CustomBotton/CustomButton"
import SafeAreaContainer from "../../components/SafeAreaContainer/SafeAreaContainer"
import colors from "../../constants/Colors"
import { useState } from "react"
import { Image, StyleSheet, ToastAndroid, View } from "react-native"
import { useSelector } from "react-redux"
import { RootState, useAppDispatch } from "../../redux/store"
import { setUploadSide } from "../../redux/feature/auth.feature"
import { screenNames } from "../../navigation/screenNames"


const UploadFront=()=>{

    const navigation:any = useNavigation()
    const dispatch = useAppDispatch()

    const {photo,uploadSide} = useSelector((state:RootState)=> state.authSlice)
    const [loading,setLoading]=useState<boolean>(false)


   const handleUpload=async()=>{
       try {
         setLoading(true)

         if(!photo){
             return
         }

         const data = new FormData()
               data.append("singleFile",{
                 name:`${Math.random()}_image__008`,
                 uri:`file://${photo.path}`,
                 type:"image/jpeg"
               })

               

          const res = await handleVerificationImageUploads(data)
          console.log(res,'============upladed')
       

         setLoading(false)

         if(!res.isSuccess){
            ToastAndroid.show(res.message,4000)
            return 
         }


         //update artist account with image urls
         //
         //
         ToastAndroid.show("Uploaded successfuly",3000)

           if(uploadSide === "front"){
              dispatch(setUploadSide("back"))
              navigation.navigate(screenNames.CaptureDocument)
           }

           if(uploadSide === "back"){
              dispatch(setUploadSide("front"))
              //navigate verification congratulations screen
              navigation.navigate(screenNames.VerifyCongratulations)
           }
         
        
       } catch (error:any) {
        setLoading(false)
        console.log(error)
        console.log(error.message)
       }
   }

    return(
      <SafeAreaContainer>
         <View style={styles.main}>
          {/* app bar */}
                  <View style={{flex:1,width:"100%"}}>
                  <CustomAppBar
          title={`UPLOAD ${uploadSide ? uploadSide.toUpperCase() : ""}`}
          description="Make sure texts are clear and readable before uploading"
        />
        </View>

        {/* image */}

        <View style={{flex:5,width:"100%",justifyContent:"center",alignItems:"center"}}>

          <View style={{width:"100%",height:400,justifyContent:"center",alignItems:"center"}}>
            {photo && <Image source={{uri:`file://${photo.path}`}}
             height={250} width={400} style={{borderRadius:10}} alt="Photo" />}
          </View>

        </View>

        {/* buttons */}
        <View style={{flex:1,width:"100%",justifyContent:"center",alignItems:"center"}}>
           <CustomButton 
             title="Upload"
             onPress={()=>{
               handleUpload()
             }}
             loading={loading}
           />
           <CustomButton 
             title="Retake"
             onPress={()=> navigation.goBack()}
             customStyles={{backgroundColor:"white",borderWidth:1,borderColor:"black"}}
             textStyles={{color:colors.black}}
           />
        </View>

         </View>
      </SafeAreaContainer>
    )
}

export default UploadFront


const styles = StyleSheet.create({
    main:{
        width:"100%",
        height:"100%",
        justifyContent:"flex-start",
        alignItems:"center",
        padding:15
    }
})