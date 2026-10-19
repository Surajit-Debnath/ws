
import { useEffect, useRef, useState } from "react";

function App() {
  const [messages, setMessages] = useState(["hi there"]);
  const [input, setInput] = useState("");
  const wsRef=useRef();
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");
    
    ws.onmessage = (event) => {
      setMessages((m) => [...m, event.data]);
    }
    wsRef.current=ws;

    ws.onopen=()=>{
      ws.send(JSON.stringify({
        type:"join",
        payload:{
          roomId:"red"
        }
      }))
    }
  }, []);

  return (
    <div className="min-h-screen bg-black p-4">
      <div className="mx-auto w-full max-w-4xl">
        <div className="h-[83vh] overflow-y-auto rounded-t-2xl bg-[#030712] p-4">
          {messages.map((message, index) => (
            <div key={index} className="mb-2">
              <span className="inline-block rounded-2xl bg-emerald-200 px-4 py-2 text-black">
                {message}
              </span>
            </div>
          ))}
        </div>

        <form
          className="flex items-center gap-2 rounded-b-2xl bg-[#101828] p-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (!input.trim()) return;
            wsRef.current.send(JSON.stringify({
              type:"chat",
              payload:{
                message:input
              }
            }))
            setInput("");
          }}
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="min-w-0 flex-1 rounded-xl bg-[#1e293b] p-3 text-white outline-none focus:ring-2 focus:ring-emerald-400"
          />

          <button
            type="submit"
            className="rounded-xl bg-[#1e1a4d] px-4 py-3 text-white hover:bg-indigo-700"
          >
            SEND MESSAGE
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;

