import { Box, Container, Text, Tabs, Tab, TabList, TabPanel, TabPanels } from "@chakra-ui/react";
import React, { useEffect } from "react";
import Login from "../components/Authentication/Login";
import Signup from "../components/Authentication/Signup";
import { ChatState } from "../context/ChatProvider";
import { useNavigate } from "react-router-dom";

const Homepage = () => {
  const navigator = useNavigate();
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user-info'));
    if (user) {
      navigator("/chats");
    }
  }, [location]);

  return (
    <>
      <Container maxW={"xl"} centerContent h={"100vh"}>
        <Box
          display={"flex"}
          justifyContent={"center"}
          p={3}
          bg={"white"}
          w={"100%"}
          m="40px 0px 15px 0px"
          borderRadius={"lg"}
          borderWidth={"1px"}
        >
          <Text fontSize={"4xl"} color={"black"}>
            ChatApp
          </Text>
        </Box>
        <Box
          bg={"white"}
          w="100%"
          p={4}
          borderRadius={"lg"}
          borderWidth={"1px"}
        >
          <Tabs size="md" isFitted variant="enclosed">
            <TabList mb="1em">
              <Tab>Login</Tab>
              <Tab>Sign Up</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Login />
              </TabPanel>
              <TabPanel>
                <Signup />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Container>
    </>
  );
};

export default Homepage;
