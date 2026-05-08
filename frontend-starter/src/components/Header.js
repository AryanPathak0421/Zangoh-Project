// src/components/Header.js
import React from 'react';
import {
  Flex,
  Text,
  Avatar,
  Box,
} from '@chakra-ui/react';

const Header = () => {
  return (
    <Flex
      as="header"
      bg="#3B3272" // Dark purple color from image
      color="white"
      px={6}
      py={3}
      justify="space-between"
      align="center"
      borderRadius="xl"
      mb={6}
      mx={4}
      mt={4}
      position="sticky"
      top="4"
      zIndex={10}
    >
      <Text fontSize="lg" fontWeight="bold">
        ABC Company
      </Text>
      
      <Flex align="center">
        <Avatar size="sm" src="https://bit.ly/dan-abramov" />
      </Flex>
    </Flex>
  );
};

export default Header;

