
import CustomButton from "../../components/CustomBotton/CustomButton"
import Spacer from "../../components/Spacer/Spacer"
import colors from "../../constants/Colors"
import { ActivityIndicator, Image, SafeAreaView, StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from "react-native"
import { useEffect, useState } from "react"
import { CategoryType } from "../../types/types"
import CustomAppBar from "../../components/CustomAppBar/CustomAppBar"
import { AddArtistCategory } from "../../api/auth/auth.api"
import { useNavigation } from "@react-navigation/native"
import { getAuthToken } from "../../constants/authorization"
import SafeAreaContainer from "../../components/SafeAreaContainer/SafeAreaContainer"
import { useMutation, useQuery } from "@apollo/client/react"
import { gql } from "@apollo/client"
import { screenNames } from "../../navigation/screenNames"
import { useSelector } from "react-redux"
import { RootState } from "../../redux/store"


export const GET_CATEGORIES = gql`
  query GetCategories {
    getCategories {
        id
        name
        iconUri
    }
  }
`

const ADD_ARTIST_CATEGORY = gql`
    mutation AddArtistCategory($artistAccountId: ID!, $categoryId: ID!) {
    addArtistCategory(artistAccountId: $artistAccountId, categoryId: $categoryId) {
    userId
    legalLastName
    legalFirstName
  }
}`


const SelectCategoryScreen=()=>{
   
    const navigation:any = useNavigation()
    const {artistAccountId} = useSelector((state:RootState)=> state.authSlice)
    const {data,loading} = useQuery<any>(GET_CATEGORIES);
    const [addArtistCategory,{data:categoryData,loading:categoryLoading,error:categoryError}] = useMutation<any>(ADD_ARTIST_CATEGORY)
  

    const [categories,setCategories] = useState<CategoryType[]>()
    const [selectedCategory,setSelectedCategory] = useState<CategoryType | null>(null)
   
    


    useEffect(()=>{
       if(data && data.getCategories){
         setCategories(data.getCategories)
       }
    },[data])


    useEffect(()=>{
        if(categoryData && categoryData.addArtistCategory){
            navigation.navigate(screenNames.SelectDocumentType)
        }
        if(categoryError){
            ToastAndroid.show("Error adding category to artist account",4000)
        }
    },[categoryData,categoryError])


    const handleAddingCategory=async()=>{
          try {

           
            if(!selectedCategory){
                ToastAndroid.show("No category is selected",4000)
                return
            }
            if(artistAccountId){
               addArtistCategory({
                variables:{
                    artistAccountId:artistAccountId,
                    categoryId:selectedCategory.id
                }
            })
            }
           
            
          } catch (error) {
            ToastAndroid.show("Something has gone wrong",4000)
            
          }
    }


  
    const ListItem=({category}:{category:CategoryType})=>{

        const isSelected = selectedCategory && selectedCategory.id === category.id ? true :false
        return(
            <TouchableOpacity
             onPress={()=> setSelectedCategory(category)} 
             style={{width:"100%",height:50,backgroundColor:isSelected ? colors.black :"white",borderWidth:1,borderColor:isSelected?colors.black:colors.gray500,flexDirection:"row",justifyContent:"space-between",alignItems:"center",padding:6,borderRadius:6,marginVertical:6}}>
    
                <Text style={{fontSize:16,color:isSelected ? colors.white : colors.black,fontWeight:"500"}}>
                    {category.name}
                </Text> 
    
                <Image 
                  source={{uri:category.iconUrl}}
                  width={40}
                  height={40}
                />
     
            </TouchableOpacity>
        )
    }


    if(loading){

        return(
            <SafeAreaContainer >
          <View style={styles.main}>
            <ActivityIndicator size={40}/>
          </View> 
          </SafeAreaContainer>
        )
    }
  

    return(
    <SafeAreaContainer>
       <View style={styles.main}>
           <CustomAppBar
              title="Select a category"
              description="Which category do you belong to?"
              canMoveBack={false}
            />

            <Spacer height={20}/>
        
           <View style={{marginVertical:1,padding:4,width:"100%"}}>
            {
              categories && categories.length > 0 && categories.map((category,index)=>{

                return <ListItem key={index} category={category} />
              })
            }
            
           </View> 

           <Spacer height={20}/>

           <CustomButton
             title="Next"
             onPress={()=> handleAddingCategory()}
             loading={categoryLoading}
            />  
       </View>  
    </SafeAreaContainer>
    )
}

export default SelectCategoryScreen

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