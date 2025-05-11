import { useState, useEffect } from 'react';
import ImportTokens from './ImportTokens';
import { 
  Box, 
  Flex, 
  Input, 
  InputGroup, 
  Kbd, 
  Heading, 
  Grid, 
  GridItem, 
  Button,
  Text,
  Field,
  Textarea,
  Table,
  Tag,
  List,
  Dialog,
  Pagination,
  ButtonGroup,
  IconButton
} from "@chakra-ui/react"
import { LuSearch, LuPencilLine, LuTrash2, LuFilter, LuChevronLeft, LuChevronRight } from "react-icons/lu"

import { Drawer, Portal, createOverlay } from "@chakra-ui/react"


export default function TokenManager({ token }) {
  const API_BASE = import.meta.env.VITE_API_URL;

  const [tokens, setTokens] = useState([]);
  const [form, setForm]     = useState({
    name: '', value: '', category: 'color', description: ''
  });
  const [setEditingId] = useState(null);
  const [message, setMessage] = useState('');
  const [categories, setCategories] = useState([]);
  const [setEditingToken] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const tokensPerPage = 10; // Number of tokens to show per page

  const fetchTokens = async () => {
    try {
      // First get the total count
      const countRes = await fetch(`${API_BASE}/api/tokens?limit=1`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const countData = await countRes.json();
      const totalTokens = countData.total;

      // Then fetch all tokens
      const res = await fetch(`${API_BASE}/api/tokens?limit=${totalTokens}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      console.log('Fetched tokens:', data);
      setTokens(data.tokens);
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
  

  const TokenForm = ({ token, onSubmit, onCancel }) => {
    const [localForm, setLocalForm] = useState({
      name: '', value: '', category: 'color', description: ''
    });
    const [localEditingId, setLocalEditingId] = useState(null);

    useEffect(() => {
      if (token) {
        setLocalEditingId(token._id);
        setLocalForm({
          name: token.name,
          value: token.value,
          category: token.category,
          description: token.description || ''
        });
      } else {
        setLocalEditingId(null);
        setLocalForm({ name: '', value: '', category: 'color', description: '' });
      }
    }, [token]);

    const handleSubmit = (e) => {
      e.preventDefault();
      onSubmit(e, localForm, localEditingId);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-2">
        {message && <Text color="teal.600">{message}</Text>}
        <Box padding="4" borderWidth="1px">
          <Field.Root required>
            <Field.Label>
              Name <Field.RequiredIndicator />
            </Field.Label>
            <Input 
              value={localForm.name} 
              variant="subtle" 
              onChange={(e) => setLocalForm({ ...localForm, name: e.target.value })} />
          </Field.Root>
          <Field.Root required>
            <Field.Label>
              Value <Field.RequiredIndicator />
            </Field.Label>
            <Input 
              value={localForm.value} 
              variant="subtle" 
              onChange={(e) => setLocalForm({ ...localForm, value: e.target.value })} />
          </Field.Root>
          <select
            value={localForm.category}
            onChange={(e) => setLocalForm({ ...localForm, category: e.target.value })}
          >
            {categories.map((c, i) => (
              <option value={c} key={i}>{c}</option>
            ))}
          </select>

          <Field.Root
            value={localForm.description}
            onChange={(e) => setLocalForm({ ...localForm, description: e.target.value })}
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
            {localEditingId ? 'Update Token' : 'Add Token'}
          </Button>
          {localEditingId && (
            <Button
              colorPalette="red" 
              variant="subtle"
              onClick={onCancel}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              Cancel
            </Button>
          )}
        </Flex>
      </form>
    );
  };

  const drawer = createOverlay((props) => {
    const { title, content, ...rest } = props;
    return (
      <Drawer.Root {...rest}>
        <Portal>
          <Drawer.Backdrop />
          <Drawer.Positioner>
            <Drawer.Content>
              <Drawer.Header>
                <Drawer.Title>{title === 'edit' ? 'Edit Token' : 'Add New Token'}</Drawer.Title>
              </Drawer.Header>
              <Drawer.Body spaceY="4">
                <TokenForm 
                  token={content} 
                  onSubmit={(e, formData, editingId) => {
                    handleSubmit(e, formData, editingId);
                  }}
                  onCancel={handleCancel}
                />
                <ImportTokens token={token} onComplete={fetchTokens} />
              </Drawer.Body>
            </Drawer.Content>
          </Drawer.Positioner>
        </Portal>
      </Drawer.Root>
    );
  });

  // Cancel editing
  const handleCancel = () => {
    setEditingId(null);
    setEditingToken(null);
    setForm({ name: '', value: '', category: 'color', description: '' });
    setMessage('');
    drawer.close('a');
  };

  const handleSubmit = async (e, formData = form, editingId = editingId) => {
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
        body: JSON.stringify(formData)
      });
      if (!res.ok) throw new Error(`Error ${method}: ${res.status}`);
      setMessage(editingId ? 'Token updated!' : 'Token added!');
      setEditingId(null);
      setEditingToken(null);
      setForm({ name: '', value: '', category: 'color', description: '' });
      fetchTokens();
      drawer.close('a');
    } catch (err) {
      console.error(err);
      setMessage('Operation failed. See console.');
    }
  };

  const confirmDialog = createOverlay((props) => {
    const { title, content, onConfirm, ...rest } = props;
    return (
      <Dialog.Root {...rest}>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Confirm Deletion</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <Text>Are you sure you want to delete this token?</Text>
                <Text fontWeight="bold">{content?.name}</Text>
              </Dialog.Body>
              <Dialog.Footer>
                <Flex gap="2" justify="end">
                  <Button
                    variant="ghost"
                    onClick={() => confirmDialog.close('a')}
                  >
                    Cancel
                  </Button>
                  <Button
                    colorPalette="red"
                    onClick={() => {
                      onConfirm();
                      confirmDialog.close('a');
                    }}
                  >
                    Delete
                  </Button>
                </Flex>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    );
  });

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

  const getCategoryColor = (category) => {
    switch (category) {
      case 'color': return 'teal';
      case 'font': return 'blue';
      case 'border': return 'red';
      case 'shadow': return 'purple';
      case 'spacing': return 'green';
      case 'radius': return 'yellow';
      case 'opacity': return 'orange';
      default: return 'gray';
    }
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTokens = tokens.filter(t => {
    const matchesCategories = selectedCategories.length === 0 || selectedCategories.includes(t.category);
    const matchesSearch = !searchQuery || t.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategories && matchesSearch;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredTokens.length / tokensPerPage);
  const startIndex = (currentPage - 1) * tokensPerPage;
  const endIndex = startIndex + tokensPerPage;
  const currentTokens = filteredTokens.slice(startIndex, endIndex);

  console.log('Total tokens:', tokens.length); // Debug log
  console.log('Filtered tokens:', filteredTokens.length); // Debug log
  console.log('Current page tokens:', currentTokens.length); // Debug log
  console.log('Total pages:', totalPages); // Debug log

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategories, searchQuery]);

  const handleCategoryChange = (category) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(c => c !== category);
      }
      return [...prev, category];
    });
  };

  const handleRemoveCategory = (categoryToRemove) => {
    setSelectedCategories(prev => prev.filter(category => category !== categoryToRemove));
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSelectedCategories([]);
  };

  return (
    <Box p={4}>
      <Grid
        templateRows="auto auto 1fr"
        templateColumns="repeat(5, 1fr)"
        gap={4}
        h="full"
      >
        <GridItem rowSpan={3} colSpan={1}>
          <Heading size="md" textAlign="left">Filters</Heading>
          <List.Root gap="2" variant="plain" align="center" marginTop={4}>
            {categories.map((c, i) => (
              <List.Item key={i}>
                <Button 
                  variant="ghost" 
                  onClick={() => handleCategoryChange(c)}
                  colorPalette={selectedCategories.includes(c) ? getCategoryColor(c) : undefined}
                >
                  {capitalizeFirstLetter(c)}
                </Button>
              </List.Item>
            ))}
            <List.Item>
              <Button 
                variant="ghost" 
                onClick={handleClearSearch}
              >
                Clear Filters
              </Button>
            </List.Item>
          </List.Root>
        </GridItem>
        <GridItem colSpan={4}>
          <Flex justify="flex-end" gap={4}>
            <Box w="20%">
              <InputGroup flex="1" startElement={<LuSearch />} endElement={<Kbd>⌘K</Kbd>}>
                <Input 
                  placeholder="Search.." 
                  variant="subtle" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </InputGroup>
            </Box>
            <>
              <Button
                onClick={() => {
                  drawer.open("a", {
                    placement: "end",
                  })
                }}
              >
                Token Options
              </Button>
              <drawer.Viewport />
            </>
          </Flex>
        </GridItem>
        <GridItem colSpan={4}>
          <Flex justify="flex-start" gap={4} paddingBottom={4} align="center">
            {selectedCategories.map((category) => (
              <Tag.Root key={category} size="sm" colorPalette={getCategoryColor(category)}>
                <Tag.Label>{category}</Tag.Label>
                <Tag.EndElement>
                  <Tag.CloseTrigger onClick={() => handleRemoveCategory(category)} />
                </Tag.EndElement>
              </Tag.Root>
            ))}
            <Text color="fg.muted" fontSize="sm" marginLeft="auto">
              Showing {startIndex + 1}-{Math.min(endIndex, filteredTokens.length)} of {filteredTokens.length} tokens
            </Text>
          </Flex>
          <Box overflowY="auto" maxH="calc(100vh - 300px)">
            <Table.Root size="sm" striped>
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeader>Name</Table.ColumnHeader>
                  <Table.ColumnHeader>Value</Table.ColumnHeader>
                  <Table.ColumnHeader>Category</Table.ColumnHeader>
                  <Table.ColumnHeader>Description</Table.ColumnHeader>
                  <Table.ColumnHeader textAlign="end">Actions</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {currentTokens.map((t) => (
                  <Table.Row key={t._id}>
                    <Table.Cell>{t.name}</Table.Cell>
                    <Table.Cell>{t.value}</Table.Cell>
                    <Table.Cell>
                      <Tag.Root size="sm" colorPalette={getCategoryColor(t.category)}>
                        <Tag.Label>{t.category}</Tag.Label>
                      </Tag.Root>
                    </Table.Cell>
                    <Table.Cell>{t.description}</Table.Cell>
                    <Table.Cell textAlign="end">
                      <Button variant="ghost" onClick={() => {
                        drawer.open("a", {
                          placement: "end",
                          title: "edit",
                          content: t
                        });
                      }}>
                        <LuPencilLine />
                      </Button>
                      <Button variant="ghost" onClick={() => {
                        confirmDialog.open("a", {
                          content: t,
                          onConfirm: () => deleteToken(t._id)
                        });
                      }}>
                        <LuTrash2 />
                      </Button>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Box>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <Flex justify="center" marginTop={4}>
              <Pagination.Root
                count={totalPages}
                pageSize={1}
                page={currentPage}
                onPageChange={(e) => setCurrentPage(e.page)}
              >
                <ButtonGroup variant="ghost" size="sm">
                  <Pagination.PrevTrigger asChild>
                    <IconButton>
                      <LuChevronLeft />
                    </IconButton>
                  </Pagination.PrevTrigger>

                  <Pagination.Items
                    render={(page) => (
                      <IconButton variant={{ base: "ghost", _selected: "outline" }}>
                        {page.value}
                      </IconButton>
                    )}
                  />

                  <Pagination.NextTrigger asChild>
                    <IconButton>
                      <LuChevronRight />
                    </IconButton>
                  </Pagination.NextTrigger>
                </ButtonGroup>
              </Pagination.Root>
            </Flex>
          )}
        </GridItem>
      </Grid>
      <confirmDialog.Viewport />
    </Box>
  );
}
