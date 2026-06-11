

type Props = {
    width?:number,
    height?:number
}

const Spacer = ({width=100,height=10}: Props) => {
  return (
    <div style={{width:`${width}px`, height:`${height}px`}}/>
  )
}

export default Spacer