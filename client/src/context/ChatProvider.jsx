import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const chatContext = createContext();

const ChatProvider = ({ children }) => {
  const navigator = useNavigate();
  const [user, setUser] = useState();
  const [selectedChat, setSelectedChat] = useState(null);
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (!userInfo) {
      navigator('/');
    }
    setUser(userInfo);
  }, [location]);

  return (
    <>
      <chatContext.Provider value={{ user, setUser, selectedChat, setSelectedChat, chats, setChats }}>
        { children }
      </chatContext.Provider>
    </>
  );
}

export const ChatState = () => {
  return useContext(chatContext);
}
export default ChatProvider;