'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var EventEmitter = _interopDefault(require('events'));
var dgram = _interopDefault(require('dgram'));
var os = _interopDefault(require('os'));
var SocketServer = _interopDefault(require('socket-server'));

let IPv4;
let interfaces = os.networkInterfaces();
for (let devName in interfaces) {
  let iface = interfaces[devName];
  if (devName.indexOf('VMware') > -1) continue
  for (let i = 0; i < iface.length; i++) {
    let alias = iface[i];
    if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
      IPv4 = alias.address;
    }
  }
}

const ip = IPv4;

const multicastAddr = '238.255.255.255';
const PORT = 41234;
class UPD extends EventEmitter {
  constructor (port = PORT) {
    super();
    this.port = port;
    this.server = dgram.createSocket('udp4');
    this.server.on('error', (err) => this.emit('error', err));
    this.server.on('message', (msg, rinfo) => this.emit('message', JSON.parse(msg), rinfo));
    this.server.on('listening', () => {
      this.server.addMembership(multicastAddr);
      this.server.setMulticastTTL(128);
    });
    this.server.bind(port, ip);
  }
  send (msg) {
    msg = new Buffer(JSON.stringify(msg));
    this.server.send(msg, 0, msg.length, this.port, multicastAddr);
  }
}

class Client {
  constructor () {
    this.id = Math.round(Math.random());
    var i = 0;
    this.udp = new UPD();
    this.udp.on('message', (msg, rinfo) => {
      if (msg.id === this.id) return
      console.log('server got: ' + msg.msg + ' from ' + rinfo.address + ':' + rinfo.port);
    });
    setInterval(() => this.udp.send({ id: this.id, msg: 'hello ' + (i++) }), 2000);
  }

  connectServer () {

  }

  createServer () {
    this.server = new SocketServer();
  }
}

let instance = new Client();
