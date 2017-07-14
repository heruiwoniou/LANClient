import EventEmitter from 'events'
import dgram from 'dgram'
import * as native from './native'
const multicastAddr = '238.255.255.255'
const PORT = 41234
export default class UPD extends EventEmitter {
  constructor (port = PORT) {
    super()
    this.port = port
    this.server = dgram.createSocket('udp4')
    this.server.on('error', (err) => this.emit('error', err))
    this.server.on('message', (msg, rinfo) => this.emit('message', JSON.parse(msg), rinfo))
    this.server.on('listening', () => {
      this.server.addMembership(multicastAddr)
      this.server.setMulticastTTL(128)
    })
    this.server.bind(port, native.ip)
  }
  send (msg) {
    msg = new Buffer(JSON.stringify(msg))
    this.server.send(msg, 0, msg.length, this.port, multicastAddr)
  }
}
