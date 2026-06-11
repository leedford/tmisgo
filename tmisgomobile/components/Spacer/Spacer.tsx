import { View } from "react-native"

interface Props {
    width?:any
    height?: any
}
const Spacer=({width="100%",height=10}:Props)=>{
    return (
        <View style={{width:width,height:height}}/>
    )
}

export default Spacer