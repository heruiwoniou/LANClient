import UDP from './udp.js'
import SocketServer from 'socket-server'

export default class Client {
  constructor () {
    this.id = Math.round(Math.random())
    var i = 0
    this.udp = new UDP()
    this.udp.on('message', (msg, rinfo) => {
      if (msg.id === this.id) return
      console.log('server got: ' + msg.msg + ' from ' + rinfo.address + ':' + rinfo.port)
    })
    setInterval(() => this.udp.send({ id: this.id, msg: 'hello ' + (i++) }), 2000)
  }

  connectServer () {

  }

  createServer () {
    this.server = new SocketServer()
  }
}
