const express = require('express');
const path = require('path');
const app = express();
const helmet = require('helmet');
const logger = require('pino');

const PORT = process.env.PORT || 8000;

app.use(helmet());
app.disable('x-powered-by');

app.use(express.static(path.join(__dirname, "/public")));

app.get('/', (req, res) => {
  res.sendFile( __dirname + '/public/index.html');
});

app.use((req, res, next) => {
  res.status(400).send("Sorry can't find that! Stop looking so hard . . .");
});

app.use((err, req, res, next) => {
  logger.error(err.stack());
  res.status(500).send('Something broke! STOP! WHATEVER! YOUR! DOING! please . . . ;?');
});

app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));
/**
 * Docs: 
 * // To start tailwind run npx tailwindcss initailwindcss -i ./public/stylesheet.css -o ./public/tailwind.css --watch
 */