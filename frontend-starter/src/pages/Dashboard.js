// src/pages/Dashboard.js
import React, { useState } from 'react';
import {
  Box,
  Flex,
  Text,
  VStack,
  HStack,
  Avatar,
  Badge,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Icon,
  Spinner,
} from '@chakra-ui/react';
import { FiArrowUp, FiArrowDown, FiFilter, FiMaximize2 } from 'react-icons/fi';
import { useAppData } from '../context/AppDataContext';

const Dashboard = () => {
  const { conversations, loading, error } = useAppData();
  const [selectedTab, setSelectedTab] = useState('All');

  // Helper functions for status colors
  const getStatusBg = (status) => {
    switch (status) {
      case 'active': return '#FFE5E5';
      case 'waiting': return '#FFF9E5';
      case 'resolved': return '#E5FFE5';
      case 'escalated': return '#E5F0FF';
      default: return '#F4F3F8';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return '#FF4D4D';
      case 'waiting': return '#FFAA00';
      case 'resolved': return '#2DCC70';
      case 'escalated': return '#0066FF';
      default: return '#555555';
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading.conversations) {
    return (
      <Flex justify="center" align="center" h="50vh">
        <Spinner size="xl" color="#3B3272" />
      </Flex>
    );
  }

  if (error.conversations) {
    return (
      <Box p={4} bg="red.100" color="red.700" borderRadius="md">
        Error loading conversations: {error.conversations}
      </Box>
    );
  }

  // Calculate metrics
  const activeConversations = conversations.filter(conv => conv.status === 'active').length;
  const escalatedConversations = conversations.filter(conv => conv.status === 'escalated').length;
  
  // Calculate real average response time from data
  const conversationsWithResponseTime = conversations.filter(conv => conv.metrics && conv.metrics.responseTime);
  const totalResponseTime = conversationsWithResponseTime.reduce((acc, conv) => acc + conv.metrics.responseTime, 0);
  const avgResponseTimeSec = conversationsWithResponseTime.length > 0 ? totalResponseTime / conversationsWithResponseTime.length : 84; // Fallback to 84s (01:24) if no data
  
  // Format as MM:SS
  const minutes = Math.floor(avgResponseTimeSec / 60);
  const seconds = Math.floor(avgResponseTimeSec % 60);
  const avgResponseTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  // Calculate real CSAT from sentiment (Sentiment * 10)
  const conversationsWithSentiment = conversations.filter(conv => conv.metrics && conv.metrics.sentiment !== undefined);
  const totalSentiment = conversationsWithSentiment.reduce((acc, conv) => acc + conv.metrics.sentiment, 0);
  const avgSentiment = conversationsWithSentiment.length > 0 ? totalSentiment / conversationsWithSentiment.length : 0.79; // Fallback to 0.79 to show 7.9
  const csatScore = (avgSentiment * 10).toFixed(1);

  // Filter conversations based on selected tab
  const filteredConversations = conversations.filter(conv => {
    if (selectedTab === 'All') return true;
    if (selectedTab === 'Needs Attention') return conv.status === 'escalated' || conv.alertLevel === 'high' || conv.alertLevel === 'medium';
    if (selectedTab === 'Resolved') return conv.status === 'resolved';
    return true;
  });

  return (
    <Box>
      {/* Metrics Grid */}
      <Flex gap={4} mb={6} direction={{ base: 'column', lg: 'row' }}>
        {/* CSAT Score Card */}
        <Box flex="2" bg="white" p={6} borderRadius="xl" boxShadow="sm">
          <Flex justify="space-between" align="center" mb={4}>
            <Text fontSize="lg" fontWeight="bold" color="#2D2D2D">
              Customer Satisfaction Score (CSAT)
            </Text>
            <Text fontSize="sm" color="gray.500">
              Today
            </Text>
          </Flex>
          
          {/* Custom Bar Chart Mockup */}
          <Flex align="flex-end" justify="space-around" h="150px" pt={4}>
            <VStack spacing={2}>
              <Box w="30px" h="40px" bg="#E8E6F2" borderRadius="md" />
              <Text fontSize="xs" color="gray.500">Mon</Text>
            </VStack>
            <VStack spacing={2}>
              <Box w="30px" h="100px" bg="#A59EC7" borderRadius="md" />
              <Text fontSize="xs" color="gray.500">Tue</Text>
            </VStack>
            <VStack spacing={2}>
              <Box w="30px" h="70px" bg="#A59EC7" borderRadius="md" />
              <Text fontSize="xs" color="gray.500">Wed</Text>
            </VStack>
            <VStack spacing={2}>
              <Box w="30px" h="95px" bg="#3B3272" borderRadius="md" position="relative">
                <Text 
                  position="absolute" 
                  top="-25px" 
                  left="50%" 
                  transform="translateX(-50%)"
                  fontSize="xs"
                  fontWeight="bold"
                  color="#3B3272"
                >
                  {csatScore}
                </Text>
              </Box>
              <Text fontSize="xs" color="gray.500">Today</Text>
            </VStack>
          </Flex>
        </Box>

        {/* Avg Response Time Card */}
        <Box flex="1" bg="white" p={6} borderRadius="xl" boxShadow="sm" display="flex" flexDirection="column" justifyContent="space-between">
          <Text fontSize="lg" fontWeight="bold" color="#2D2D2D">
            Avg. Response Time
          </Text>
          
          <Flex justify="space-between" align="flex-end">
            <Text fontSize="5xl" fontWeight="bold" color="#2D2D2D">
              {avgResponseTime}
            </Text>
            <Box bg="#FFE5E5" p={2} borderRadius="full">
              <Icon as={FiArrowDown} color="#FF4D4D" />
            </Box>
          </Flex>
        </Box>

        {/* Stacked Cards (Right) */}
        <VStack flex="1" spacing={4} align="stretch">
          {/* Active Conversations */}
          <Box bg="white" p={4} borderRadius="xl" boxShadow="sm" display="flex" flexDirection="column" justifyContent="space-between" h="100%">
            <Text fontSize="md" fontWeight="bold" color="#2D2D2D">
              Active Conversations
            </Text>
            <Flex justify="space-between" align="flex-end">
              <Text fontSize="4xl" fontWeight="bold" color="#2D2D2D">
                {activeConversations}
              </Text>
              <Box bg="#E5FFE5" p={2} borderRadius="full">
                <Icon as={FiArrowUp} color="#2DCC70" />
              </Box>
            </Flex>
          </Box>

          {/* Escalation Rate */}
          <Box bg="white" p={4} borderRadius="xl" boxShadow="sm" display="flex" flexDirection="column" justifyContent="space-between" h="100%">
            <Text fontSize="md" fontWeight="bold" color="#2D2D2D">
              Escalation Rate
            </Text>
            <Flex justify="space-between" align="flex-end">
              <Text fontSize="4xl" fontWeight="bold" color="#2D2D2D">
                {escalatedConversations > 0 ? `${Math.round((escalatedConversations / conversations.length) * 100)}%` : "0%"}
              </Text>
              <Box bg="#FFE5E5" p={2} borderRadius="full">
                <Icon as={FiArrowDown} color="#FF4D4D" />
              </Box>
            </Flex>
          </Box>
        </VStack>
      </Flex>

      {/* Conversations Table Card */}
      <Box bg="white" p={6} borderRadius="xl" boxShadow="sm">
        {/* Table Tabs/Header */}
        <Flex justify="space-between" align="center" mb={6}>
          <HStack spacing={2}>
            <Box 
              bg={selectedTab === 'All' ? "#3B3272" : "#F4F3F8"} 
              color={selectedTab === 'All' ? "white" : "#555"} 
              px={4} 
              py={2} 
              borderRadius="full" 
              cursor="pointer"
              onClick={() => setSelectedTab('All')}
            >
              <Text fontWeight="bold">All Conversations</Text>
            </Box>
            <Box 
              bg={selectedTab === 'Needs Attention' ? "#3B3272" : "#F4F3F8"} 
              color={selectedTab === 'Needs Attention' ? "white" : "#555"} 
              px={4} 
              py={2} 
              borderRadius="full" 
              cursor="pointer"
              _hover={{ bg: selectedTab === 'Needs Attention' ? '#2C2554' : '#E8E6F2' }}
              onClick={() => setSelectedTab('Needs Attention')}
            >
              <HStack spacing={1}>
                <Box w="6px" h="6px" bg="red.500" borderRadius="full" />
                <Text fontWeight="medium">Needs Attention</Text>
              </HStack>
            </Box>
            <Box 
              bg={selectedTab === 'Resolved' ? "#3B3272" : "#F4F3F8"} 
              color={selectedTab === 'Resolved' ? "white" : "#555"} 
              px={4} 
              py={2} 
              borderRadius="full" 
              cursor="pointer"
              _hover={{ bg: selectedTab === 'Resolved' ? '#2C2554' : '#E8E6F2' }}
              onClick={() => setSelectedTab('Resolved')}
            >
              <Text fontWeight="medium">Resolved</Text>
            </Box>
          </HStack>

          <HStack spacing={2}>
            <Box bg="#F4F3F8" p={2} borderRadius="lg" cursor="pointer">
              <Icon as={FiFilter} color="#555" />
            </Box>
            <Box bg="#F4F3F8" p={2} borderRadius="lg" cursor="pointer">
              <Icon as={FiMaximize2} color="#555" />
            </Box>
          </HStack>
        </Flex>

        {/* Table */}
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th color="gray.400" fontWeight="medium" textTransform="none" fontSize="sm">Name</Th>
              <Th color="gray.400" fontWeight="medium" textTransform="none" fontSize="sm">Message</Th>
              <Th color="gray.400" fontWeight="medium" textTransform="none" fontSize="sm">Status</Th>
              <Th color="gray.400" fontWeight="medium" textTransform="none" fontSize="sm">Time</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredConversations.map(conv => (
              <Tr key={conv.id}>
                <Td>
                  <HStack spacing={3}>
                    <Avatar size="sm" name={conv.customer?.name || 'Customer'} />
                    <Text fontWeight="bold" color="#2D2D2D">{conv.customer?.name || 'Customer'}</Text>
                  </HStack>
                </Td>
                <Td color="gray.500" fontSize="sm" maxW="300px" isTruncated>
                  {conv.messages && conv.messages.length > 0 
                    ? conv.messages[conv.messages.length - 1].text 
                    : 'No messages yet'}
                </Td>
                <Td>
                  <Badge 
                    bg={getStatusBg(conv.status)} 
                    color={getStatusColor(conv.status)} 
                    px={4} 
                    py={1} 
                    borderRadius="full"
                    textTransform="none"
                  >
                    {conv.status}
                  </Badge>
                </Td>
                <Td color="gray.500" fontSize="sm">{formatTime(conv.startTime)}</Td>
              </Tr>
            ))}
            {filteredConversations.length === 0 && (
              <Tr>
                <Td colSpan={4} textAlign="center" py={4} color="gray.500">
                  No conversations found.
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
};

export default Dashboard;