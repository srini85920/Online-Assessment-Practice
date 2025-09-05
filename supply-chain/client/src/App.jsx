import React, { useState } from 'react';
import { ethers } from 'ethers';
import { Container, Box, Typography, TextField, Button, Select, MenuItem } from '@mui/material';

const abi = [
  "function addProduct(uint256 id, string name)",
  "function transferOwnership(uint256 id, address newOwner)",
  "function updateStage(uint256 id, uint8 stage)",
  "function getProduct(uint256 id) view returns (tuple(uint256 id,string name,address owner,uint8 stage))"
];

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || '';

export default function App() {
  const [account, setAccount] = useState(null);
  const [productId, setProductId] = useState('');
  const [productName, setProductName] = useState('');
  const [newOwner, setNewOwner] = useState('');
  const [stage, setStage] = useState(0);
  const [fetchId, setFetchId] = useState('');
  const [fetched, setFetched] = useState(null);

  async function getContract() {
    if (!window.ethereum) throw new Error('MetaMask required');
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    return new ethers.Contract(CONTRACT_ADDRESS, abi, signer);
  }

  async function connect() {
    if (!window.ethereum) return;
    const [addr] = await window.ethereum.request({ method: 'eth_requestAccounts' });
    setAccount(addr);
  }

  async function handleAddProduct() {
    const contract = await getContract();
    const tx = await contract.addProduct(productId, productName);
    await tx.wait();
  }

  async function handleTransfer() {
    const contract = await getContract();
    const tx = await contract.transferOwnership(productId, newOwner);
    await tx.wait();
  }

  async function handleUpdateStage() {
    const contract = await getContract();
    const tx = await contract.updateStage(productId, stage);
    await tx.wait();
  }

  async function handleFetch() {
    const contract = await getContract();
    const product = await contract.getProduct(fetchId);
    setFetched(product);
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>Supply Chain DApp</Typography>
      <Button variant="contained" onClick={connect} sx={{ mb: 2 }}>
        {account ? `Connected: ${account.slice(0,6)}...` : 'Connect Wallet'}
      </Button>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6">Add Product</Typography>
        <TextField label="Product ID" value={productId} onChange={e => setProductId(e.target.value)} sx={{ mr:1 }} />
        <TextField label="Name" value={productName} onChange={e => setProductName(e.target.value)} sx={{ mr:1 }} />
        <Button variant="contained" onClick={handleAddProduct}>Add</Button>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6">Transfer Ownership</Typography>
        <TextField label="Product ID" value={productId} onChange={e => setProductId(e.target.value)} sx={{ mr:1 }} />
        <TextField label="New Owner" value={newOwner} onChange={e => setNewOwner(e.target.value)} sx={{ mr:1 }} />
        <Button variant="contained" onClick={handleTransfer}>Transfer</Button>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6">Update Stage</Typography>
        <TextField label="Product ID" value={productId} onChange={e => setProductId(e.target.value)} sx={{ mr:1 }} />
        <Select value={stage} onChange={e => setStage(e.target.value)} sx={{ mr:1, minWidth:120 }}>
          <MenuItem value={0}>Created</MenuItem>
          <MenuItem value={1}>InTransit</MenuItem>
          <MenuItem value={2}>Delivered</MenuItem>
        </Select>
        <Button variant="contained" onClick={handleUpdateStage}>Update</Button>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6">Fetch Product</Typography>
        <TextField label="Product ID" value={fetchId} onChange={e => setFetchId(e.target.value)} sx={{ mr:1 }} />
        <Button variant="contained" onClick={handleFetch}>Fetch</Button>
        {fetched && (
          <Box sx={{ mt:2 }}>
            <Typography>ID: {Number(fetched[0])}</Typography>
            <Typography>Name: {fetched[1]}</Typography>
            <Typography>Owner: {fetched[2]}</Typography>
            <Typography>Stage: {['Created','InTransit','Delivered'][Number(fetched[3])]}</Typography>
          </Box>
        )}
      </Box>
    </Container>
  );
}
