import { AddIcon } from "@chakra-ui/icons";
import { Box, Button } from "@chakra-ui/react";
import React from "react";
import ProfileModal from "./Miscellaneous/ProfileModal";
import { ChatState } from "../context/ChatProvider";
import SingleChat from "./SingleChat";

const ChatBox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = ChatState();
  return (
    <>
      <Box
        display={{ base: selectedChat !== null ? "flex" : "none", md: "flex" }}
        flexDir={"column"}
        alignItems={"center"}
        p={3}
        ml={2}
        bg={"white"}
        w={{ base: "100%", md: "69%" }}
        borderRadius={"lg"}
        borderWidth={"1px"}
      >
        <Box
          flex={1}
          pb={3}
          px={3}
          fontSize={{ base: "28px", md: "30px" }}
          fontFamily={"Raleway"}
          display={"flex"}
          w={"100%"}
          flexDir={"column"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        </Box>
      </Box>
    </>
  );
};

export default ChatBox;
