import React, { useEffect, useState } from 'react';
import './Invoice.css';
import KoiCard from '../KoiCard/KoiCard';
import { MdOutlineLocalShipping } from "react-icons/md";
import { IoLocationOutline } from "react-icons/io5";
const Invoice = (invoiceData) => {

    const { date, room, shipping } = invoiceData;
    const { koi, auctionId } = room || {};
    const { name: shippingName, address, phone, staffConfirm, description: shippingDescription, status: shippingStatus } = shipping || {};

    return (
        <div className='invoice-body'>


            <div className="invoice-container">
                <div className="invoice-details">
                    <h2 className="invoice-title">Thông tin đơn hàng</h2>

                    <div className="order-status">
                        <h3>{shippingStatus || 'Đơn hàng đã hoàn thành'}</h3>
                        <p>Date: {new Date(date).toLocaleString()}</p>
                        <p>Auction ID: {auctionId}</p>
                    </div>
                    <div className="shipping-info">
                        <h3>Trang trại vận chuyển</h3>
                        <p><strong>Breeder:</strong> {room?.koi?.breeder?.name}</p>
                        <p><MdOutlineLocalShipping size={30} /> {shippingDescription}</p>
                    </div>

                    <div className="recipient-info">
                        <h3>Địa chỉ nhận hàng</h3>
                        <div className="recipient-details">
                            <IoLocationOutline size={30} />

                            <div>
                                <p> {shippingName} {phone}</p>
                                <p> {address}</p>
                            </div>
                        </div>
                    </div>

                    <div className="payment-info">
                        <h3>Thông tin thanh toán</h3>
                        <p><strong>Tiền cọc:</strong> {room?.koi?.initialPrice * 0.2} VND</p>
                        <p><strong>Xử lý:</strong> {staffConfirm }</p>
                    </div>
                 
                </div>

                <div className="koi-info-card">
                    <h2 className="invoice-title">Thông tin cá Koi</h2>
                    {koi && (
                        <KoiCard
                            varieties={koi.varieties}
                            price={koi.finalPrice}
                            img={koi.image}
                            id={koi.koiId}
                            length={koi.length}
                            age={koi.age}
                            sex={koi.sex}
                            status={koi.status}
                            breeder={koi.breeder.name}
                            rating={koi.rating}
                            logo={room.koi.breeder.logo}
                        />
                    )}
                </div>



            </div>
        </div>
    );
};

export default Invoice;
