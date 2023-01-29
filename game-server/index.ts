import http from 'http';
import express from 'express';
import cors from 'cors';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { Server } from 'colyseus';
import { monitor } from '@colyseus/monitor';
import PacmanMiniRoom from './src/rooms/PacmanMini';

dotenv.config();

const port = Number(process.env.PORT || 8888);
const app = express();

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.use(cors());
app.use(express.json());
app.use('/', express.static(path.join(__dirname, 'game-build-js')));

app.use('/', (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', "*");
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    next();
});

// route when host wants to try get an access key
app.get('/getKey', (req, res, next) => {
    res.json({ accessKey: "password" });
});

// route when host wants to play the game in an iframe (or new browser tab)
app.use('/play/:accessKey', (req, res, next) => {
    if (req.params.accessKey === 'password') {
        res.render('index', {
            accessKey: req.params.accessKey
        });
    }
});

// create the server
const server = http.createServer(app);
const gameServer = new Server({
    server
});

// register room handlers
gameServer.define('pacman-mini', PacmanMiniRoom);  

// simulate lag
gameServer.simulateLatency(200);

// register colyseus  monitor 
app.use('/colyseus', monitor());

// start listening
gameServer.listen(port);

// output port used
console.log(`Listening on port:${port}`);