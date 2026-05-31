import { Text } from "react-native"
import colors from "../constants/Colors"

interface Props {
    text:string
    textStyles?:any
}

const HeadingText=({text,textStyles}:Props)=>{

    return (
        <Text style={[{width:"auto",fontSize:30,fontWeight:"800",color:colors.black},textStyles]}>
          {text}
        </Text>
    )
}

export default HeadingText