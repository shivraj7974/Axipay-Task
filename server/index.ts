import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import axios from 'axios';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// Store transactions in memory (in a real app, use a database)
const transactions: any[] = [];

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Process payment endpoint
app.post('/api/process-payment', async (req, res) => {
  try {
    const { cardHolderName, cardNumber, expiryMonth, expiryYear, cardCVC, amount, currency } = req.body;
    
    // Generate random order ID
    const orderId = Math.random().toString(36).substring(2, 15);
    
    // Create transaction record
    const transaction = {
      orderId,
      cardHolderName,
      cardNumber: cardNumber.replace(/\d(?=\d{4})/g, "*"),
      expiryMonth,
      expiryYear,
      cardCVC: "***",
      amount,
      currency,
      status: "Pending",
      timestamp: new Date().toISOString()
    };

    transactions.push(transaction);

    // Make payment API call
    const response = await axios.post('https://api.vancipay.com/pay', {
      orderId,
      cardHolderName,
      cardNumber,
      expiryMonth,
      expiryYear,
      cardCVC,
      amount,
      currency
    });

    // Update transaction status
    transaction.status = response.data.status || "Success";
    
    // Broadcast status update to all connected clients
    io.emit('transactionUpdate', transaction);

    res.json({
      success: true,
      redirectUrl: response.data.redirectUrl,
      status: transaction.status
    });
  } catch (error) {
    console.error('Payment processing error:', error);
    res.status(500).json({
      success: false,
      error: 'Payment processing failed'
    });
  }
});

// Get transactions endpoint
app.get('/api/transactions', (req, res) => {
  res.json(transactions);
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 