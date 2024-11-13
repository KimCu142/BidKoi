import React, { useRef, useState, useEffect } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, Select, Space, Table } from 'antd';
import Highlighter from 'react-highlight-words';
import api from "../../config/axios";
import { toast } from 'react-toastify';

function Transactions({ accountId }) {
    const [transactions, setTransactions] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const [transactionType, setTransactionType] = useState('');

    useEffect(() => {
        if (accountId) {
            fetchTransactions();
        }
    }, [accountId]);

    useEffect(() => {
        applyFilters();
    }, [transactionType, searchText, transactions]);

    const fetchTransactions = async () => {
        try {
            const response = await api.get(`/transaction/view/${accountId}`);
            setTransactions(response.data || []);
            setFilteredData(response.data || []);
        } catch (error) {
            console.error("Error fetching transactions", error);
            toast.error("Unable to fetch transaction list.");
        }
    };

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const applyFilters = () => {
        let newFilteredData = transactions;

        // Transaction type filter
        if (transactionType) {
            newFilteredData = newFilteredData.filter(record => record.type === transactionType);
        }

        // Search filter
        if (searchText && searchedColumn) {
            newFilteredData = newFilteredData.filter(record =>
                record[searchedColumn]
                    .toString()
                    .toLowerCase()
                    .includes(searchText.toLowerCase())
            );
        }

        setFilteredData(newFilteredData);
    };

    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
        setTransactionType('');
        setFilteredData(transactions);
    };

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
                {dataIndex === 'type' ? (
                    <Select
                        showSearch
                        style={{ width: 200, marginBottom: 8 }}
                        placeholder={`Select ${dataIndex}`}
                        value={transactionType}
                        onChange={(value) => {
                            setTransactionType(value);
                            setSelectedKeys(value ? [value] : []);
                        }}
                    >
                        <Select.Option value="REFUND">REFUND</Select.Option>
                        <Select.Option value="DEPOSIT">DEPOSIT</Select.Option>
                        <Select.Option value="ADD_MONEY">ADD_MONEY</Select.Option>
                        <Select.Option value="WITHDRAW">WITHDRAW</Select.Option>
                    </Select>
                ) : (
                    <Input
                        ref={searchInput}
                        placeholder={`Search ${dataIndex}`}
                        value={selectedKeys[0]}
                        onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                        onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        style={{ marginBottom: 8, display: 'block' }}
                    />
                )}
                <Space>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Reset
                    </Button>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Search
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />,
        render: text =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });

    const columns = [
        {
            title: 'Transaction Type',
            dataIndex: 'type',
            key: 'type',
            ...getColumnSearchProps('type'),
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
            sorter: (a, b) => a.amount - b.amount,
        },
        {
            title: 'Transaction Date',
            dataIndex: 'date',
            key: 'date',
            sorter: (a, b) => new Date(a.date) - new Date(b.date),
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
    ];

    return <Table columns={columns} dataSource={filteredData} rowKey="date" />;
}

export default Transactions;
