import CustomAppBar from "../../components/CustomAppBar/CustomAppBar"
import CustomButton from "../../components/CustomBotton/CustomButton"
import CustomTextInput from "../../components/CustomTextInput"
import SafeAreaContainer from "../../components/SafeAreaContainer/SafeAreaContainer"
import Spacer from "../../components/Spacer/Spacer"
import colors from "../../constants/Colors"
import { Formik } from "formik"
import { useEffect} from "react"
import { KeyboardAvoidingView, Platform, StyleSheet, ToastAndroid, View, ScrollView, SafeAreaView } from "react-native"
import * as yup from "yup"
import { useNavigation } from "@react-navigation/native"
import { AddUserReq} from "../../types/types"
import { RootState, useAppDispatch } from "../../redux/store"
import { _addUserInfo } from "../../redux/actions/auth.actions"
import { useSelector } from "react-redux"
import { resetAuthState, showAuthStack } from "../../redux/feature/auth.feature"
import { screenNames } from "../../navigation/screenNames"

interface FormData {
    legalFirstName:string
    legalLastName:string
    email:string
}


const AddUserInfoScreen=()=>{


    const navigation:any = useNavigation()
    const dispatch = useAppDispatch()

    const {user,isSuccess,isError,loading} = useSelector((state:RootState) => state.authSlice)


    useEffect(()=>{
        if(isSuccess){ 
            dispatch(resetAuthState())         
            navigation.navigate(screenNames.AuthSuccessScreen)
        }               

        if(isError){

            ToastAndroid.show("Something went wrong",4000)
            setTimeout(()=>{
                dispatch(resetAuthState())
            },1000) 
        }

    },[isSuccess,isError])



    const handleAddUserInfo=async(data:FormData)=>{
           try {

            if(!user){
                ToastAndroid.show("User ID is missing",4000)
                return
            }

            const formData:AddUserReq = {
                ...data,
                userId:user.id,
            }

            dispatch(_addUserInfo(formData))

           } catch (error) {
              ToastAndroid.show("Something has gone wrong",4000)
           }
    }

    let schema = yup.object().shape({
        legalFirstName: yup.string().required("Legal first Name is required").min(2,"Too short").max(25,"Too Long"),
        legalLastName: yup.string().required("Legal Last Name is required").min(2,"Too short").max(25,"Too Long"),
        email:yup.string().email("Invalid Email")
      });

    return(
        <SafeAreaView style={{flex:1}}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
                keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
            >
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
                <View style={styles.main} >
                   <CustomAppBar
                      canMoveBack={false}
                      title="Enter your details"
                      description="Help us know you better"
                   />
                    <Spacer height={80}/>

                    <Formik
                       onSubmit={(values,actions)=>{
                           handleAddUserInfo(values)
                           actions.resetForm()
                       }}

                       initialValues={{
                          legalFirstName:"",
                          legalLastName:"",
                          email:""
                          
                       }}

                       validationSchema={schema}
                    >
                        {({handleChange,handleSubmit,values,errors,touched})=>(
                            <View style={{width:"100%",height:"100%"}}>
                              <CustomTextInput
                              placeholder="Legal First Name"
                              value={values.legalFirstName}
                              onChangeText={handleChange("legalFirstName")}
                              error={errors.legalFirstName && touched.legalFirstName ? errors.legalFirstName : ""}

                             />

                             <CustomTextInput
                              placeholder="Legal Last Name"
                              value={values.legalLastName}
                              onChangeText={handleChange("legalLastName")}
                              error={errors.legalLastName && touched.legalLastName ? errors.legalLastName : ""}

                             />

                            <CustomTextInput
                              placeholder="Personal Email (optional)"
                              value={values.email}
                              onChangeText={handleChange("email")}
                              error={errors.email && touched.email ? errors.email : ""}
                             />

                             <Spacer height={40}/>
                              <CustomButton
                                    title="Submit"
                                    onPress={()=>{
                                       handleSubmit()
                                    // navigation.navigate("SelectCategory")
                                    
                                    }}
                                    loading={loading}
                                />
                            </View>
                            
                        )}

                    
                    </Formik>

                </View>
            </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default AddUserInfoScreen

const styles = StyleSheet.create({
    main:{
    // width:"100%", // let ScrollView handle width
    // height:"100%", // REMOVE this line to allow scrolling
    justifyContent:"flex-start",
    alignItems:"center",
    backgroundColor:colors.white,
    paddingHorizontal:15,
    }
})