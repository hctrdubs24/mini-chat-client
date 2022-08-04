import "./App.css";
import io from "socket.io-client";
import { useState, useEffect } from "react";

// const socket = io("http://localhost:5000");
const socket = io('https://mini-chat-backend.herokuapp.com/');


function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("message", message);
    const newMessage = {
      body: message,
      from: "Me",
    };
    setMessages([newMessage, ...messages]);
    setMessage("");
  };

  useEffect(() => {
    const receivedMessage = (message) => setMessages([message, ...messages]);
    socket.on("message", receivedMessage);

    return () => socket.off("message", receivedMessage);
  }, [messages]);

  return (
    <section className="min-h-screen bg-zinc-800 text-white flex items-center justify-center ">
      <div className="bg-zinc-900 p-10 text-white ">
        <h1 className="text-5xl text-white mb-3 font-bold">Chat React</h1>
        <form onSubmit={handleSubmit} className="flex items-stretch p-1">
          <input
            type="text"
            name="chatbox"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="border-2 border-zinc-500 p-2 text-black w-full"
          />
          <button className="bg-blue-500 px-5 py-1">Send</button>
        </form>

        <ul className="h-80 overflow-y-auto">
          {messages.map((message, index) => (
            <li
              key={index}
              className={`my-2 p-2 text-sm rounded-md table ${
                message.from === "Me" ? "bg-sky-700 ml-auto" : "bg-green-500"
              }`}
            >
              <p>
                {message.from}: {message.body}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default App;
