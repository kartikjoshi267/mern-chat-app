import { Avatar, Box, Text } from '@chakra-ui/react'
import React from 'react'

const UserListItem = ({
  user,
  handleFunction,
}) => {
  return (
    <>
      <Box
        onClick={handleFunction}
        cursor={"pointer"}
        bg={"#e8e8e8"}
        _hover={{
          background: "#0283ba",
          color: "#FFFFFF"
        }}
        w="100%"
        display={"flex"}
        alignItems={"center"}
        color={"black"}
        px={3}
        py={2}
        mb={2}
        borderRadius={"lg"}
      >
        <Avatar
          mr={2}
          size={"sm"}
          cursor={"pointer"}
          name={user.name}
          src={user.picture}
          
        />
        <Box>
          <Text>{user.name}</Text>
          <Text fontSize={"xs"}>
            <strong>Email: </strong>
            {user.email}
          </Text>
        </Box>
      </Box>
    </>
  )
}

export default UserListItem