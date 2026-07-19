const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { ChatGroq } = require('@langchain/groq');
const { ChatPromptTemplate, MessagesPlaceholder } = require('@langchain/core/prompts');
const { HumanMessage, AIMessage } = require('@langchain/core/messages');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Initialize LLM using Groq
const model = new ChatGroq({
  apiKey: process.env.OPENAI_API_KEY,
  model: 'llama-3.1-8b-instant',        // Updated to a currently supported, fast, and free model
  temperature: 0.7,
});

// Simple in-memory storage for chat history
const memories = {};

app.post('/api/chat', async (req, res) => {
  const { message, sessionId } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  const sid = sessionId || 'default';

  try {
    if (!memories[sid]) {
      memories[sid] = [];
    }

    const history = memories[sid];

    const prompt = ChatPromptTemplate.fromMessages([
      ['system', 'You are a helpful and friendly AI assistant.'],
      new MessagesPlaceholder('chat_history'),
      ['user', '{input}'],
    ]);

    const chain = prompt.pipe(model);

    const response = await chain.invoke({
      input: message,
      chat_history: history,
    });

    memories[sid].push(new HumanMessage(message));
    memories[sid].push(new AIMessage(response.content));

    res.json({ response: response.content });
  } catch (error) {
    console.error('Error in /api/chat:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
