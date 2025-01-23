import { NextFunction, Request, Response } from "express";
import bodyParser from 'body-parser';
import OpenAI from 'openai';

const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const express = require('express'); // DOC: https://expressjs.com/en/4x/api.html
const path = require('node:path');
const app = express();
const helmet = require('helmet'); // DOC: https://helmetjs.github.io/
const logger = require('pino').pino(); // REPO: https://github.com/pinojs/pino
const multer = require('multer'); // DOC: https://www.npmjs.com/package/multer
const fs = require('node:fs');
const session = require('express-session'); // DOC: https://www.npmjs.com/package/express-session
const passport = require('./auth.js');

// Simplify OpenAI initialization
const openai = new OpenAI({
  apiKey: process.env.OPENAI 
});

const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: Function) => {
    cb(null, 'public/uploads/');
  },
  filename: (req: Request, file: Express.Multer.File, cb: Function) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    const filename = path.basename(file.originalname, extension);
    cb(null, filename + '-' + uniqueSuffix + extension);
  }
});

const upload = multer({ storage: storage});

const PORT = process.env.PORT || 8000;

const secJs = fs.readFileSync(path.join(__dirname, 'conf', process.env.GOOGLE_PATH));
const sec = JSON.parse(secJs);

app.use(helmet());
app.disable('x-powered-by');
app.enable('trust proxy');

app.use(express.static(path.join(__dirname, "/public") ) );
app.use(session({ secret: sec.web.client_secret, resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json()); // Add this line to parse JSON bodies
app.use(bodyParser.text()); // Add this line to parse text bodies

/** 
 * Unprotected Routes
 */

app.get('/', (req: Request, res: Response) => {
  res.sendFile( __dirname + '/public/index.html');
});

app.get('/toscheck', (req: Request, res: Response) => {
  res.sendFile( __dirname + '/public/toscheck.html');
});

// Update the route handler to properly handle async/await
app.post('/tosAPI/check', async (req: Request, res: Response) => {
  try {
    const result = await parseTOS(req.body.text);
    res.json({ analysis: result });
  } catch (error) {
    console.error('Error processing TOS:', error);
    res.status(500).json({ error: 'Failed to analyze TOS' });
  }
});
// TODO if one can send files or stream file information to not exceed limit request
app.post('/tosAPI/checkFile', upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const file = fs.readFileSync(req.file.path, 'utf8');
    const result = await parseTOS(file);
    res.json({ analysis: result });
  } catch (error) {
    console.error('Error processing TOS:', error);
    res.status(500).json({ error: 'Failed to analyze TOS' });
  }
 });
// Add file parsing in a new function or dynamically decide in this one
async function parseTOS(TOS: string) {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{
        role: 'system',
        content: 'Analyze this Terms of Service. Return a JSON with red_flags (int), weird_words (array), obfuscated_terms (array), summary (string), and risk_level (string: low|medium|high)'
      },
      {
        role: 'user',
        content: TOS
      }],
      temperature: 0.7
    });
    
    return completion.choices[0].message.content;
  } catch (error) {
    throw error;
  }
}

/**
 * Protected Routes, Error and 404 handling, and listening function
 */
app.get('/auth/google', passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }));
app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req: Request, res: Response) => {
  res.redirect('/share');
});

interface AuthenticatedRequest extends Request {
  isAuthenticated(): boolean;
}

function ensureAuthenticated(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    return next(); 
  }
  res.redirect('/login');
}

app.get('/login', (req: Request, res: Response) => { 
  res.sendFile( __dirname + '/public/login.html');
});

app.get('/share', ensureAuthenticated,(req: Request, res: Response) => {
  res.sendFile( __dirname + '/public/share.html');
});

app.post('/upload', upload.single('file'), (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).send('No files were uploaded.');
  }
  res.json({ message: 'File uploaded successfully', file: req.file });
});

app.get('/getFiles', ensureAuthenticated, (req: Request, res: Response) => {
  const uploadDir = path.join(__dirname, 'public', 'uploads');
  fs.readdir(uploadDir, (err: Error, files: Array<File>) => {
    if (err) {
      return res.status(500).send('Error on the server.');
    }
    res.json(files);
  });
});

app.get('/list', ensureAuthenticated, (req: Request, res: Response) => {
  res.sendFile( __dirname + '/public/list.html');
});

app.use((req: Request & { secure: boolean }, res: Response, next: NextFunction) => {
  if (req.secure) {
    next();
  } else {
    res.redirect('https://'+req.hostname+req.url);
    return;
  }
  res.status(400).send("Sorry can't find that! Stop looking so hard . . .");
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(err);
  res.status(500).send('Something broke! STOP! WHATEVER! YOUR! DOING! please . . . ;?');
});

app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));