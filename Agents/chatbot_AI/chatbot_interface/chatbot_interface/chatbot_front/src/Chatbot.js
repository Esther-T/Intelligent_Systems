import { useState, useEffect } from "react";
import { sendMessage, generateImage } from "./api";
import Currency from './Currency'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';


function Chatbot() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [imageUrl, setImageUrl] = useState(null);
  const [serverStatus, setServerStatus] = useState(false)

  const handleChat = async () => {
    const userMsg = { role: "you", content: input };
    setMessages([...messages, userMsg]);

    const res = await sendMessage(input);
    setMessages(prev => [...prev, { role: "shiro-bot 🤖", content: res.reply }]);
    setInput("");
  };

  const handleImage = async () => {
    const res = await generateImage(input);
    setImageUrl(res.image_url);
  };

  const checkServerStatus = async () => {
    setServerStatus(false);
    try {
      const res = await fetch("https://chatbotback-7zvm.onrender.com/"); 
      if (res.ok) {
        setServerStatus(true);
      } else {
        setServerStatus(false);
      }
    } catch (error) {
      setServerStatus(false);
    }
  };

    useEffect(() => {
    checkServerStatus();
    const interval = setInterval(checkServerStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: 20 }}>
       <Alert key="info1" variant="info">
          {
              serverStatus ? 
              <>Server is currently <b><u>running</u></b></>
              :
              <>Server is currently <b><u>asleep </u><Spinner animation="border" size="sm" role="status" style={{ verticalAlign: 'middle' }} /></b></>
          }
      </Alert>
	  <Currency />
      <h2>Shiro-Bot 🤖</h2>

      <div>
        {messages.map((m, i) => (
          <p key={i}><b>{m.role}:</b> {m.content}</p>
        ))}
      </div>
        <Form.Control as="textarea"         
          placeholder="Type something..."
          rows={4} 
          value={input} 
          onChange={e => setInput(e.target.value)} 
          style={{ width: '100%' }}/>
      <Button onClick={handleChat} className="mt-2" disabled={!serverStatus}>
              Send
      </Button>
      {/* <button onClick={handleImage}>Generate Image</button> */}

      {imageUrl && <img src={imageUrl} width="300" />}
    </div>
  );
}

export default Chatbot;
