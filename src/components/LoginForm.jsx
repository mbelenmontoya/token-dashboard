import { useState } from 'react';
import {
  Box,
  Stack,
  Button,
  Heading,
  Separator,
  Text,
  InputGroup,
  Field,
  Input,
} from "@chakra-ui/react";
import { LuUser, LuLock } from "react-icons/lu";

export default function LoginForm({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ username: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({ username: '', password: '' });
    if (!username || !password) {
      return setErrors({ 
        username: username ? '' : 'Username is required',
        password: password ? '' : 'Password is required'
      });
    }
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        const { message } = await res.json();
        return setErrors({ username: message, password: message });
      }
      const { token } = await res.json();
      onLogin(token);
    } catch (err) {
      setErrors({ username: err.message, password: err.message });
    }
  };

  return (
    <Box maxW="md" mx="auto" mt={12} p={6} borderRadius="md" 
    boxShadow="lg" bg="white" _dark={{ bg: 'gray.700' }}>
      <Heading mb={6} textAlign="center">
        Admin Login
      </Heading>

      <form onSubmit={handleSubmit}>
        <Stack spacing={4}>
          <Field.Root invalid={!!errors.username}>
            <Field.Label>Username</Field.Label>
            <InputGroup startElement={<LuUser />}>
              <Input
                placeholder="Enter your username"
                value={username}
                onChange={e => setUsername(e.target.value)}
              />
            </InputGroup>
            {errors.username && (
              <Field.ErrorText>{errors.username}</Field.ErrorText>
            )}
          </Field.Root>

          <Field.Root invalid={!!errors.password}>
            <Field.Label>Password</Field.Label>
            <InputGroup startElement={<LuLock />}>
              <Input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </InputGroup>
            {errors.password && (
              <Field.ErrorText>{errors.password}</Field.ErrorText>
            )}
          </Field.Root>

          <Separator my={6} />

          <Button type="submit" colorPalette="teal" variant="solid" width="full">
            Login
          </Button>

          <Stack direction="row" justify="center" align="center">
            <Text fontSize="sm">Don't have an account?</Text>
            <Button variant="ghost" colorPalette="teal">
              Create Account
            </Button>
          </Stack>
        </Stack>
      </form>
    </Box>
  );
}
