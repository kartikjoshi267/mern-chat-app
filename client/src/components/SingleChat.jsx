import React, { useEffect, useState } from 'react'
import { ChatState } from '../context/ChatProvider'
import { NotificationState } from '../context/NotificationProvider';
import { Box, Container, FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react';
import { ArrowBackIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { getSender } from '../config/ChatLogics';
import ProfileModal from './Miscellaneous/ProfileModal';
import UpdateGroupChatModal from './Miscellaneous/UpdateGroupChatModal';
import axios from 'axios';
import Message from './Message';
import io from 'socket.io-client';
import Lottie from 'lottie-react';
import typingAnimationData from '../animations/typing.json';

// const ENDPOINT = (location.protocol + "//" + location.hostname) || "http://localhost:5000";
const ENDPOINT = "http://localhost:5000";
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const { user, selectedChat, setSelectedChat } = ChatState();
  const { notification, setNotification } = NotificationState();
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const toast = useToast();

  
  const fetchMessages = async () => {
    setLoading(true);
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
        'Content-Type': 'application/json'
      }
    }

    try {
      const { data } = await axios.get(`/api/message/${selectedChat._id}`, config);
      setMessages(data);
      setLoading(false);
      socket.emit('join_chat', selectedChat._id);
    } catch (error) {
      toast({
        title: "Error occured",
        description: "Failed to fetch messages",
        status: "error"
      });
      setLoading(false);
    }
  }

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit('setup', user);
    socket.on('connected', () => {
      setSocketConnected(true);
    });
    socket.on('typing', () => setIsTyping(true));
    socket.on('stop typing', () => setIsTyping(false));
  }, []);

  useEffect(() => {
    if (selectedChat) {
      fetchMessages();
      selectedChatCompare = selectedChat;
    }
  }, [selectedChat]);

  useEffect(() => {
    socket.on('Message received', (newMessageRecieved) => {
      if (!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id) {
        if (!notification.includes(newMessageRecieved) && !notification.find(e => e.chat._id === newMessageRecieved.chat._id)) {
          setNotification([newMessageRecieved, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    })
  });
  
  const sendMessage = async (event) => {
    setSendingMessage(true);
    if (event.key === 'Enter' && newMessage){
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        }
      }

      try {
        const { data } = await axios.post('/api/message/', {
          chatId: selectedChat._id,
          content: newMessage
        }, config);
        
        socket.emit('stop typing', selectedChat._id);
        setNewMessage("");
        socket.emit('new_message', data);
        setMessages([...messages, data]);
      } catch (error) {
        toast({
          title: "Error occured",
          description: "Failed to send the message",
          status: "error"
        });
      }
    }
    setSendingMessage(false);
  }

  const typingHandler = (event) => {
    setNewMessage(event.target.value);
    if (!socketConnected) return;

    if (!typing){
      setTyping(true);
      socket.emit('typing', selectedChat._id);
    }

    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;

      if (timeDiff >= timerLength && typing){
        socket.emit('stop typing', selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  }


  return (
    <>
      {
        selectedChat ? (
          <>
            <Text
              fontSize={{ base: "28px", md: "30px" }}
              pb={3}
              px={2}
              w="100%"
              display={"flex"}
              justifyContent={{ base: "space-between" }}
              alignItems={"center"}
            >
              <IconButton
                display={{ base: "flex", md: "none" }}
                icon={<ArrowBackIcon />}
                onClick={() => setSelectedChat(null)}
              />

              {!selectedChat.isGroupChat ? (
                <>
                  {getSender(user, selectedChat.users).name}
                  <ProfileModal user={getSender(user, selectedChat.users)} />
                </>
              ) : (
                <>
                  {selectedChat.chatName.toUpperCase()}
                  <UpdateGroupChatModal fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
                </>
              )}
            </Text>
            <Box
              display={"flex"}
              flexDir={"column"}
              justifyContent={"flex-end"}
              p={3}
              bg={"#d5ebf5"}
              w={"100%"}
              borderRadius={"lg"}
              overflowY={"auto"}
              h={"80vh"}
            >
              { loading ? 
              <Spinner
                size={"xl"}
                w={20}
                h={20}
                alignSelf={"center"}
                m={"auto"}
                colorScheme='facebook'
              /> : (
                <Message messages={messages} />
              ) }

              <FormControl onKeyDown={sendMessage} isRequired mt={3}>
                { isTyping ? (
                  <div style={{ width: '50px' }}>
                    <Lottie
                      animationData={typingAnimationData}
                    />
                  </div>
                ) : <></> }
                <Container display={"flex"}>
                  <Input
                    variant={"filled"}
                    bg={"#FFFFFF"}
                    placeholder='Type message...'
                    onChange={typingHandler}
                    value={newMessage}
                    borderRightRadius={"0px"}
                  />
                  <IconButton
                    isLoading={sendingMessage}
                    onClick={sendMessage}
                    icon={<ChevronRightIcon />}
                    bgColor={"white"}
                    borderLeftRadius={"0px"}
                  />
                </Container>
              </FormControl>
            </Box>
          </>
        ) : (
          <Box display="flex" alignItems={"center"} justifyContent={"center"} height={"100%"} w="100%">
            <Text fontSize={"3xl"} pb={3} mx={"auto"} textAlign={"center"}>Click on a user to start chatting</Text>
          </Box>
        )
      }
    </>
  )
}

export default SingleChat