import { http, HttpResponse } from 'msw'

export const getProfileCards = () => {
  return http.get('/api/profile-cards', () => {
    return HttpResponse.json([
      {
        nbkId: 'zkzujo6',
        name: 'Arjay Elbore',
        image: 'https://2019.ng-my.org/assets/imgs/speakers/arjay-elbore.webp',
        title: 'Managing Director',
        role: 'Head Corporate Banking',
        email: 'arjay.elbore@bofa.com',
        contacts: { office: '121212121', mobile: '+6598142033' }
      }
    ])
  })
}