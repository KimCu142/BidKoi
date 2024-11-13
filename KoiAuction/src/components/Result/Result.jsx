import React from 'react';
import { Result, Avatar } from 'antd';
import winnerIcon from './1st.gif'; // Import image 1st.gif

function AuctionResult({ data }) {
    console.log("Data:" + data);
    const winner = data.bidder;
    const koi = data.koi;

    return (
        <div>
            <Result
                status="success"
                title={`Congratulations ${winner.account.username} for winning the auction for ${koi.varieties} at the price of ${koi.finalPrice} VND`}
                icon={
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Avatar 
                            src={winner.avatar} 
                            alt={winner.account.username} 
                            style={{ width: '100px', height: '100px', marginRight: '10px' }}
                        />
                        <img 
                            src={winnerIcon} 
                            alt="Winner Icon" 
                            style={{ width: '60px', height: '60px' }}
                        />
                    </div>
                }
            />
        </div>
    );
}

export default AuctionResult;
