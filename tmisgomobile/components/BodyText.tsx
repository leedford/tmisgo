import colors from "../constants/Colors"
import { Text } from "react-native"


interface Props {
    text:string
    textStyles?:any
}

const BodyText=({text,textStyles}:Props)=>{

    return (
        <Text style={[{width:"auto",fontSize:16,fontWeight:"400",color:colors.light.text},textStyles]}>
          {text}
        </Text>
    )
}

export default BodyText