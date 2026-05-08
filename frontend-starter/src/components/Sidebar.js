// src/components/Sidebar.js
import React from 'react';
import {
  Box,
  VStack,
  Icon,
  Button,
} from '@chakra-ui/react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FiHome, 
  FiMessageCircle, 
  FiBriefcase, 
  FiZap, 
  FiSettings 
} from 'react-icons/fi';

const Sidebar = () => {
  const location = useLocation();
  
  const isActive = (path) => location.pathname === path;
  
  const navItems = [
    { name: 'Dashboard', icon: FiHome, path: '/' },
    { name: 'Conversations', icon: FiMessageCircle, path: '/conversations' },
    { name: 'AI Agents', icon: FiBriefcase, path: '/agent-config' },
    { name: 'Templates', icon: FiZap, path: '/templates' },
  ];
  
  return (
    <Box
      position="fixed"
      left={4}
      top="100px" // Adjusted to be below the header
      w="70px" // Narrow width as per image
      h="calc(100vh - 120px)"
      bg="white"
      borderRadius="xl"
      p={2}
      boxShadow="sm"
      display={{ base: 'none', md: 'flex' }}
      flexDirection="column"
      justifyContent="space-between"
      alignItems="center"
      zIndex={10}
    >
      <VStack spacing={4} align="center" mt={4}>
        {navItems.map((item) => (
          <Button
            key={item.path}
            as={Link}
            to={item.path}
            variant="ghost"
            p={3}
            bg={isActive(item.path) ? '#F4F3F8' : 'transparent'}
            color={isActive(item.path) ? '#3B3272' : 'gray.500'}
            borderRadius="xl"
            _hover={{ bg: '#F4F3F8', color: '#3B3272' }}
            title={item.name}
          >
            <Icon as={item.icon} boxSize={5} />
          </Button>
        ))}
      </VStack>
      
      <Button
        as={Link}
        to="/settings"
        variant="ghost"
        p={3}
        mb={4}
        color="gray.500"
        borderRadius="xl"
        _hover={{ bg: '#F4F3F8', color: '#3B3272' }}
        title="Settings"
      >
        <Icon as={FiSettings} boxSize={5} />
      </Button>
    </Box>
  );
};

export default Sidebar;