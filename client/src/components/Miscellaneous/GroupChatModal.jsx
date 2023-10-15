import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  IconButton,
  Button,
  useToast,
  FormControl,
  Input,
  Spinner,
  HStack,
} from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";
import { ChatState } from "../../context/ChatProvider";
import axios from "axios";
import UserListItem from "../UserAvatar/UserListItem";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";

const GroupChatModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const toast = useToast({
    duration: 5000,
    position: "bottom",
    isClosable: true,
  });

  const { user, chats, setChats } = ChatState();

  const schemes = [
    "red",
    "orange",
    "green",
    "blue",
    "cyan",
    "purple",
    "pink",
    "teal",
  ];

  const handleSearch = async (query) => {
    setSearch((prev) => query);
    if (query === "") {
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          authorization: "Bearer " + user.token,
        },
      };

      const { data } = await axios.get(`/api/user?search=${search}`, config);
      setLoading(false);
      setSearchResults(data);
    } catch (error) {
      toast({
        title: "Error occurred",
        description: "Failed to load search results",
        status: "error",
      });
    }
  };

  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      toast({
        title: "Please fill all the fields",
        status: "warning",
        position: "top",
      });
      return;
    }

    setSubmitLoading(true);
    try {
      const config = {
        headers: {
          authorization: "Bearer " + user.token,
        },
      };

      const { data } = await axios.post(
        "/api/chat/group",
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );

      setChats([data, ...chats]);
      onClose();
      toast({
        title: "New Group Chat created",
        status: "success",
      });
    } catch (error) {
      toast({
        title: "Failed to create the chat",
        status: "error",
      });
    }

    setSubmitLoading(false);
  };

  const handleGroup = (currentUser) => {
    if (selectedUsers.includes(currentUser)) {
      toast({
        title: "User already added",
        status: "warning",
      });
    } else {
      setSelectedColors([
        ...selectedColors,
        schemes[Math.round(Math.random() * schemes.length)],
      ]);
      setSelectedUsers([...selectedUsers, currentUser]);
    }
  };

  const handleDelete = (currentUser) => {
    const index = selectedUsers.indexOf(currentUser);
    setSelectedUsers(selectedUsers.filter((e) => e._id !== currentUser._id));
    setSelectedColors(
      selectedColors.filter((e) => e !== selectedColors[index])
    );
  };

  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <>
          <IconButton
            display={{ base: "flex" }}
            icon={<ViewIcon />}
            onClick={onOpen}
          />
        </>
      )}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize={"35px"}
            display={"flex"}
            justifyContent={"center"}
          >
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display={"flex"} flexDir={"column"} alignItems={"center"}>
            <FormControl>
              <Input
                placeholder="Chat Name"
                mb={3}
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <Input
                placeholder="Search users to be added"
                mb={3}
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            <HStack
              m={3}
              display={"flex"}
              alignItems={"center"}
              justifyContent={"start"}
            >
              {selectedUsers.map((currentUser, index) => (
                <UserBadgeItem
                  key={index}
                  user={currentUser}
                  handleDelete={handleDelete}
                  scheme={selectedColors[index]}
                />
              ))}
            </HStack>
            <>
              {loading ? (
                <Spinner />
              ) : (
                <>
                  {searchResults.slice(0, 4).map((currentUser) => (
                    <UserListItem
                      key={currentUser._id}
                      user={currentUser}
                      handleFunction={() => handleGroup(currentUser)}
                    />
                  ))}
                </>
              )}
            </>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" onClick={handleSubmit} _loading={submitLoading}>
              Create Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;
