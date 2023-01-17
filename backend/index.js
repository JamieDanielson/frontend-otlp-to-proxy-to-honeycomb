import { config } from 'dotenv';
import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
const app = express();
const port = 3000;

app.use(
  cors({
    origin: ['http://localhost:5000', 'http://127.0.0.1:5000'],
    methods: ['GET', 'POST'],
    credentials: true,
  }),
);
// Allow parsing of json
app.use(express.json());

app.get('/', (req, res) => res.send('Hello World!'));

// our api relay route
app.post('/v1/traces', async (req, res) => {
  try {
    const otlpJsonExportedFromFrontend = await req.body;
    const otlpJsonToExportToHoneycomb = JSON.stringify(
      otlpJsonExportedFromFrontend,
    );

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-honeycomb-team': process.env.HONEYCOMB_API_KEY,
      },
      body: otlpJsonToExportToHoneycomb,
    };

    // sending on to Honeycomb
    const response = await fetch('https://api.honeycomb.io/v1/traces', options)
      .then((response) => console.log(response))
      .catch((err) => console.error(err));

    return res.json({
      success: true,
      response,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
