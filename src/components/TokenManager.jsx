import { useState, useEffect } from 'react';
import ImportTokens from './ImportTokens';
import { 
  Box, Flex, Input, InputGroup, Kbd, Heading, Highlight, Grid, GridItem, Button, ButtonGroup 
} from "@chakra-ui/react"
import { LuSearch } from "react-icons/lu"
import {
  Avatar,
  Card,
  HStack,
  Stack,
  Strong,
  Text,
  Collapsible,
  Field,
  Select,
  Portal,
  createListCollection,
  Textarea
} from "@chakra-ui/react"
import { LuCheck, LuX } from "react-icons/lu"


export default function TokenManager({ token }) {
  const API_BASE = import.meta.env.VITE_API_URL;

  const [tokens, setTokens] = useState([]);
  const [form, setForm]     = useState({
    name: '', value: '', category: 'color', description: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');
  const [categories, setCategories] = useState([]);

  const fetchTokens = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/tokens`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setTokens(data.tokens || data);
    } catch (err) {
      console.error('Fetch tokens error:', err);
    }
  };

  const fetchCategories = async () => {
    try{
      const res = await fetch(`${API_BASE}/api/categories`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setCategories(data.categories || data);
    } catch (err) {
      console.error('Fetch categories error:', err);
    }
  };

  useEffect(() => {
    fetchTokens();
  }, []);

  useEffect(() => {
    fetchCategories();
  }, []);

  // Create or update token
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const url = editingId
        ? `${API_BASE}/api/tokens/${editingId}`
        : `${API_BASE}/api/tokens`;
      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error(`Error ${method}: ${res.status}`);
      setMessage(editingId ? 'Token updated!' : 'Token added!');
      setEditingId(null);
      setForm({ name: '', value: '', category: 'color', description: '' });
      fetchTokens();
    } catch (err) {
      console.error(err);
      setMessage('Operation failed. See console.');
    }
  };

  // Delete token
  const deleteToken = async (id) => {
    try {
      await fetch(`${API_BASE}/api/tokens/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Token deleted!');
      fetchTokens();
    } catch (err) {
      console.error('Delete error:', err);
      setMessage('Delete failed.');
    }
  };

  // Start editing
  const handleEdit = (t) => {
    setEditingId(t._id);
    setForm({
      name: t.name,
      value: t.value,
      category: t.category,
      description: t.description || ''
    });
    setMessage('');
  };

  // Cancel editing
  const handleCancel = () => {
    setEditingId(null);
    setForm({ name: '', value: '', category: 'color', description: '' });
    setMessage('');
  };
  

  return (
    <Grid
      h="200px"
      templateRows="repeat(2, 1fr)"
      templateColumns="repeat(5, 1fr)"
      gap={4}
    >
      <GridItem rowSpan={4} colSpan={1}>
        <Heading size="lg">
          <Highlight query="Tokens" styles={{ color: "teal.600" }}>
            Design Tokens
          </Highlight>
        </Heading>
        <div>FILTROS</div>
        <form onSubmit={handleSubmit} className="space-y-2">
        <Collapsible.Root>
          <Collapsible.Trigger paddingY="3">
            <Heading size="md" letterSpacing="tight">
              {editingId ? 'Edit Token' : 'Add New Token'}
            </Heading>
          </Collapsible.Trigger>
          <Collapsible.Content>
            {message && <Text color="teal.600">{message}</Text>}
            <Box padding="4" borderWidth="1px">
              <Field.Root required>
                <Field.Label>
                  Name <Field.RequiredIndicator />
                </Field.Label>
                <Input 
                  value={form.name} 
                  variant="subtle" 
                  onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </Field.Root>
              <Field.Root required>
                <Field.Label>
                  Value <Field.RequiredIndicator />
                </Field.Label>
                <Input 
                  value={form.value} 
                  variant="subtle" 
                  onChange={(e) => setForm({ ...form, value: e.target.value })} />
              </Field.Root>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                {categories.map((c, i) => (
                  <option value={c} key={i}>{c}</option>
                ))}
              </select>

              <Field.Root
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              >
                <Field.Label>
                  Description (optional) 
                </Field.Label>
                <Textarea variant="subtle" />
              </Field.Root>
            </Box>
            <Flex gap="2" justify="center">
              <Button
                colorPalette="teal" 
                variant="subtle"
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                {editingId ? 'Update Token' : 'Add Token'}
              </Button>
              {editingId && (
                <Button
                  colorPalette="red" 
                  variant="subtle"
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-300 rounded"
                >
                  Cancel
                </Button>
              )}
            </Flex>
          </Collapsible.Content>
        </Collapsible.Root>
        </form>
        <ImportTokens token={token} onComplete={fetchTokens} />
      </GridItem>
      <GridItem colSpan={4} >
        <Flex p="4" justify="flex-end">
          <Box w="20%">
            <InputGroup flex="1" startElement={<LuSearch />} endElement={<Kbd>⌘K</Kbd>}>
              <Input placeholder="Search.." variant="subtle"  />
            </InputGroup>
          </Box>
        </Flex>
      </GridItem>
      <GridItem colSpan={4}>
        <Grid templateColumns="repeat(3, 1fr)" gap="6">
          {tokens.map((t) => (
            <Card.Root key={t._id}>
              <Card.Body>
                <HStack mb="6" gap="3">
                  <Avatar.Root>
                    <Avatar.Image src="https://images.unsplash.com/photo-1511806754518-53bada35f930" />
                    <Avatar.Fallback name="Nate Foss" />
                  </Avatar.Root>
                  <Stack gap="0">
                    <Text fontWeight="semibold" textStyle="sm">
                      {t.name}
                    </Text>
                    <Text color="fg.muted" textStyle="sm">
                      {t.value}
                    </Text>
                  </Stack>
                </HStack>
                <Card.Description>
                  <Strong color="fg">{t.category}</Strong>
                  {t.description}
                </Card.Description>
              </Card.Body>
              <Card.Footer>
                <Button variant="subtle" colorPalette="blue" flex="1" onClick={() => handleEdit(t)}>
                  <LuX />
                  Edit
                </Button>
                <Button variant="subtle" colorPalette="red" flex="1" onClick={() => deleteToken(t._id)}>
                  <LuCheck />
                  Delete
                </Button>
              </Card.Footer>
            </Card.Root>
          ))}
        </Grid>
    </GridItem>
  </Grid>
  );
}
