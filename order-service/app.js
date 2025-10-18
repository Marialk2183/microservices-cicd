const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Order Service is running');
});

app.listen(4000, () => console.log('Order Service running on port 4000'));
