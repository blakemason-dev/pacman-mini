import http from 'http';
import express from 'express';
import cors from 'cors';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

const port = Number(process.env.PORT || 8888);
const app = express();

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.use(cors());
app.use(express.json());
app.use('/', express.static(path.join(__dirname, 'game-build')));

app.use('/', (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', "*");
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    next();
});


app.get('/getKey', (req, res, next) => {
    res.json({ accessKey: "password" });
});

app.use('/play/:accessKey', (req, res, next) => {
    if (req.params.accessKey === 'password') {
        res.render('ejs-index', {
            accessKey: req.params.accessKey
        });
    }
});

const server = http.createServer(app);

server.listen(port);

console.log(`Listening on port:${port}`);