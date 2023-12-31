const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');
const PORT = 5000;
const { MONGO_URI } = require('./keys');

const corsOptions = {
	origin: '*',
	credentials: true,
	optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

require('./models/user');
require('./models/post');

mongoose.connect(MONGO_URI);

app.use(express.json());

app.use(require('./routes/auth'));
app.use(require('./routes/post'));
app.use(require('./routes/user'));

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT} ....`);
});
