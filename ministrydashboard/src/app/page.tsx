'use client';

import React from 'react';
import { Button, Space } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-2xl font-bold mb-6">Testing Ant Design</h1>
      
      <Space>
        <Button type="primary">Primary Button</Button>
        <Button icon={<DownloadOutlined />}>Download</Button>
      </Space>
    </main>
  );
}