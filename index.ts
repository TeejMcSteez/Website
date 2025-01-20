import { NextFunction, Request, Response } from "express";

const express = require('express'); // DOC: https://expressjs.com/en/4x/api.html
const path = require('path');
const app = express();
const helmet = require('helmet'); // DOC: https://helmetjs.github.io/
const logger = require('pino').pino(); // REPO: https://github.com/pinojs/pino
const multer = require('multer');

const upload = multer({ dest: 'uploads/' });

const PORT = process.env.PORT || 8000;

app.use(helmet());
app.disable('x-powered-by');
app.enable('trust proxy');

app.use(express.static(path.join(__dirname, "/public") ) );

app.get('/', (req: Request, res: Response) => {
  res.sendFile( __dirname + '/public/index.html');
});

app.get('/share', (req: Request, res: Response) => {
  res.sendFile( __dirname + '/public/share.html');
});

app.post('/upload', upload.single('file'), (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).send('No files were uploaded.');
  }
  res.json({ message: 'File uploaded successfully', file: req.file });
});

app.use((req: Request & { secure: boolean }, res: Response, next: NextFunction) => {
  if (req.secure) {
    next();
  } else {
    res.redirect('https://'+req.hostname+req.url);
  }
  res.status(400).send("Sorry can't find that! Stop looking so hard . . .");
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(err);
  res.status(500).send('Something broke! STOP! WHATEVER! YOUR! DOING! please . . . ;?');
});

app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));
