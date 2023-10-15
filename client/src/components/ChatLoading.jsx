import { Skeleton, Stack } from '@chakra-ui/react'
import React from 'react'

const ChatLoading = () => {
  const arr = [1,2,3,4,5,6,7,8,9,10,11,12];
  return (
    <>
      <Stack>
        { arr.map((elem) => (
          <Skeleton key={elem} height="45px" />
        )) }
      </Stack>
    </>
  )
}

export default ChatLoading