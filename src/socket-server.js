import EventEmitter from 'events'
import net from 'net'
import * as native from './native'

const PORT = 41235

export default class SocketServer extends EventEmitter {
  constructor () {
    super()
    this.sockets = []
    this.server = net.createServer()
    this.server.on('connection', () => this.connection())
    this.server.listen(PORT, native.ip)
  }

  connection (sock) {
    sock.on('data', function (data) {
      console.log('DATA ' + sock.remoteAddress + ': ' + data)
      // 回发该数据，客户端将收到来自服务端的数据
      sock.write('You said "' + data + '"')
    })

    sock.on('close', function (data) {
      console.log('CLOSED: ' +
        sock.remoteAddress + ' ' + sock.remotePort)
    })
  }

  close () {
    this.server.close()
  }
}
