// src/pages/ConversationView.js
import React, { useEffect, useState } from 'react';
import {
  Box,
  Flex,
  Text,
  Button,
  VStack,
  HStack,
  Avatar,
  Badge,
  Input,
  Textarea,
  Icon,
  Select,
} from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiSend, FiMoreVertical, FiClock } from 'react-icons/fi';
import { useAppData } from '../context/AppDataContext';
import { addMessage, updateConversationStatus } from '../api';

const ConversationView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { conversations, interveneInConversation, updateConversation } = useAppData();
  const [activeConv, setActiveConv] = useState(null);
  const [inputMessage, setInputMessage] = useState('');

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !activeConv) return;
    
    const newMessage = {
      _id: Date.now().toString(), // temporary ID
      text: inputMessage,
      sender: 'supervisor',
      timestamp: new Date().toISOString(),
    };
    
    const originalMessages = activeConv.messages || [];
    
    // Optimistic update in context
    updateConversation(activeConv.id || activeConv._id, {
      messages: [...originalMessages, newMessage]
    });
    
    // Optimistic update in local state (fallback if not in context list)
    setActiveConv(prev => ({
      ...prev,
      messages: [...originalMessages, newMessage]
    }));
    
    try {
      await addMessage(activeConv.id || activeConv._id, {
        text: inputMessage,
        sender: 'supervisor',
      });
      setInputMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
      // Rollback on error
      updateConversation(activeConv.id || activeConv._id, {
        messages: originalMessages
      });
    }
  };

  const handleResolve = async () => {
    if (!activeConv) return;
    try {
      await updateConversationStatus(activeConv.id || activeConv._id, 'resolved');
    } catch (error) {
      console.error('Failed to resolve conversation:', error);
    }
  };

  const handleRelease = async () => {
    if (!activeConv) return;
    try {
      await fetch(`${process.env.REACT_APP_API_URL}/api/intervene/release`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId: activeConv.id || activeConv._id }),
      });
      // Optimistic update
      updateConversation(activeConv.id || activeConv._id, { status: 'active' });
    } catch (error) {
      console.error('Failed to release control:', error);
    }
  };

  useEffect(() => {
    if (conversations && conversations.length > 0) {
      if (id) {
        const found = conversations.find(c => c.id === id || c._id === id);
        setActiveConv(found || conversations[0]);
      } else {
        setActiveConv(conversations[0]);
      }
    }
  }, [conversations, id]);

  const handleIntervene = () => {
    if (activeConv) {
      interveneInConversation(activeConv.id || activeConv._id);
    }
  };

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

  if (!activeConv) {
    return (
      <Flex justify="center" align="center" h="50vh">
        <Text>No conversations found or loading...</Text>
      </Flex>
    );
  }

  return (
    <Flex gap={4} h="calc(100vh - 120px)">
      {/* Column 1: Customer Conversations List */}
      <Box flex="1" bg="white" borderRadius="xl" boxShadow="sm" p={4} overflowY="auto">
        <Text fontSize="lg" fontWeight="bold" mb={4} color="#2D2D2D">
          Customer Conversations
        </Text>
        <VStack spacing={3} align="stretch">
          {conversations && conversations.map((conv) => (
            <Box
              key={conv.id}
              p={3}
              borderRadius="lg"
              cursor="pointer"
              bg={activeConv.id === conv.id ? '#F4F3F8' : 'transparent'}
              _hover={{ bg: '#F4F3F8' }}
              onClick={() => navigate(`/conversation/${conv.id}`)}
            >
              <HStack spacing={3}>
                <Avatar size="sm" name={conv.customer?.name || 'Customer'} />
                <VStack align="start" spacing={0} flex="1">
                  <Text fontWeight="bold" fontSize="sm" color="#2D2D2D">
                    {conv.customer?.name || 'Customer'}
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    #{conv.id?.substring(0, 5) || '12345'}
                  </Text>
                  <HStack spacing={1} mt={1}>
                    <Badge
                      bg={getStatusBg(conv.status)}
                      color={getStatusColor(conv.status)}
                      px={2}
                      py={0.5}
                      borderRadius="full"
                      fontSize="xs"
                      textTransform="none"
                    >
                      {conv.status}
                    </Badge>
                    <HStack spacing={0.5} color="gray.500" fontSize="xs">
                      <Icon as={FiClock} boxSize={3} />
                      <Text>5m</Text>
                    </HStack>
                  </HStack>
                </VStack>
              </HStack>
            </Box>
          ))}
        </VStack>
      </Box>

      {/* Column 2: Chat Area */}
      <Box flex="2" bg="white" borderRadius="xl" boxShadow="sm" p={4} display="flex" flexDirection="column">
        {/* Chat Header */}
        <Flex justify="space-between" align="center" mb={4} pb={2} borderBottom="1px" borderColor="gray.100">
          <HStack spacing={3}>
            <Avatar size="md" name={activeConv.customer?.name || 'Customer'} />
            <VStack align="start" spacing={0}>
              <Text fontWeight="bold" fontSize="md" color="#2D2D2D">
                {activeConv.customer?.name || 'Customer'} - #{activeConv.id?.substring(0, 5) || '12345'}
              </Text>
              <HStack spacing={1}>
                <Badge
                  bg={getStatusBg(activeConv.status)}
                  color={getStatusColor(activeConv.status)}
                  px={2}
                  py={0.5}
                  borderRadius="full"
                  fontSize="xs"
                  textTransform="none"
                >
                  {activeConv.status}
                </Badge>
                <HStack spacing={0.5} color="gray.500" fontSize="xs">
                  <Icon as={FiClock} boxSize={3} />
                  <Text>5m</Text>
                </HStack>
              </HStack>
            </VStack>
          </HStack>
          {activeConv && activeConv.status === 'escalated' ? (
            <Button 
              bg="#E8E6F2" 
              color="#3B3272" 
              borderRadius="full" 
              px={6}
              _hover={{ bg: '#D1CEDE' }}
              onClick={handleRelease}
            >
              Release Control
            </Button>
          ) : (
            <Button 
              bg="#3B3272" 
              color="white" 
              borderRadius="full" 
              px={6}
              _hover={{ bg: '#2C2554' }}
              onClick={handleIntervene}
            >
              Take Over
            </Button>
          )}
        </Flex>

        {/* Messages List */}
        <Box flex="1" overflowY="auto" mb={4} p={2} data-testid="message-list">
          <VStack spacing={4} align="stretch">
            {activeConv && activeConv.messages && activeConv.messages.map((msg, index) => (
              <Box key={index}>
                {msg.sender === 'customer' ? (
                  <HStack align="flex-start" spacing={2}>
                    <Avatar size="xs" name={activeConv.customer?.name} />
                    <Box bg="#F4F3F8" p={3} borderRadius="lg" maxW="70%">
                      <Text fontSize="sm" color="#2D2D2D">{msg.text}</Text>
                    </Box>
                  </HStack>
                ) : (
                  <HStack align="flex-start" spacing={2} justify="flex-start">
                    <Avatar size="xs" name="AI Agent" bg="#3B3272" color="white" />
                    <VStack align="start" spacing={1} maxW="70%">
                      <Box bg="white" border="1px" borderColor="gray.200" p={3} borderRadius="lg" width="100%">
                        <HStack justify="space-between" mb={1}>
                          <Badge bg="#E8E6F2" color="#3B3272" px={2} borderRadius="full" fontSize="xs">
                            + Chat
                          </Badge>
                          <Icon as={FiMoreVertical} color="gray.400" />
                        </HStack>
                        <Text fontSize="sm" color="#2D2D2D">{msg.text}</Text>
                      </Box>
                    </VStack>
                  </HStack>
                )}
              </Box>
            ))}
          </VStack>
        </Box>

        {/* Input Area */}
        <Box borderTop="1px" borderColor="gray.100" pt={4}>
          <HStack spacing={3}>
            <Input 
              placeholder="Respond" 
              bg="#F4F3F8" 
              border="none" 
              borderRadius="full"
              py={6}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <Select w="150px" borderRadius="full" bg="#F4F3F8" border="none">
              <option>Template</option>
            </Select>
            <Box bg="#F4F3F8" p={3} borderRadius="full" cursor="pointer" onClick={handleSendMessage}>
              <Icon as={FiSend} color="#3B3272" />
            </Box>
          </HStack>
        </Box>
      </Box>

      {/* Column 3: Customer Details */}
      <Box flex="1" bg="white" borderRadius="xl" boxShadow="sm" p={4} display="flex" flexDirection="column" justifyContent="space-between">
        <Box>
          <Text fontSize="lg" fontWeight="bold" mb={4} color="#2D2D2D">
            Customer Details
          </Text>
          
          {/* Customer Card */}
          <Box bg="#F4F3F8" p={4} borderRadius="xl" mb={4}>
            <HStack spacing={3} mb={3}>
              <Avatar size="lg" name={activeConv.customer?.name} />
              <VStack align="start" spacing={0}>
                <Text fontWeight="bold" fontSize="md" color="#2D2D2D">
                  {activeConv.customer?.name || 'Customer'}
                </Text>
                <Text fontSize="xs" color="gray.500">
                  #{activeConv.id?.substring(0, 5) || '12345'}
                </Text>
              </VStack>
            </HStack>
            <Text fontSize="xs" color="gray.600">
              1234 Elm Street, Suite 567, Springfield, IL 62704 ,United States
            </Text>
          </Box>

          {/* Conversation Metrics */}
          <Text fontSize="sm" color="gray.400" mb={2}>Conversation Metrics</Text>
          <HStack spacing={2} mb={2}>
            <Badge 
              bg={getStatusBg(activeConv.status)} 
              color={getStatusColor(activeConv.status)} 
              px={4} 
              py={1} 
              borderRadius="full"
              textTransform="none"
            >
              {activeConv.status}
            </Badge>
            <Badge bg="#F4F3F8" color="#555" px={4} py={1} borderRadius="full" textTransform="none">
              <HStack spacing={0.5}>
                <Icon as={FiClock} />
                <Text>5m</Text>
              </HStack>
            </Badge>
          </HStack>

          {/* Detailed Metrics */}
          <VStack align="stretch" spacing={1} mb={4} bg="#F4F3F8" p={2} borderRadius="md">
            <Flex justify="space-between">
              <Text fontSize="xs" color="gray.500">Sentiment</Text>
              <Text fontSize="xs" fontWeight="bold" color="#2D2D2D">{activeConv.metrics?.sentiment}</Text>
            </Flex>
            <Flex justify="space-between">
              <Text fontSize="xs" color="gray.500">Response Time</Text>
              <Text fontSize="xs" fontWeight="bold" color="#2D2D2D">{activeConv.metrics?.responseTime}s</Text>
            </Flex>
            <Flex justify="space-between">
              <Text fontSize="xs" color="gray.500">Confidence</Text>
              <Text fontSize="xs" fontWeight="bold" color="#2D2D2D">{activeConv.metrics?.confidenceScore}</Text>
            </Flex>
          </VStack>

          {/* Tags */}
          <Text fontSize="sm" color="gray.400" mb={2}>Tags</Text>
          <HStack spacing={2} mb={4}>
            {activeConv.tags && activeConv.tags.map(tag => (
              <Badge key={tag} bg="#E8E6F2" color="#3B3272" px={3} py={1} borderRadius="full" textTransform="none">#{tag}</Badge>
            ))}
            {(!activeConv.tags || activeConv.tags.length === 0) && (
              <Text fontSize="xs" color="gray.500">No tags</Text>
            )}
          </HStack>

          {/* Feedback Notes */}
          <Text fontSize="sm" color="gray.400" mb={2}>Feedback Notes</Text>
          <Textarea 
            placeholder="Write here..." 
            bg="#FFF9E5" // Yellow background from image
            border="none"
            borderRadius="lg"
            h="150px"
            resize="none"
            fontSize="sm"
          />
        </Box>

        <Button 
          bg="#3B3272" 
          color="white" 
          w="100%" 
          borderRadius="full"
          _hover={{ bg: '#2C2554' }}
          onClick={handleResolve}
        >
          Mark as Resolved
        </Button>
      </Box>
    </Flex>
  );
};

export default ConversationView;

