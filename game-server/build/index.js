"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path = __importStar(require("path"));
const dotenv = __importStar(require("dotenv"));
const colyseus_1 = require("colyseus");
const monitor_1 = require("@colyseus/monitor");
const PacmanMini_1 = __importDefault(require("./src/rooms/PacmanMini"));
dotenv.config();
const port = Number(process.env.PORT || 8888);
const app = (0, express_1.default)();
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/', express_1.default.static(path.join(__dirname, 'game-build-js')));
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
const server = http_1.default.createServer(app);
const gameServer = new colyseus_1.Server({
    server
});
// register room handlers
gameServer.define('pacman-mini', PacmanMini_1.default);
// simulate lag
// gameServer.simulateLatency(200);
// register colyseus  monitor 
app.use('/colyseus', (0, monitor_1.monitor)());
// start listening
gameServer.listen(port);
// output port used
console.log(`Listening on port:${port}`);
