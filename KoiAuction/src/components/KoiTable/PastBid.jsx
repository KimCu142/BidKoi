import React from 'react';
import { Card, Button } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import "./PastBid.css";
const PastBids = () => {
  return (
    <Card
      title="Past Bids"
      extra={
        <Button type="default" shape="round" icon={<ReloadOutlined />}>
          Refresh
        </Button>
      }
      className="customCard"
     
      bodyStyle={{
        padding: '20px',
      }}
    >
      <div 
      className='Bids'
      >
        <p style={{ fontWeight: 'bold', marginBottom: '5px' }}>No Bids Yet</p>
        <p style={{ color: '#777' }}>Be the first to bid!</p>
      </div>
    </Card>
  );
};

export default PastBids;
