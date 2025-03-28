📁 facebook-post-bot/
├── 📁 src/
│   ├── index.js
│   ├── webhook.js
│   ├── postScheduler.js
│   ├── utils.js
├── 📁 config/
│   ├── config.js
│   ├── .env (không đẩy lên GitHub)
├── .gitignore
├── README.md
├── package.json
├── package-lock.json

// config/config.js
module.exports = {
   PAGE_ID: process.env.PAGE_ID,
   ACCESS_TOKEN: process.env.ACCESS_TOKEN,
   VERIFY_TOKEN: process.env.VERIFY_TOKEN,
   API_VERSION: 'v13.0'
};

// src/index.js
const axios = require('axios');
const config = require('../config/config');

const postContent = async (message) => {
   try {
      const response = await axios.post(
         `https://graph.facebook.com/${config.API_VERSION}/${config.PAGE_ID}/feed`,
         { message, access_token: config.ACCESS_TOKEN }
      );
      console.log('Post successful:', response.data);
   } catch (error) {
      console.error('Error posting to Facebook:', error.response?.data || error.message);
   }
};

postContent("This is an automated post.");

// src/webhook.js
const express = require('express');
const bodyParser = require('body-parser');
const config = require('../config/config');

const app = express();
app.use(bodyParser.json());

app.get('/webhook', (req, res) => {
   if (req.query['hub.verify_token'] === config.VERIFY_TOKEN) {
      res.status(200).send(req.query['hub.challenge']);
   } else {
      res.sendStatus(403);
   }
});

app.listen(3000, () => console.log('Webhook server running on port 3000'));

// src/postScheduler.js
const cron = require('node-cron');
const { postContent } = require('./index');

cron.schedule('0 9 * * *', () => {  // Hàng ngày vào 9h sáng
   postContent('Good morning! Here is your daily post.');
});

// src/utils.js
const preparePostContent = (data) => `New update: ${data.title}`;
module.exports = { preparePostContent };

// .gitignore
node_modules/
.env
.DS_Store

// package.json
{
   "name": "facebook-post-bot",
   "version": "1.0.0",
   "description": "A bot to post automatically on Facebook",
   "main": "src/index.js",
   "scripts": {
      "start": "node src/index.js",
      "webhook": "node src/webhook.js",
      "scheduler": "node src/postScheduler.js"
   },
   "dependencies": {
      "axios": "^0.21.1",
      "express": "^4.17.1",
      "body-parser": "^1.19.0",
      "node-cron": "^2.0.3"
   }
}

// README.md
# Facebook Post Automation Bot
This bot automatically posts content to your Facebook page using Facebook Graph API.

## Installation
```bash
git clone https://github.com/your-username/repo-name.git
cd repo-name
npm install
```

## Configuration
Create a `.env` file in the `config/` directory and add:
```
PAGE_ID=your-page-id
ACCESS_TOKEN=your-access-token
VERIFY_TOKEN=your-verification-token
```

## Usage
Start posting:
```bash
npm start
```
Run webhook server:
```bash
npm run webhook
```
Run scheduler:
```bash
npm run scheduler
