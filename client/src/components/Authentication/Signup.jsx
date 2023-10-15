import React, { useState } from "react";
import {
  VStack,
  FormLabel,
  Input,
  FormControl,
  InputGroup,
  InputRightElement,
  Button,
  useToast,
} from "@chakra-ui/react";
import cloudinary from "cloudinary-core";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigator = useNavigate();
  const toast = useToast();
  const [show, setShow] = useState(false);
  const [cShow, setCShow] = useState(false);
  const [credentials, setCredentials] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    picture: "",
  });
  const [loading, setLoading] = useState(false);

  const onChangeHandler = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const postDetails = (pics) => {
    setLoading(true);
    if (pics === undefined) {
      toast({
        title: "Please select an image",
        status: "warning",
        position: "bottom",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "mern-chat-app");
      data.append("cloud_name", "djybz7jly");
      fetch("https://api.cloudinary.com/v1_1/djybz7jly/image/upload", {
        method: "POST",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setCredentials({ ...credentials, picture: data.url.toString() });
          setLoading(false);
          toast({
            title: 'Picture successfully uploaded',
            status: 'success',
            duration: 5000,
            isClosable: true,
            position: 'bottom'
          });
        });
    } else {
      toast({
        title: "Please select an image",
        status: "warning",
        position: "bottom",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!credentials.name || !credentials.email || !credentials.password || !credentials.confirmPassword) {
      toast({
        title: 'Please fill all the fields',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'bottom'
      });
      setLoading(false);
      return;
    }

    if (credentials.password !== credentials.confirmPassword){
      toast({
        title: 'Passwords do not match',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'bottom'
      });
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      }
      
      let data;
      if (credentials.picture !== ""){
        const { dat } = await axios.post("/api/user/", { name: credentials.name, email: credentials.email, picture: credentials.picture, password: credentials.password }, config);
        data = dat;
      } else {
        const { dat } = await axios.post("/api/user/", { name: credentials.name, email: credentials.email, password: credentials.password }, config);
        data = dat;
      }
      toast({
        title: 'Registration successful',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'bottom'
      });

      localStorage.setItem('userInfo', JSON.stringify(data));
      setLoading(false);
      navigator("/chats");
    } catch (error) {
      
    }
  };

  return (
    <>
      <VStack spacing={5} align="stretch">
        <FormControl isRequired>
          <FormLabel>Name</FormLabel>
          <Input
            type="text"
            name="name"
            value={credentials.name}
            required={true}
            placeholder="Enter your name"
            onChange={(e) => onChangeHandler(e)}
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Email address</FormLabel>
          <Input
            type="email"
            name="email"
            value={credentials.email}
            required={true}
            placeholder="Enter your email"
            onChange={(e) => onChangeHandler(e)}
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Password</FormLabel>
          <InputGroup>
            <Input
              type={show ? "text" : "password"}
              name="password"
              value={credentials.password}
              required={true}
              placeholder="Enter your password"
              onChange={(e) => onChangeHandler(e)}
            />
            <InputRightElement width="4.5rem">
              <Button h="1.75rem" size={"sm"} onClick={(e) => setShow(!show)}>
                {show ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Confirm Password</FormLabel>
          <InputGroup>
            <Input
              type={cShow ? "text" : "password"}
              name="confirmPassword"
              value={credentials.confirmPassword}
              required={true}
              placeholder="Confirm your password"
              onChange={(e) => onChangeHandler(e)}
            />
            <InputRightElement width="4.5rem">
              <Button h="1.75rem" size={"sm"} onClick={(e) => setCShow(!cShow)}>
                {cShow ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>
        <FormControl id="pic">
          <FormLabel>Upload your picture</FormLabel>
          <Input
            type="file"
            name="picture"
            p={1.5}
            accept="image/*"
            placeholder="Enter your picture"
            onChange={(e) => postDetails(e.target.files[0])}
          />
        </FormControl>
        <Button
          colorScheme="blue"
          width={"100%"}
          style={{ marginTop: 15 }}
          onClick={submitHandler}
          isLoading={loading}
        >
          Sign Up
        </Button>
      </VStack>
    </>
  );
};

export default Signup;
