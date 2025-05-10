// src/components/ImportTokens.jsx
import { useState } from 'react';
import { Collapsible, Heading, Field, Input, Button, Flex } from "@chakra-ui/react"

export default function ImportTokens({ token, onComplete }) {
  const [file, setFile]     = useState(null);
  const [message, setMessage] = useState('');

  const handleFile = (e) => {
    setFile(e.target.files[0]);
    setMessage('');
  };

  const handleUpload = async () => {
    if (!file) return setMessage('Select a JSON file first');
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      const res  = await fetch(`${import.meta.env.VITE_API_URL}/api/tokens/import`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });
      const result = await res.json();
      setMessage(`Created: ${result.created}, Updated: ${result.updated}, Errors: ${result.errors.length}`);
      onComplete();  // refresh token list
    } catch (err) {
      setMessage('Import failed: ' + err.message);
    }
  };

  return (
    <Collapsible.Root>
      <Collapsible.Trigger>
      <Heading size="md" letterSpacing="tight">
        Bulk Import Tokens
      </Heading>
      </Collapsible.Trigger>
      <Collapsible.Content p="4">
        <Flex gap="2" justify="center" direction="column">
          <Field.Root required>
            <Field.Label>
              Select a JSON file <Field.RequiredIndicator />
            </Field.Label>
            <Input 
              type="file"
              accept=".json"
              variant="subtle" 
              onChange={handleFile} />
          </Field.Root>
          <Button
            colorPalette="teal"
            variant="subtle"
            onClick={handleUpload}
            disabled={!file}
            className="ml-2 px-3 py-1 bg-green-500 text-white rounded"
          >
            Upload
          </Button>
          {message && <p className="mt-2 text-sm">{message}</p>}
        </Flex>
      </Collapsible.Content>
    </Collapsible.Root>
  );
}
