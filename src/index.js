const express = require('express');
const cors = require('cors');

const Routes = require('./routes');

const app = express();
const port = process.env.PORT || 8080;

require('dotenv').config();

app.use(express.json());
app.use(cors());

app.use('/api', Routes);

app.listen(port, () => {
  console.log(`Now listening at port ${port} for requests!`);
});
