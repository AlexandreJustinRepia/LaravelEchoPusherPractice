import React, { useState, useEffect } from "react";
import Echo from "laravel-echo";
import Pusher from "pusher-js";

export default function ChatRoom() {
  const [messages, setMessages] = useState([]);
  const [sender, setSender] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    window.Pusher = Pusher;

    window.Echo = new Echo({
      broadcaster: "pusher",
      key: import.meta.env.VITE_PUSHER_APP_KEY,
      cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
      forceTLS: true,
    });

    window.Echo.channel("chat-room")
      .listen(".chat.message", (e) => {
        setMessages((prev) => [...prev, { sender: e.sender, message: e.message }]);
      });

    return () => {
      window.Echo.disconnect();
    };
  }, []);

  const sendMessage = async () => {
    if (!sender.trim() || !message.trim()) return;

    await fetch("/send-message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').getAttribute("content"),
      },
      body: JSON.stringify({ sender, message }),
    });

    setMessage("");
  };

  return (
    <div className="flex flex-col max-w-xl mx-auto mt-10 border rounded p-4">
      <h1 className="text-2xl font-bold mb-4">Realtime Chat Room</h1>

      <input
        type="text"
        className="border p-2 rounded mb-2"
        placeholder="Your name..."
        value={sender}
        onChange={(e) => setSender(e.target.value)}
      />

      <div className="border rounded p-3 h-80 overflow-y-auto bg-gray-50">
        {messages.map((msg, i) => (
          <div key={i} className="p-1 mb-1">
            <strong>{msg.sender}:</strong> {msg.message}
          </div>
        ))}
      </div>

      <div className="flex gap-2 mt-3">
        <input
          type="text"
          className="flex-1 border rounded p-2"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
