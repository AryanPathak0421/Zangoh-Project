// src/pages/Templates.js
import React, { useState } from 'react';
import {
  Box,
  Flex,
  Text,
  Button,
  VStack,
  HStack,
  Input,
  Icon,
  SimpleGrid,
  Badge,
  InputGroup,
  InputLeftElement,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Select,
  Textarea,
  Heading,
} from '@chakra-ui/react';
import { FiSearch, FiSliders, FiPlus, FiMessageCircle, FiUser, FiCalendar, FiTrash2, FiEdit2, FiArrowRight, FiCheck, FiMoreVertical } from 'react-icons/fi';

const Templates = () => {
  const [selectedCategory, setSelectedCategory] = useState('Onboarding');
  const [selectedTab, setSelectedTab] = useState('My Templates');
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const [editTemplate, setEditTemplate] = useState({
    name: '',
    title: 'Say Hi to welcome new visitors!',
    category: 'Chat',
    content: 'Hi <user name>! Welcome to <company name>. How may I be of help today?',
  });

  const categories = [
    { name: 'All' },
    { name: 'Popular' },
    { type: 'heading', name: 'Use Cases' },
    { name: 'Onboarding' },
    { name: 'Return' },
    { name: 'Engagement' },
    { name: 'Transaction' },
    { type: 'heading', name: 'Channels' },
    { name: 'Website' },
    { name: 'Mobile' },
    { name: 'Messenger' },
  ];

  const templates = [
    {
      id: 1,
      title: 'Say Hi to welcome new visitors!',
      message: 'Hi [user name]! Welcome to [company name]. How may I help you today?',
      type: 'Chat',
      users: '1234',
      date: 'Feb 7',
    },
    {
      id: 2,
      title: 'Ask new users if they need any help.',
      message: 'Hi [user name]! Welcome to [company name]. Let me know if you need any help.',
      type: 'Chat',
      users: '2345',
      date: 'Feb 9',
    },
    {
      id: 3,
      title: 'Take new users on a tour.',
      message: 'Hi [user name]! Welcome to [company name]. Let me show you around!',
      type: 'Message',
      users: '1234',
      date: 'Feb 1',
    },
    {
      id: 4,
      title: 'Learn about personalised experiences.',
      message: 'Hi [user name]! Can you take this quick survey to help us serve you better?',
      type: 'Website',
      users: '456',
      date: 'Feb 7',
    },
    {
      id: 5,
      title: 'Guide users through a new feature.',
      message: 'Hi [user name]! We just introduced a new feature. Let me show you.',
      type: 'Chat',
      users: '1234',
      date: 'Feb 2',
    },
  ];

  const handleEditClick = (tmpl) => {
    setEditTemplate({
      name: '',
      title: tmpl.title,
      category: tmpl.type,
      content: tmpl.message,
    });
    onOpen();
  };

  return (
    <Flex gap={4} h="calc(100vh - 120px)">
      {/* Column 1: Filters */}
      <Box flex="1" bg="white" borderRadius="xl" boxShadow="sm" p={4} overflowY="auto">
        <HStack spacing={2} mb={4}>
          <InputGroup size="sm">
            <InputLeftElement pointerEvents="none">
              <Icon as={FiSearch} color="gray.400" />
            </InputLeftElement>
            <Input placeholder="Search" bg="#F4F3F8" border="none" borderRadius="full" />
          </InputGroup>
          <Box bg="#F4F3F8" p={2} borderRadius="md" cursor="pointer">
            <Icon as={FiSliders} color="#555" />
          </Box>
        </HStack>

        <VStack align="stretch" spacing={1}>
          {categories.map((cat, index) => {
            if (cat.type === 'heading') {
              return (
                <Text key={index} fontSize="xs" color="gray.400" mt={3} mb={1} fontWeight="bold" px={3}>
                  {cat.name}
                </Text>
              );
            }
            return (
              <Box
                key={index}
                p={2}
                px={3}
                borderRadius="lg"
                cursor="pointer"
                bg={selectedCategory === cat.name ? '#F4F3F8' : 'transparent'}
                color={selectedCategory === cat.name ? '#2D2D2D' : 'gray.600'}
                fontWeight={selectedCategory === cat.name ? 'bold' : 'medium'}
                fontSize="sm"
                _hover={{ bg: '#F4F3F8' }}
                onClick={() => setSelectedCategory(cat.name)}
              >
                {cat.name}
              </Box>
            );
          })}
        </VStack>
      </Box>

      {/* Column 2: Templates Grid */}
      <Box flex="3" bg="white" borderRadius="xl" boxShadow="sm" p={6} overflowY="auto">
        <Flex justify="space-between" align="center" mb={6}>
          <Heading fontSize="2xl" color="#2D2D2D">Response Templates</Heading>
          <Button bg="#3B3272" color="white" borderRadius="full" px={6} _hover={{ bg: '#2C2554' }} leftIcon={<Icon as={FiPlus} />}>
            Create Template
          </Button>
        </Flex>

        <HStack spacing={4} mb={6}>
          <Button
            bg={selectedTab === 'My Templates' ? '#3B3272' : '#F4F3F8'}
            color={selectedTab === 'My Templates' ? 'white' : '#555'}
            borderRadius="full"
            px={6}
            size="sm"
            onClick={() => setSelectedTab('My Templates')}
            _hover={{ bg: selectedTab === 'My Templates' ? '#2C2554' : '#E8E6F2' }}
          >
            My Templates
          </Button>
          <Button
            bg={selectedTab === 'Shared Templates' ? '#3B3272' : '#F4F3F8'}
            color={selectedTab === 'Shared Templates' ? 'white' : '#555'}
            borderRadius="full"
            px={6}
            size="sm"
            onClick={() => setSelectedTab('Shared Templates')}
            _hover={{ bg: selectedTab === 'Shared Templates' ? '#2C2554' : '#E8E6F2' }}
          >
            Shared Templates
          </Button>
        </HStack>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {templates.map((tmpl) => (
            <Box key={tmpl.id} bg="white" border="1px" borderColor="gray.100" borderRadius="xl" p={4} position="relative" _hover={{ boxShadow: 'md' }}>
              {/* Message Bubble Mockup */}
              <Box bg="#F4F3F8" p={3} borderRadius="lg" mb={3}>
                <Flex justify="space-between" align="center" mb={1}>
                  <HStack spacing={1}>
                    <Box w="6px" h="6px" bg="#3B3272" borderRadius="full" />
                    <Text fontSize="xs" color="gray.500" fontWeight="bold">{tmpl.type}</Text>
                  </HStack>
                  <Icon as={FiMoreVertical} color="gray.400" />
                </Flex>
                <Text fontSize="xs" color="#2D2D2D" noOfLines={2}>
                  {tmpl.message}
                </Text>
              </Box>

              <Text fontSize="sm" fontWeight="bold" color="#2D2D2D" mb={3}>
                {tmpl.title}
              </Text>

              <HStack spacing={2} fontSize="xs" color="gray.500">
                <Badge bg="#F4F3F8" color="#555" px={2} py={0.5} borderRadius="full" textTransform="none">
                  <HStack spacing={1}>
                    <Icon as={FiMessageCircle} boxSize={3} />
                    <Text>{tmpl.type}</Text>
                  </HStack>
                </Badge>
                <Badge bg="#F4F3F8" color="#555" px={2} py={0.5} borderRadius="full" textTransform="none">
                  <HStack spacing={1}>
                    <Icon as={FiUser} boxSize={3} />
                    <Text>{tmpl.users}</Text>
                  </HStack>
                </Badge>
                <Badge bg="#F4F3F8" color="#555" px={2} py={0.5} borderRadius="full" textTransform="none">
                  <HStack spacing={1}>
                    <Icon as={FiCalendar} boxSize={3} />
                    <Text>{tmpl.date}</Text>
                  </HStack>
                </Badge>
              </HStack>

              {/* Action Icons */}
              <HStack spacing={2} position="absolute" bottom="-15px" left="50%" transform="translateX(-50%)">
                <Box bg="white" p={2} borderRadius="full" boxShadow="md" cursor="pointer" border="1px" borderColor="gray.100">
                  <Icon as={FiTrash2} color="red.400" />
                </Box>
                <Box bg="white" p={2} borderRadius="full" boxShadow="md" cursor="pointer" border="1px" borderColor="gray.100" onClick={() => handleEditClick(tmpl)}>
                  <Icon as={FiEdit2} color="#3B3272" />
                </Box>
                <Box bg="white" p={2} borderRadius="full" boxShadow="md" cursor="pointer" border="1px" borderColor="gray.100">
                  <Icon as={FiArrowRight} color="green.400" />
                </Box>
              </HStack>
            </Box>
          ))}
        </SimpleGrid>
      </Box>

      {/* Edit Template Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="5xl">
        <ModalOverlay />
        <ModalContent borderRadius="2xl" p={4}>
          <ModalHeader>
            <Flex justify="space-between" align="center">
              <Text fontSize="xl" fontWeight="bold">Edit Template</Text>
              <Text fontSize="xl" fontWeight="bold" mr={10}>Preview</Text>
            </Flex>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex gap={6}>
              {/* Left Form */}
              <VStack flex="1" align="stretch" spacing={4}>
                <Box>
                  <Text fontSize="xs" color="gray.400" mb={1}>Name</Text>
                  <Input 
                    placeholder="Template name" 
                    value={editTemplate.name}
                    onChange={(e) => setEditTemplate({...editTemplate, name: e.target.value})}
                    bg="white" border="1px" borderColor="gray.200" borderRadius="md" 
                  />
                </Box>
                
                <Box>
                  <Text fontSize="xs" color="gray.400" mb={1}>Title</Text>
                  <Input 
                    placeholder="Title" 
                    value={editTemplate.title}
                    onChange={(e) => setEditTemplate({...editTemplate, title: e.target.value})}
                    bg="white" border="1px" borderColor="gray.200" borderRadius="md" 
                  />
                </Box>

                <Box>
                  <Text fontSize="xs" color="gray.400" mb={1}>Category</Text>
                  <Select 
                    value={editTemplate.category}
                    onChange={(e) => setEditTemplate({...editTemplate, category: e.target.value})}
                    bg="white" border="1px" borderColor="gray.200" borderRadius="md"
                  >
                    <option>Chat</option>
                    <option>Message</option>
                    <option>Website</option>
                  </Select>
                </Box>

                <Box>
                  <Text fontSize="xs" color="gray.400" mb={1}>Content</Text>
                  <Textarea 
                    placeholder="Content" 
                    value={editTemplate.content}
                    onChange={(e) => setEditTemplate({...editTemplate, content: e.target.value})}
                    bg="white" border="1px" borderColor="gray.200" borderRadius="md"
                    h="150px"
                  />
                  {/* Dummy Toolbar */}
                  <HStack spacing={2} mt={1} color="gray.500" fontSize="xs">
                    <Icon as={FiArrowRight} />
                    <Icon as={FiArrowRight} transform="rotate(180deg)" />
                    <Text fontWeight="bold">B</Text>
                    <Text as="i">I</Text>
                    <Text as="u">U</Text>
                    <Text>A</Text>
                  </HStack>
                </Box>

                <Flex justify="space-between" align="center" mt={4}>
                  <Button bg="#3B3272" color="white" borderRadius="full" px={6} leftIcon={<Icon as={FiCheck} />}>
                    Share with Team
                  </Button>
                  <HStack spacing={3}>
                    <Button bg="#F4F3F8" color="#555" borderRadius="full" px={6} onClick={onClose}>
                      Cancel
                    </Button>
                    <Button bg="#3B3272" color="white" borderRadius="full" px={6} onClick={onClose}>
                      Save
                    </Button>
                  </HStack>
                </Flex>
              </VStack>

              {/* Right Preview */}
              <Box flex="1" bg="white" border="1px" borderColor="gray.100" borderRadius="xl" p={6} display="flex" flexDirection="column" justifyContent="center">
                <Box bg="#F4F3F8" p={4} borderRadius="lg" w="100%">
                  <Flex justify="space-between" align="center" mb={2}>
                    <HStack spacing={1}>
                      <Box w="6px" h="6px" bg="#3B3272" borderRadius="full" />
                      <Text fontSize="xs" color="gray.500" fontWeight="bold">{editTemplate.category}</Text>
                    </HStack>
                    <Icon as={FiMoreVertical} color="gray.400" />
                  </Flex>
                  <Text fontSize="sm" color="#2D2D2D">
                    {editTemplate.content}
                  </Text>
                </Box>
              </Box>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default Templates;
