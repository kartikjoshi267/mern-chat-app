import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Input,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import React from "react";
import ChatLoading from "../ChatLoading";
import UserListItem from "../UserAvatar/UserListItem";
import axios from "axios";
import { ChatState } from "../../context/ChatProvider";

function DrawerComponent({
  isOpen,
  onClose,
  handleSearch,
  setSearch,
  search,
  loading,
  loadingChat,
  setLoadingChat,
  searchResults,
  setSearchResults
}) {
  const { user, setSelectedChat, chats, setChats } = ChatState();
  const btnRef = React.useRef();
  const toast = useToast({
    isClosable: true,
    duration: 5000,
    position: 'bottom-left'
  });

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${user.token}`
        }
      };

      const { data } = await axios.post('/api/chat', { userId: userId }, config);
      
      if (!chats.find((c) => c._id === data._id)){
        setChats([data, ...chats]);
        toast({
          title: 'Successfully created chat',
          status: 'success'
        });
      } else {
        toast({
          title: 'Chat already exists',
          status: 'info'
        });
      }

      setSelectedChat(data);
      setSearch("");
      setSearchResults([]);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      console.log(error);
      toast({
        title: 'Error fetching the chat',
        description: error.message,
        status: 'error',
      })
      setLoadingChat(false);
    }
  }

  return (
    <>
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={() => {
          setSearch("");
          setSearchResults([]);
          onClose();
        }}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Search Users</DrawerHeader>
          <DrawerBody>
            <Box display={"flex"} pb={2}>
              <Input
                placeholder="Search by user or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            { loading ? (
              <>
                <ChatLoading />
              </>
            ) : (
              <>
                <>
                  {searchResults?.map(user => (
                    <UserListItem
                      key={user._id}
                      user={user}
                      handleFunction={() => accessChat(user._id)}
                    />
                  ))}
                </>
              </>
            ) }
            { loadingChat && <Spinner ml="auto" display={"flex"} /> }
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default DrawerComponent;
