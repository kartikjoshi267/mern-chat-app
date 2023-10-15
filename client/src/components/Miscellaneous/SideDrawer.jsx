import {
  Avatar,
  Box,
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import React, { useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import ProfileModal from "./ProfileModal";
import { useNavigate } from "react-router-dom";
import DrawerComponent from "./DrawerComponent";
import axios from "axios";
import { NotificationState } from "../../context/NotificationProvider";
import { getSender } from "../../config/ChatLogics";

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const { user, setSelectedChat } = ChatState();
  const { notification, setNotification } = NotificationState();
  const navigator = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleSearch = async () => {
    if (search === "") {
      toast({
        title: "Please enter something in search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          authorization: `Bearer ${user.token}`,
          'Content-type': 'application/json'
        }
      }

      const { data } = await axios.get(`/api/user?search=${search}`, config);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error occured!",
        description: "Failed to load the search results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      setLoading(false);
    }
  };

  const logOutHandler = () => {
    localStorage.removeItem("userInfo");
    toast({
      title: "User successfully logged out",
      status: "success",
      duration: 5000,
      isClosable: true,
      position: "bottom",
    });
    navigator("/");
  };

  return (
    <>
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        bg={"white"}
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth={"5px"}
      >
        <Tooltip label="Search Users to Chat" hasArrow placement="bottom-end">
          <Button variant={"solid"} colorScheme="blue" onClick={onOpen}>
            <i className="fas fa-search"></i>
            <Text display={{ base: "none", md: "flex" }} px={4}>
              Search User
            </Text>
          </Button>
        </Tooltip>

        <Text fontSize={"2xl"} fontFamily={"Raleway"}>
          Chat App
        </Text>

        <div>
          <Menu>
            <MenuButton p="1" position={"relative"}>
            {
              notification.length > 0 ? (
                <div
                  style={{
                    position: 'absolute',
                    right: '4px',
                    backgroundColor: 'red',
                    borderRadius: '100%',
                    padding: '0px 5px',
                    fontSize: '12px'
                  }}
                >
                  {notification.length}
                </div>
              ): null
            }
              <BellIcon fontSize={"2xl"} m="1" />
            </MenuButton>
            <MenuList pl={2}>
              {!notification.length && "No new notifications"}
              {notification.map((n, index) => {
                return (
                  <MenuItem key={index} onClick={() => {
                    setSelectedChat(n.chat);
                    setNotification(notification.filter(notif => notif !== n))
                  }}>
                    { n.chat.isGroupChat ? `New Messages in ${n.chat.chatName}` : `New Messages from ${getSender(user, n.chat.users).name}` }
                  </MenuItem>
                )
              })}
            </MenuList>
          </Menu>

          <Menu>
            <MenuButton
              as={Button}
              colorScheme="blue"
              rightIcon={<ChevronDownIcon />}
            >
              <Avatar
                size={"sm"}
                cursor={"pointer"}
                name={user.name}
                src={user.picture}
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuItem onClick={logOutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      <DrawerComponent
        isOpen={isOpen}
        onClose={onClose}
        onOpen={onOpen}
        search={search}
        setSearch={setSearch}
        handleSearch={handleSearch}
        loading={loading}
        searchResults={searchResult}
        setSearchResults={setSearchResult}
        setLoadingChat={setLoadingChat}
        loadingChat={loadingChat}
      />
    </>
  );
};

export default SideDrawer;
