import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { ChatState } from '../context/ChatProvider'
import { Box } from '@chakra-ui/react';
import SideDrawer from '../components/Miscellaneous/SideDrawer';
import MyChats from '../components/MyChats';
import ChatBox from '../components/ChatBox';

const Chatpage = () => {
  const { user } = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false);

  return (
    <div style={{ width: '100%' }}>
      { user && < SideDrawer /> }
      <Box
        display={'flex'}
        justifyContent={'space-between'}
        w='100%'
        h='95.5vh'
        p={'10px'}
      >
        { user && <MyChats fetchAgain={fetchAgain} /> }
        { user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} /> }
      </Box>
    </div>
  )
}

export default Chatpage