const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 8000;

app.use(express.static(path.join(__dirname, "/public")));

app.get('/', (req, res) => {
  res.sendFile( __dirname + '/public/index.html');
});



app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));
/**
 * Docs: 
 * // To start tailwind run npx tailwindcss initailwindcss -i ./public/stylesheet.css -o ./public/tailwind.css --watch
 */