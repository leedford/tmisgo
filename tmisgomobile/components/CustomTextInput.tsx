import { TextInput,StyleSheet,Text } from "react-native"


interface Props {
    placeholder:string
    value:string
    onChangeText:(text:string)=>void
    error?:string
    keyboardType?:any

}

const CustomTextInput=({placeholder,value,onChangeText,error,keyboardType}:Props)=>{

   
    return(
        <>
        <TextInput 
         placeholder={placeholder}
         value={value}
         onChangeText={onChangeText}
         style={styles.main}
         keyboardType={keyboardType}
        />
        <Text style={{color:"red",fontSize:12}}>
            {error ? error : ""}
        </Text>
        </>
    )
}


export default CustomTextInput

const styles = StyleSheet.create({
    main:{
        width:"100%",
        height:50,
        borderColor:"#c0c0c0",
        borderWidth:1,
        borderRadius:6,
        padding:10,
        fontSize:16,
        marginVertical:2
    }
})
