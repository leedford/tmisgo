import { Spin } from 'antd';

export default function Loader({ size = 'large' }: { size?: 'small' | 'default' | 'large' }) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Spin size={size} />
    </div>
  );
}
