import { Input } from "antd"

type Props = {
  placeholder: string
  onChange?: React.ChangeEventHandler<HTMLInputElement>
  value?: string
  error?: string
  disabled?: boolean
  type?:string
}

const CustomTextInput = ({
  placeholder,
  onChange,
  value,
  error,
  disabled = false,
  type = "text"
}: Props) => {
  return (
    <div className="w-full">
      <Input
        type={type}
        disabled={disabled}
        placeholder={placeholder}
        onChange={onChange}
        value={value}
        className="w-full h-[40px]"
      />
      <div
        className="w-full text-[11px] text-red-500 text-left"
      >
        {error}
      </div>
    </div>
  )
}

export default CustomTextInput
