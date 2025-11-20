import { useState, useEffect } from "react";
import { usePage } from "@inertiajs/react";

export default function AuthChat() {
    const { users, auth } = usePage().props;
    const [receiverId, setReceiverId] = useState("");
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        if (!auth?.user) return;

        window.Echo.private(`chat.${auth.user.id}`)
            .listen(".private.chat.message", (e) => {
                setMessages((prev) => [...prev, {
                    from: e.senderId,
                    text: e.message
                }]);
            });
    }, []);

    const sendMessage = async () => {
        await fetch("/private-send", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').getAttribute("content"),
            },
            body: JSON.stringify({ message, receiverId }),
        });

        setMessages(prev => [...prev, { from: auth.user.id, text: message }]);
        setMessage("");
    };

    return (
        <div className="max-w-xl mx-auto mt-8">
            <h1 className="font-bold text-2xl mb-4">Private Chat Room</h1>

            <select
                className="border p-2 w-full mb-2"
                value={receiverId}
                onChange={(e) => setReceiverId(e.target.value)}
            >
                <option value="">Select User</option>
                {users.filter(u => u.id !== auth.user.id).map((user) => (
                    <option key={user.id} value={user.id}>{user.name}</option>
                ))}
            </select>

            <div className="border h-64 p-2 overflow-y-auto mb-2">
                {messages.map((msg, i) => (
                    <div key={i} className={msg.from === auth.user.id ? "text-right" : "text-left"}>
                        <span className="inline-block bg-gray-200 p-2 rounded mb-1">
                            {msg.text}
                        </span>
                    </div>
                ))}
            </div>

            <input
                className="border p-2 w-full mb-2"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />

            <button
                onClick={sendMessage}
                className="bg-blue-600 text-white px-4 py-2 rounded w-full"
            >
                Send
            </button>
        </div>
    );
}
