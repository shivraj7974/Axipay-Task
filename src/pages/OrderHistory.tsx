import React, { useState, useEffect, useRef } from 'react';
import {
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material';
import { io, Socket } from 'socket.io-client';

interface Transaction {
  orderId: string;
  cardHolderName: string;
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cardCVC: string;
  amount: number;
  currency: string;
  status: 'Pending' | 'Success' | 'Failed';
  timestamp: string;
}

const OrderHistory: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io('http://localhost:5000');

    // Fetch initial transactions
    const fetchTransactions = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/transactions');
        const data = await response.json();
        setTransactions(data);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };

    fetchTransactions();

    // Listen for real-time updates
    socketRef.current.on('transactionUpdate', (transaction: Transaction) => {
      setTransactions(prev => {
        const index = prev.findIndex(t => t.orderId === transaction.orderId);
        if (index === -1) {
          return [...prev, transaction];
        }
        const newTransactions = [...prev];
        newTransactions[index] = transaction;
        return newTransactions;
      });
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Success':
        return 'success';
      case 'Failed':
        return 'error';
      default:
        return 'warning';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Order Summary History
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order ID</TableCell>
                <TableCell>Cardholder Name</TableCell>
                <TableCell>Card Number</TableCell>
                <TableCell>Expiry Date</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Currency</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Timestamp</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.orderId}>
                  <TableCell>{transaction.orderId}</TableCell>
                  <TableCell>{transaction.cardHolderName}</TableCell>
                  <TableCell>{transaction.cardNumber}</TableCell>
                  <TableCell>{`${transaction.expiryMonth}/${transaction.expiryYear}`}</TableCell>
                  <TableCell>{transaction.amount}</TableCell>
                  <TableCell>{transaction.currency}</TableCell>
                  <TableCell>
                    <Chip
                      label={transaction.status}
                      color={getStatusColor(transaction.status)}
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(transaction.timestamp).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};

export default OrderHistory; 