const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3001;

const services = [
  { id: '1', name: 'User Service', url: 'http://user-service:3000/health' },
  { id: '2', name: 'Product Service', url: 'http://product-service:3000/health' },
  { id: '3', name: 'Order Service', url: 'http://order-service:3000/health' },
];

app.get('/api/services', async (req, res) => {
  try {
    const healthChecks = await Promise.all(
      services.map(async (service) => {
        try {
          const response = await axios.get(service.url, { timeout: 5000 });
          return {
            ...service,
            status: response.status === 200 ? 'healthy' : 'unhealthy',
            lastChecked: new Date().toISOString(),
          };
        } catch (error) {
          return {
            ...service,
            status: 'unhealthy',
            lastChecked: new Date().toISOString(),
          };
        }
      })
    );
    res.json(healthChecks);
  } catch (error) {
    console.error('Error checking services:', error);
    res.status(500).json({ error: 'Failed to check services' });
  }
});

app.listen(port, () => {
  console.log(`Health check service listening at http://localhost:${port}`);
});

