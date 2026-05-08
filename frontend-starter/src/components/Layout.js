// src/components/Layout.js
import React from 'react';
import { Box, Flex } from '@chakra-ui/react';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = ({ children }) => {
  return (
    <Box minH="100vh" bg="#F4F3F8"> {/* Light gray/purple background from image */}
      <Header />
      <Flex>
        <Sidebar />
        <Box 
          as="main" 
          flex="1" 
          ml={{ base: 0, md: '110px' }} // 70px width + 16px left + some gap
          mr={4}
          mb={4}
        >
          {children}
        </Box>
      </Flex>
    </Box>
  );
};

export default Layout;