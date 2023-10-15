import { CloseIcon } from '@chakra-ui/icons'
import { Badge } from '@chakra-ui/react'
import React from 'react'

const UserBadgeItem = ({
  user,
  handleDelete,
  scheme,
}) => {

  return (
    <>
      <Badge
        p={1.5}
        m={1}
        rounded={"lg"}
        colorScheme={scheme}
        variant={"solid"}
        cursor={"pointer"}
        onClick={() => handleDelete(user)}
        fontWeight={"bold"}
      >
        {user.name}
        <CloseIcon ml={2} fontSize={"9px"} />
      </Badge>
    </>
  )
}

export default UserBadgeItem