import React, { useState } from 'react';
import { List, Avatar, Input, Button } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import { GoogleGenerativeAI } from '@google/generative-ai';
import "./ChatBot.css"
const apiKey = 'AIzaSyDiiyu9YFpObl9e8-zPW-JK8AyQHBk_Bw0';
const genAI = new GoogleGenerativeAI(apiKey);
const { TextArea } = Input;

export default function ChatBot({
    name,
    initialPrice,
    id,
    rating,
    sex,
    length,
    breeder,
    age,
    status,
    endTime,
    immediatePrice,
}) {
    const [messages, setMessages] = useState([
        { sender: 'User', content: 'Xin Chào!' },
        {
            sender: 'Bot',
            content: `Xin chào! Tôi là Kim Cương, trợ lý của bạn trong phòng đấu giá cá Koi. Buổi đấu giá cho cá Koi ${name} có giá khởi điểm là ${initialPrice} và giá mua ngay là ${immediatePrice}. 
            Thông tin cá: Mã ID: ${id},Rating:${rating} Độ tuổi: ${age}, Giống: ${breeder}, Chiều dài: ${length}, Giới tính: ${sex}, Tình trạng: ${status}. Buổi đấu giá này sẽ kết thúc vào lúc ${endTime}.`
        },
    ]);
    const [newMessage, setNewMessage] = useState('');
    const [typing, setTyping] = useState(false);

    const handleSend = async () => {
        if (newMessage.trim()) {
            const userMessage = { sender: 'User', content: newMessage };
            setMessages((prevMessages) => [...prevMessages, userMessage]);
            setNewMessage('');
            setTyping(true);
            await processMessageToGemini(userMessage.content);
        }
    };

    async function processMessageToGemini(userMessage) {
        try {
            const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
            const chatSession = model.startChat({
                generationConfig: {
                    temperature: 1,
                    topP: 0.95,
                    topK: 64,
                    maxOutputTokens: 1000,
                    responseMimeType: 'text/plain',
                },
                history: messages.map((msg) => ({
                    role: msg.sender.toLowerCase() === 'user' ? 'user' : 'model',
                    parts: [{ text: msg.content }],
                })),
            });

            const response = await chatSession.sendMessage(userMessage);
            const botMessage = response.response.text();

            setMessages((prevMessages) => [
                ...prevMessages,
                { sender: 'Bot', content: botMessage },
            ]);
        } catch (error) {
            console.error('Error:', error);
            setMessages((prevMessages) => [
                ...prevMessages,
                { sender: 'Bot', content: 'Có lỗi xảy ra. Vui lòng thử lại!' },
            ]);
        } finally {
            setTyping(false);
        }
    }

    return (
        <div>

      
        <div className='ChatBox' >
            <List
                itemLayout="horizontal"
                dataSource={messages.filter((_, index) => index >= 2)} // Bỏ qua 2 tin nhắn đầu tiên
                renderItem={(item) => (
                    <List.Item>
                        <List.Item.Meta
                            avatar={<Avatar>{item.sender.charAt(0)}</Avatar>}
                            title={<span>{item.sender}</span>}
                            description={item.content}
                        />
                    </List.Item>
                )}
                style={{ maxHeight: '600px', overflowY: 'auto', padding: '10px' }}
            />

            {typing && (
                <div style={{ padding: '10px', color: '#999', textAlign: 'center' }}>
                    Bot typing...
                </div>
            )}
           
        </div>
        <TextArea
                rows={3}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Nhập tin nhắn..."
                style={{ marginTop: '10px' }}
            />
            <Button
                type="primary"
                icon={<SendOutlined />}
                onClick={handleSend}
                style={{ width: '100%', marginTop: '5px' }}
            >
                SEND
            </Button>
        </div>
    );
}