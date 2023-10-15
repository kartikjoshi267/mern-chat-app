import React from "react";
import { ChatState } from "../context/ChatProvider";
import { Avatar, Container, Image, Text, Tooltip } from "@chakra-ui/react";
import ScrollableFeed from "react-scrollable-feed";
import { isLastMessage } from "../config/ChatLogics";

const Message = ({ messages }) => {
  const { user, selectedChat } = ChatState();
  return (
    <ScrollableFeed>
      {messages && messages.map((message, index) => {
        return (
          <div
            key={index}
            style={{
              display: "flex",
              justifyContent: "flex-start",
              flexDirection:
                user._id === message.sender._id ? "row-reverse" : "row",
              alignItems: "flex-end",
              marginLeft: isLastMessage(messages, index) || user._id === message.sender._id ? "0" : "2rem"
            }}
          >
            {(isLastMessage(messages, index) && user._id !== message.sender._id) ? (
              <Tooltip
                label={message.sender.name}
                placement={"bottom-start"}
                hasArrow
              >
                <Avatar
                  w={8}
                  h={8}
                  borderRadius={"full"}
                  src={message.sender.picture}
                  name={message.sender.name}
                />
              </Tooltip>
            ) : (
              <></>
            )}
            <Container
              borderRadius={"lg"}
              maxW={{ base: "130px", md: "200px" }}
              minW={"130px"}
              m={2}
              p={2}
              bgColor={
                user._id === message.sender._id ? "green.200" : "blue.300"
              }
              fontSize={"lg"}
            >
              {selectedChat.isGroupChat ? (
                <Text fontSize={"xs"} color={"whatsapp.600"}>
                  {user._id === message.sender._id
                    ? "You"
                    : message.sender.name}
                </Text>
              ) : null}
              {message.content}
            </Container>
          </div>
        );
      })}
    </ScrollableFeed>
  );
};

export default Message;
