import { Input } from 'antd'
import { useState } from 'react';

type Props = {
    placeholder:string
    onChange?:React.ChangeEventHandler<HTMLInputElement>
    value?:string
    error?:string
    disabled:boolean
}

const CustomPasswordInput = ({placeholder,onChange,value,error,disabled=false}: Props) => {


  return (
   <div style={{width:"100%"}}>
    <Input.Password
       placeholder={placeholder}
       onChange={onChange}
       value={value}
       disabled={disabled}
       style={{height:"40px",width:"100%"}}
     />
     <div
      className='w-full text-[11px] text-red-500 text-left'
     >
      {error}
      </div>
   </div>
  )
}

export default CustomPasswordInput
