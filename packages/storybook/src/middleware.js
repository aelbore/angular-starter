import send from '@polka/send'

const getBufferAvatar = async () => {
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