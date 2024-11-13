import React, { useRef, useState, useEffect } from 'react';
import { Button, Table, Space, Modal, Input } from 'antd';
import { toast } from 'react-toastify';
import api from '../../../config/axios';

function ConfirmWithdraw() {
    const [transactions, setTransactions] = useState([]);
    const [staffId, setStaffId] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedWithdrawId, setSelectedWithdrawId] = useState(null);
    const [description, setDescription] = useState('');

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const userData = JSON.parse(storedUser);
            setStaffId(userData.staff?.staffId);
        }
    }, []);

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            const response = await api.get(`/wallet/get-all-withdraw`);
            const sortedTransactions = (response.data || []).sort((a, b) => b.id - a.id);
            setTransactions(sortedTransactions);
        } catch (error) {
            console.error("Error fetching transactions", error);
            toast.error("Unable to fetch transaction list.");
        }
    };

    const handleApproveWithdrawal = async (withdrawId) => {
        if (!staffId) {
            toast.error("Unable to approve withdrawal. Staff ID is missing.");
            return;
        }
        try {
            await api.put(`/wallet/approve-withdraw/${withdrawId}/${staffId}`);
            toast.success("Withdrawal confirmed successfully.");
            fetchTransactions();  // Refresh transactions after successful confirmation
        } catch (error) {
            console.error("Error confirming withdrawal", error);
            toast.error("Unable to confirm withdrawal.");
        }
    };

    const handleRejectWithdrawal = async () => {
        if (!staffId) {
            toast.error("Unable to reject withdrawal. Staff ID is missing.");
            return;
        }
        if (!description) {
            toast.error("Description is required to reject withdrawal.");
            return;
        }
        try {
            await api.put(`/wallet/reject-withdraw/${selectedWithdrawId}/${staffId}`, { description });
            toast.success("Withdrawal rejected successfully.");
            fetchTransactions();  // Refresh transactions after successful rejection
            setIsModalVisible(false);
            setDescription('');
        } catch (error) {
            console.error("Error rejecting withdrawal", error);
            toast.error("Unable to reject withdrawal.");
        }
    };

    const showRejectModal = (withdrawId) => {
        setSelectedWithdrawId(withdrawId);
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setDescription('');
    };

    const columns = [
        {
            title: 'Bank Name',
            dataIndex: 'bankName',
            key: 'bankName',
            sorter: (a, b) => a.bankName.localeCompare(b.bankName),
            sortDirections: ['ascend', 'descend'],
        },
        {
            title: 'Account Number',
            dataIndex: 'accountNumber',
            key: 'accountNumber',
            sorter: (a, b) => a.accountNumber.localeCompare(b.accountNumber),
            sortDirections: ['ascend', 'descend'],
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
            sorter: (a, b) => a.amount - b.amount,
            sortDirections: ['ascend', 'descend'],
            render: (amount) => amount.toLocaleString('en-US'),
        },
        {
            title: 'Request Date',
            dataIndex: 'withdrawDate',
            key: 'withdrawDate',
            sorter: (a, b) => new Date(a.withdrawDate) - new Date(b.withdrawDate),
            sortDirections: ['ascend', 'descend'],
            defaultSortOrder: 'descend',
        },
        {
            title: 'description',
            dataIndex: 'description',
            key: 'description',
            sorter: (a, b) => new Date(a.description) - new Date(b.description),
            sortDirections: ['ascend', 'descend'],
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => {
                if (record.status === 'APPROVED') {
                    return <div style={{ color: '#52c41a', fontWeight: "700" }}>APPROVED</div>;
                } else if (record.status === 'REJECTED') {
                    return <div style={{ color: '#ff4d4f', fontWeight: "700" }}>REJECTED</div>;
                } else {
                    return (
                        <Space>

                            <Button
                                type="primary"
                                onClick={() => handleApproveWithdrawal(record.withdrawId)}
                            >
                                Confirm
                            </Button>
                            <Button
                                type="primary" danger
                                onClick={() => showRejectModal(record.withdrawId)}
                            >
                                Reject
                            </Button>
                        </Space>
                    );
                }
            }
        },
    ];

    return (
        <>
            <Table columns={columns} dataSource={transactions} rowKey="id" />
            <Modal
                title="Reject Withdrawal"
                visible={isModalVisible}
                onOk={handleRejectWithdrawal}
                onCancel={handleCancel}
            >
                <Input.TextArea
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter reason for rejection"
                />
            </Modal>
        </>
    );
}

export default ConfirmWithdraw;
