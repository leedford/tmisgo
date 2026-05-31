
import CustomAppBar from "../../components/CustomAppBar/CustomAppBar"
import CustomButton from "../../components/CustomBotton/CustomButton"
import CustomTextInput from "../../components/CustomTextInput"
import SafeAreaContainer from "../../components/SafeAreaContainer/SafeAreaContainer"
import Spacer from "../../components/Spacer/Spacer"
import colors from "../../constants/Colors"
import { Formik } from "formik"
import { use, useEffect} from "react"
import { StyleSheet, ToastAndroid, View } from "react-native"
import * as yup from "yup"
import { useNavigation } from "@react-navigation/native"
import { gql } from "@apollo/client"
import { useMutation } from "@apollo/client/react"
import { RootState, useAppDispatch } from "../../redux/store"
import { setArtistAccountId } from "../../redux/feature/auth.feature"
import { screenNames } from "../../navigation/screenNames"
import { useSelector } from "react-redux"

interface FormData {
    legalFirstName:string
    legalLastName:string
    stageName:string
    email:string
}

   interface CreateArtistAccountData {
        createArtistAccount: {
            legalFirstName: string
            legalLastName: string
            stageName: string
            id: string
            email: string
        }
    }


const CREATE_ARTIST_ACCOUNT = gql`
mutation CreateArtistAccount($userId: ID!,$stageName: String!, $legalFirstName: String, $legalLastName: String, $email: String) {
  createArtistAccount(userId: $userId, stageName: $stageName, legalFirstName: $legalFirstName, legalLastName: $legalLastName, email: $email) {
    legalFirstName
    legalLastName
    stageName
    id
    email
  }
}
`


const RegisterArtistScreen=()=>{
    const navigation:any = useNavigation()
    const dispatch = useAppDispatch()
    const {user} = useSelector((state:RootState)=> state.authSlice)

    const [createArtistAccount,{loading,data,error,reset}] = useMutation<CreateArtistAccountData>(CREATE_ARTIST_ACCOUNT,{
        fetchPolicy:"no-cache"
    })

    useEffect(()=>{

        if(data && data.createArtistAccount){
            dispatch(setArtistAccountId(data.createArtistAccount.id))
            navigation.navigate(screenNames.SelectCategory)
            reset()   
        }
        if(error){
            console.log("Error creating artist account:",error)
            ToastAndroid.show("Error creating artist account",4000)
            reset()
        }

    },[data,error])


    const handleRegisteringArtist=async(data:FormData)=>{
           try {
            
           if(user){
              createArtistAccount({
                variables:{
                    userId:user.id,
                    stageName:data.stageName,
                    legalFirstName:data.legalFirstName,
                    legalLastName:data.legalLastName,
                    email:data.email
                }
            }) 
           }
 
           } catch (error) {
              ToastAndroid.show("Something has gone wrong",4000)
           }
    }



    let schema = yup.object().shape({
        stageName: yup.string().required("Stage Name is required").min(2,"Too short").max(25,"Too Long"),
        legalFirstName: yup.string().required("Legal first Name is required").min(2,"Too short").max(25,"Too Long"),
        legalLastName: yup.string().required("Legal Last Name is required").min(2,"Too short").max(25,"Too Long"),
        email:yup.string().email("Invalid Email").required("Email is required")
      });

    return(
        <SafeAreaContainer>

            <View style={styles.main} >

               <CustomAppBar
                  canMoveBack={false}
                  title="Enter your details"
                  description="Help us know you better"
               />
                <Spacer height={80}/>

                <Formik
                   enableReinitialize
                   onSubmit={(values,actions)=>{
                       handleRegisteringArtist(values)
                       actions.resetForm()
                   }}

                   initialValues={{
                      stageName:"",
                      legalFirstName:user?.legalFirstName || "",
                      legalLastName:user?.legalLastName || "",
                      email:user?.email || ""

                   }}

                   validationSchema={schema}
                >
                    {({handleChange,handleSubmit,values,errors,touched})=>(
                        <View style={{width:"100%",height:"100%"}}>
                          
                         <CustomTextInput
                          placeholder="Stage Name"
                          value={values.stageName}
                          onChangeText={handleChange("stageName")}
                          error={errors.stageName && touched.stageName ? errors.stageName : ""}

                         />
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
                          placeholder="Personal Email"
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
        </SafeAreaContainer>
    )
}

export default RegisterArtistScreen

const styles = StyleSheet.create({
    main:{
    width:"100%",
    height:"100%",
    justifyContent:"flex-start",
    alignItems:"center",
    backgroundColor:colors.white,
    paddingHorizontal:15,
    }
})