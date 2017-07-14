import os from 'os'
let IPv4,
  interfaces = os.networkInterfaces()
for (let devName in interfaces) {
  let iface = interfaces[devName]
  if (devName.indexOf('VMware') > -1) continue
  for (let i = 0; i < iface.length; i++) {
    let alias = iface[i]
    if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
      IPv4 = alias.address
    }
  }
}

export const ip = IPv4
