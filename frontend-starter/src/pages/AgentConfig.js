// src/pages/AgentConfig.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Flex,
  Heading,
  Select,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Text,
  VStack,
  Checkbox,
  HStack,
  Input,
  Icon,
  useToast,
  SimpleGrid,
} from '@chakra-ui/react';
import { FiCheck } from 'react-icons/fi';
import { useAppData } from '../context/AppDataContext';
import { updateAgentConfig } from '../api';

const capabilitiesList = ['Decision Making', 'Autonomy', 'Learning', 'Perception'];

const AgentConfig = () => {
  const { agents } = useAppData();
  const toast = useToast();
  
  const [selectedAgentId, setSelectedAgentId] = useState('');
  const [topP, setTopP] = useState(0.7);
  const [speed, setSpeed] = useState(0.5);
  const [personality, setPersonality] = useState(0.5);
  const [stability, setStability] = useState(0.5);
  const [maxTokens, setMaxTokens] = useState(10);
  const [capabilities, setCapabilities] = useState(['Decision Making', 'Perception']);
  const [kbAccess, setKbAccess] = useState({
    permissions: false,
    internal: true,
    public: true,
  });
  const [escalationMinutes, setEscalationMinutes] = useState(10);

  // Load selected agent's config
  useEffect(() => {
    if (agents && agents.length > 0) {
      const agent = selectedAgentId 
        ? agents.find(a => a.id === selectedAgentId) 
        : agents[0];
        
      if (agent) {
        setSelectedAgentId(agent.id);
        if (agent.config) {
          setTopP(agent.config.topP || 0.7);
          setMaxTokens(agent.config.maxTokens || 10);
          setCapabilities(agent.config.capabilities || ['Decision Making', 'Perception']);
        }
      }
    }
  }, [agents, selectedAgentId]);

  const toggleCapability = (capability) => {
    setCapabilities((prev) =>
      prev.includes(capability)
        ? prev.filter((c) => c !== capability)
        : [...prev, capability]
    );
  };

  const handleReset = () => {
    setTopP(0.7);
    setSpeed(0.5);
    setPersonality(0.5);
    setStability(0.5);
    setMaxTokens(10);
    setCapabilities(['Decision Making', 'Perception']);
    setKbAccess({ permissions: false, internal: true, public: true });
    setEscalationMinutes(10);
    
    toast({
      title: 'Changes reset',
      status: 'info',
      duration: 2000,
      isClosable: true,
    });
  };

  const handleSave = async () => {
    try {
      const config = {
        parameters: {
          top_p: topP,
          max_tokens: maxTokens,
          temperature: personality,
        },
        capabilities: capabilitiesList.map(cap => ({
          id: cap.toLowerCase().replace(' ', '_'),
          name: cap,
          enabled: capabilities.includes(cap)
        })),
        knowledgeBases: [
          { id: 'permissions', name: 'Permissions', enabled: kbAccess.permissions },
          { id: 'internal', name: 'Internal Articles', enabled: kbAccess.internal },
          { id: 'public', name: 'Public Articles', enabled: kbAccess.public },
        ],
        escalationThresholds: {
          responseTime: escalationMinutes
        }
      };
      
      await updateAgentConfig(selectedAgentId, config);
      
      toast({
        title: 'Configuration saved',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Failed to save config:', error);
      toast({
        title: 'Failed to save configuration',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box bg="white" borderRadius="xl" boxShadow="sm" p={6}>
      {/* Header Area */}
      <Flex justify="space-between" align="center" mb={6}>
        <HStack spacing={4}>
          <Heading fontSize="xl" color="#2D2D2D">Configure your AI Agent</Heading>
          <Select 
            value={selectedAgentId} 
            onChange={(e) => setSelectedAgentId(e.target.value)}
            bg="#F4F3F8"
            border="none"
            borderRadius="full"
            w="200px"
            size="sm"
          >
            {agents && agents.map(agent => (
              <option key={agent.id} value={agent.id}>{agent.name}</option>
            ))}
          </Select>
        </HStack>
        <HStack spacing={3}>
          <Button bg="#F4F3F8" color="#555" borderRadius="full" px={6} size="sm" onClick={handleReset}>
            Reset Changes
          </Button>
          <Button bg="#3B3272" color="white" borderRadius="full" px={6} size="sm" _hover={{ bg: '#2C2554' }} onClick={handleSave}>
            Save Changes
          </Button>
        </HStack>
      </Flex>

      {/* Parameters Section */}
      <Box mb={6}>
        <Flex justify="space-between" align="center" mb={3}>
          <Text fontSize="sm" color="gray.400" fontWeight="bold">Parameters</Text>
          <HStack spacing={2}>
            <Text fontSize="sm" color="gray.400">Max Tokens</Text>
            <Input 
              value={maxTokens} 
              onChange={(e) => setMaxTokens(parseInt(e.target.value) || 0)}
              w="50px" 
              size="sm" 
              bg="white" 
              border="1px" 
              borderColor="gray.200" 
              borderRadius="md"
              textAlign="center"
            />
          </HStack>
        </Flex>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
          {/* Top-p */}
          <Box bg="white" border="1px" borderColor="gray.100" borderRadius="lg" p={4}>
            <Text fontSize="sm" fontWeight="bold" color="#2D2D2D" mb={2}>Top-p</Text>
            <Flex justify="space-between" fontSize="xs" color="gray.400" mb={1}>
              <Text>0</Text>
              <Text>1</Text>
            </Flex>
            <Slider value={topP} min={0} max={1} step={0.1} onChange={(val) => setTopP(val)}>
              <SliderTrack bg="gray.100">
                <SliderFilledTrack bg="#3B3272" />
              </SliderTrack>
              <SliderThumb boxSize={4} bg="#3B3272" />
            </Slider>
            <Flex justify="center" mt={1}>
              <Box bg="#3B3272" color="white" px={2} py={0.5} borderRadius="md" fontSize="xs">
                {topP}
              </Box>
            </Flex>
          </Box>

          {/* Speed */}
          <Box bg="white" border="1px" borderColor="gray.100" borderRadius="lg" p={4}>
            <Text fontSize="sm" fontWeight="bold" color="#2D2D2D" mb={2}>Speed</Text>
            <Flex justify="space-between" fontSize="xs" color="gray.400" mb={1}>
              <Text>Slow</Text>
              <Text>Fast</Text>
            </Flex>
            <Slider value={speed} min={0} max={1} step={0.1} onChange={(val) => setSpeed(val)}>
              <SliderTrack bg="gray.100">
                <SliderFilledTrack bg="#3B3272" />
              </SliderTrack>
              <SliderThumb boxSize={4} bg="#3B3272" />
            </Slider>
          </Box>

          {/* Personality */}
          <Box bg="white" border="1px" borderColor="gray.100" borderRadius="lg" p={4}>
            <Text fontSize="sm" fontWeight="bold" color="#2D2D2D" mb={2}>Personality</Text>
            <Flex justify="space-between" fontSize="xs" color="gray.400" mb={1}>
              <Text>Formal</Text>
              <Text>Informal</Text>
            </Flex>
            <Slider value={personality} min={0} max={1} step={0.1} onChange={(val) => setPersonality(val)}>
              <SliderTrack bg="gray.100">
                <SliderFilledTrack bg="#3B3272" />
              </SliderTrack>
              <SliderThumb boxSize={4} bg="#3B3272" />
            </Slider>
          </Box>

          {/* Stability */}
          <Box bg="white" border="1px" borderColor="gray.100" borderRadius="lg" p={4}>
            <Text fontSize="sm" fontWeight="bold" color="#2D2D2D" mb={2}>Stability</Text>
            <Flex justify="space-between" fontSize="xs" color="gray.400" mb={1}>
              <Text>Stable</Text>
              <Text>Variable</Text>
            </Flex>
            <Slider value={stability} min={0} max={1} step={0.1} onChange={(val) => setStability(val)}>
              <SliderTrack bg="gray.100">
                <SliderFilledTrack bg="#3B3272" />
              </SliderTrack>
              <SliderThumb boxSize={4} bg="#3B3272" />
            </Slider>
          </Box>
        </SimpleGrid>
      </Box>

      {/* Capabilities Section */}
      <Box mb={6}>
        <Text fontSize="sm" color="gray.400" fontWeight="bold" mb={3}>Capabilities</Text>
        <HStack spacing={3}>
          {capabilitiesList.map(cap => {
            const isActive = capabilities.includes(cap);
            return (
              <Button
                key={cap}
                onClick={() => toggleCapability(cap)}
                bg={isActive ? '#3B3272' : 'white'}
                color={isActive ? 'white' : 'gray.600'}
                border="1px"
                borderColor={isActive ? '#3B3272' : 'gray.200'}
                borderRadius="full"
                size="sm"
                px={4}
                _hover={{ bg: isActive ? '#2C2554' : '#F4F3F8' }}
                rightIcon={isActive ? <Icon as={FiCheck} /> : null}
              >
                {cap}
              </Button>
            );
          })}
        </HStack>
      </Box>

      {/* Knowledge Base Access */}
      <Box mb={6}>
        <Text fontSize="sm" color="gray.400" fontWeight="bold" mb={3}>Knowledge Base Access</Text>
        <VStack align="stretch" spacing={2}>
          <Flex justify="space-between" align="center">
            <Checkbox isChecked={kbAccess.permissions} onChange={(e) => setKbAccess({...kbAccess, permissions: e.target.checked})} colorScheme="purple">
              Permissions
            </Checkbox>
            <Text fontSize="xs" color="gray.400">Last Updated: 18d Ago</Text>
          </Flex>
          <Flex justify="space-between" align="center">
            <Checkbox isChecked={kbAccess.internal} onChange={(e) => setKbAccess({...kbAccess, internal: e.target.checked})} colorScheme="purple">
              Internal Articles
            </Checkbox>
            <Text fontSize="xs" color="gray.400">Last Updated: 2d Ago</Text>
          </Flex>
          <Flex justify="space-between" align="center">
            <Checkbox isChecked={kbAccess.public} onChange={(e) => setKbAccess({...kbAccess, public: e.target.checked})} colorScheme="purple">
              Public Articles
            </Checkbox>
            <Text fontSize="xs" color="gray.400">Last Updated: 7d Ago</Text>
          </Flex>
        </VStack>
      </Box>

      {/* Escalation Thresholds */}
      <Box>
        <Text fontSize="sm" color="gray.400" fontWeight="bold" mb={3}>Escalation Thresholds</Text>
        <HStack spacing={2} fontSize="sm">
          <Text color="#2D2D2D">Escalate automatically if Agent has not responded in</Text>
          <Input 
            value={escalationMinutes} 
            onChange={(e) => setEscalationMinutes(parseInt(e.target.value) || 0)}
            w="50px" 
            size="sm" 
            bg="white" 
            border="1px" 
            borderColor="gray.200" 
            borderRadius="md"
            textAlign="center"
          />
          <Text color="gray.400">minutes</Text>
        </HStack>
      </Box>
    </Box>
  );
};

export default AgentConfig;
