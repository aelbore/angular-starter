import 'dotenv/config'

import send from '@polka/send'

const toArrayBuffer = (base64) => {
  const binaryString = atob(base64)
  const bytes = new Uint8Array(binaryString.length)
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }
  return bytes.buffer
}

const getBufferAvatar = async () => {
  const base64 = process.env.STORYBOOK_AVATAR_BASE64
  if (base64) return toArrayBuffer(base64)

  const URL = 'https://2019.ng-my.org/assets/imgs/speakers/arjay-elbore.webp'
  const buffer = await fetch(URL).then(
    async (response) => response.arrayBuffer()
  )
  return buffer
}

const avatarHandler = async (req, res) => {
  const buffer = await getBufferAvatar()
  send(res, 200, Buffer.from(buffer, 'base64'), { 
    'Content-Type': 'image/jpeg'  
  })
}

const avatarBase64Handler = async (req, res) => {
  const buffer = await getBufferAvatar()
  const base64String = btoa(
    new Uint8Array(buffer)
      .reduce((data, byte) =>
        data + String.fromCharCode(byte) , '')
  )
  send(res, 200, base64String)
}

export default (router) => {
 router.get('/avatar', avatarHandler)
 router.get('/avatar-base-64', avatarBase64Handler)
}