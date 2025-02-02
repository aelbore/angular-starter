import { createUrl } from '@lithium/pages/powersearch'
import { BiosSearchResult } from '@lithium/pages/powersearch/people/types'
import { http, HttpHandler, HttpResponse } from 'msw'

export const handlers = {
  bios: [
    http.get(createUrl('Bios'), async () => {
      return HttpResponse.json<BiosSearchResult>({
        totalCount: 3,
        results: [
          {
            nbkId: 'zkzujo6',
            name: 'Arjay Elbore',
            image: '/avatar.jpg',
            title: 'Managing Director',
            role: 'Head Corporate Banking',
            email: 'arjay.elbore@bofa.com',
            contacts: { office: '121212121', mobile: '+6598142033' }
          },
          {
            nbkId: 'zkzujo7',
            name: 'Arjay Elbore',
            image: '/avatar.jpg',
            title: 'Managing Director',
            email: 'arjay.elbore@bofa.com',
            contacts: { office: '121212121', mobile: '+6598142033' }
          },
          {
            nbkId: 'zkzujo8',
            name: 'Arjay Elbore',
            image: '/avatar.jpg',
            title: 'Managing Director',
            role: 'Vice Chairman of Asia Equity Capital Markets and Head of China Equity Capital Markets',
            email: 'arjay.elbore@bofa.com',
            contacts: { office: '121212121', mobile: '+6598142033' }
          }
        ]
      }, 
      {
        status: 200
      })
    })
  ] as HttpHandler[]
}