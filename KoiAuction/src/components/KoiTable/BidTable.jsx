import React from 'react';
import { Card, Input, Button } from 'antd';
import "./BidTable.css"

export default function BidTable() {
  return (
<>
    <Card
      title="Auction"
      className="custome-card"
    >
      <Input
        placeholder="Enter bid amount"
        style={{
          marginBottom: '10px',
          borderRadius: '20px',
          padding: '5px 15px',
          width: '70%',
        }}
      />
      <Button type="primary" shape="round">
        Place Bid
      </Button>
      <p style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
        (Minimum bid: $$$, Increments of $$ only)
      </p>
      <Button
        style={{
          marginTop: '20px',
          width: '100%',
          backgroundColor: '#595959',
          color: 'white',
          borderRadius: '20px',
        }}
      >
        Current Bid: $$$
      </Button>
    </Card>
    </>
  );
};


