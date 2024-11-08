import React from 'react';
import { Result, Avatar } from 'antd';

function AuctionResult({ data }) {
    console.log("Data:" +data)
    const winner = data.bidder;
    const koi = data.koi;

    return (
        <div>
            <Result
                status="success"
                title={`Chúc mừng ${winner.account.username}  đã chiến thắng ${koi.varieties} với mức giá ${koi.finalPrice} VND`}
                icon={<Avatar src={winner.avatar} alt={winner.username} style={{ width: '100px', height: '100px' }}/>}

            />
        </div>
    );
}

export default AuctionResult;
