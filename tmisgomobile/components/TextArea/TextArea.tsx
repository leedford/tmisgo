import { TextInput, View } from "react-native"
import { dimentions } from "../../constants/dimentions"
import colors from "../../constants/Colors"


interface Props {
    placeholder:string
    value:string
    onChangeText:(text:string)=> void
}

const TextArea=({placeholder,value,onChangeText}:Props)=>{

    return(
        <View style={{
            minHeight:dimentions.vh/2,
            backgroundColor:colors.gray100,
            borderRadius:10,
            borderWidth:1,
            borderColor:colors.gray500,
            width:"100%"}}>
        <TextInput
          multiline={true}
          verticalAlign="top"
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          style={{
            width:"100%",
            flexDirection:"column",
            justifyContent:"flex-start"
          }}

        />
     
        </View>
    )
}

export default TextArea