import { useState, useEffect } from 'react'
import { Box, Flex, Button, Heading } from '@chakra-ui/react';
import { LuLogOut } from "react-icons/lu"
import LoginForm from './components/LoginForm';
import TokenManager from './components/TokenManager';
import './index.css'
import { ColorModeButton } from "./components/ui/color-mode"

function App() {
  const [jwt, setJwt] = useState(null);

  // On mount, read any existing token
  useEffect(() => {
    const existing = localStorage.getItem('jwt');
    if (existing) setJwt(existing);
  }, []);

  // Wrap setJwt so we also write to localStorage
  const handleLogin = (token) => {
    localStorage.setItem('jwt', token);
    setJwt(token);
  };

  // Optional: add a logout handler
  const handleLogout = () => {
    localStorage.removeItem('jwt');
    setJwt(null);
  };

  return (
    <Box minH="100vh" bg="gray.50" _dark={{ bg: 'gray.800' }}>
      {/* Header with title and theme toggle */}
      <Flex
        as="header"
        align="center"
        justify="space-between"
        px={6}
        py={4}
        boxShadow="sm"
      >
        <Heading size="md">Design Token Manager</Heading>

        <Flex gap={2}>
          <ColorModeButton />

          {jwt && 
            <Button 
              colorPalette="teal" 
              onClick={handleLogout}>
                <LuLogOut />
                Logout
                </Button>
          }
        </Flex>
      </Flex>

      {/* Main content */}
      <Box p={6}>
        {
          jwt ? (
            <TokenManager token={jwt} />
          ) : (
            <LoginForm onLogin={handleLogin} />
          )
        }
      </Box>
    </Box>  
  );
}

export default App
