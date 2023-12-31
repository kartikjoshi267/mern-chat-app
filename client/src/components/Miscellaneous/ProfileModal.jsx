import { ViewIcon } from "@chakra-ui/icons";
import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  IconButton,
  useDisclosure,
  Button,
  Image,
  Text,
  Avatar,
} from "@chakra-ui/react";

const ProfileModal = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

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

      <Modal size={"lg"} isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent
          height={"410px"}
        >
          <ModalHeader
            fontSize={"40px"}
            fontFamily={"Raleway"}
            display={"flex"}
            justifyContent={"center"}
          >
            {user.name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display={"flex"}
            flexDir={"column"}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Avatar
              src={user.picture}
              name={user.name}
              boxSize={"150px"}
              borderRadius={"full"}
            />
            <Text
              fontSize={{ base: '28px', md: '30px' }}
              fontFamily={'Raleway'}
            >
              Email: {user.email}
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;
