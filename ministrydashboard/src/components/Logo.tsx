import Image from "next/image"

type Props = {}

const Logo = (props: Props) => {
  return (
      <div style={{ width: "50px", height: "50px", display:"flex",marginBottom: "1rem", justifyContent:"center",alignItems:"center"}}>
        <Image alt="TIMISGO logo" src="/logo.png" width={50} height={50} style={{objectFit:"contain", width:"100%",height:"100%"}}/>
      </div>
  )
}

export default Logo