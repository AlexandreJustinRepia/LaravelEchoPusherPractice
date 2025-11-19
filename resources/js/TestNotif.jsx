import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import axios from 'axios';
import { echo } from './echo'; // Make sure your echo.js is properly set up

function TestNotif() {
    const [notifications, setNotifications] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        // Listen for broadcasted events
        echo.channel('my-channel')
            .listen('.my-event', (event) => {
                setNotifications(prev => [event.data, ...prev]);
            });

        return () => {
            echo.leaveChannel('my-channel');
        };
    }, []);

    const sendNotif = async () => {
        if (!message) return;
        try {
            await axios.post('/send-notif', { message });
            setMessage('');
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-start bg-gray-100 p-10">
            <h1 className="text-2xl font-bold mb-5">Test Notification Sender</h1>

            <div className="flex gap-2 mb-5">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Enter your message"
                    className="px-4 py-2 rounded border border-gray-300"
                />
                <button
                    onClick={sendNotif}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                    Send
                </button>
            </div>

            <div className="w-full max-w-md space-y-2">
                {notifications.map((notif, index) => (
                    <div
                        key={index}
                        className="p-3 rounded bg-white shadow flex justify-between items-center"
                    >
                        <div>
                            <p className="font-semibold text-red-600">{notif.message}</p>
                            <p className="text-xs text-gray-500">{notif.time}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<TestNotif />);
