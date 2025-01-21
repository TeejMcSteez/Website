import { NextFunction, Request, Response } from "express";

const express = require('express'); // DOC: https://expressjs.com/en/4x/api.html
const path = require('node:path');
const app = express();
const helmet = require('helmet'); // DOC: https://helmetjs.github.io/
const logger = require('pino').pino(); // REPO: https://github.com/pinojs/pino
const multer = require('multer');
const fs = require('node:fs');
const session = require('express-session');
const passport = require('./auth.js');

const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: Function) => {
    cb(null, 'public/uploads/');
  },
  filename: (req: Request, file: Express.Multer.File, cb: Function) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + extension);
  }
});

const upload = multer({ storage: storage});

const PORT = process.env.PORT || 8000;

const sshh = fs.readFileSync(path.join(__dirname, 'conf', 'client_secret_147879745742-bu54ss6r3kbofqlmgbrpa5flen39m3bt.apps.googleusercontent.com.json'));
const sec = JSON.parse(sshh);

app.use(helmet());
app.disable('x-powered-by');
app.enable('trust proxy');

app.use(express.static(path.join(__dirname, "/public") ) );
app.use(session({ secret: sec.web.client_secret, resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req: Request, res: Response) => {
  res.sendFile( __dirname + '/public/index.html');
});

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
