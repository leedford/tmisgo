import { Button } from "antd"

type Props = {
  title: string
  loading?: boolean
  onClick: () => void
  style?: any
}

const CustomButton = ({ title, loading, onClick, style }: Props) => {
  return (
    <Button
      type="primary"
      style={{ width: "100%", height: 40, ...style }}
      onClick={onClick}
      loading={loading}
    >
      {title}
    </Button>
  )
}
export default CustomButton
