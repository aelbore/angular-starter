import { createUrl } from '@lithium/pages/common'
import { BiosSearchResult } from '@lithium/pages/powersearch/people/types'
import { http, HttpHandler, HttpResponse } from 'msw'

export const handlers = {
  bios: [
    http.get(createUrl('Bios'), async () => {
      const base64 = await fetch('/avatar-base-64')
      const text = await base64.text()
      return HttpResponse.json<BiosSearchResult>({
        totalCount: 11,
        results: [
          {
            nbkId: 'zkzujo4',
            name: 'Arjay Elbore asdasd121  asdasdasd 1121212 asdasdas',
            image: text,
            title: 'Managing Director',
            role: 'Head Corporate Banking',
            email: 'arjay.elbore@bofa.com',
            contacts: { office: '121212121', mobile: '+6598142033' }
          },
          {
            nbkId: 'zkzujo6',
            name: 'Arjay Elbore',
            image: text,
            title: 'Managing Director',
            role: 'Head Corporate Banking',
            email: 'arjay.elbore@bofa.com',
            contacts: { office: '121212121', mobile: '+6598142033' }
          },
          {
            nbkId: 'zkzujo7',
            name: 'Arjay Elbore',
            image: text,
            title: 'Managing Director',
            email: 'arjay.elbore@bofa.com',
            contacts: { office: '121212121', mobile: '+6598142033' }
          },
          {
            nbkId: 'zkzujo9',
            name: 'Arjay Elbore',
            image: text,
            title: 'Managing Director',
            role: 'Vice Chairman of Asia Equity Capital Markets and Head of China Equity Capital Markets',
            email: 'arjay.elbore@bofa.com',
            contacts: { office: '121212121', mobile: '+6598142033' }
          },
          {
            nbkId: 'zkzujo8',
            name: 'Arjay Elbore',
            image: text,
            title: 'Managing Director',
            role: 'Vice Chairman of Asia Equity Capital Markets and Head of China Equity Capital Markets',
            email: 'arjay.elbore@bofa.com',
            contacts: { office: '121212121', mobile: '+6598142033' }
          },
          {
            nbkId: 'zkzuj10',
            name: 'Arjay Elbore',
            image: text,
            title: 'Managing Director',
            role: 'Vice Chairman of Asia Equity Capital Markets and Head of China Equity Capital Markets',
            email: 'arjay.elbore@bofa.com',
            contacts: { office: '121212121', mobile: '+6598142033' }
          },
          {
            nbkId: 'zkzuj11',
            name: 'Arjay Elbore',
            image: text,
            title: 'Managing Director',
            role: 'Vice Chairman of Asia Equity Capital Markets and Head of China Equity Capital Markets',
            email: 'arjay.elbore@bofa.com',
            contacts: { office: '121212121', mobile: '+6598142033' }
          },
          {
            nbkId: 'zkzuj12',
            name: 'Arjay Elbore',
            image: text,
            title: 'Managing Director',
            role: 'Vice Chairman of Asia Equity Capital Markets and Head of China Equity Capital Markets',
            email: 'arjay.elbore@bofa.com',
            contacts: { office: '121212121', mobile: '+6598142033' }
          },
          {
            nbkId: 'zkzuj13',
            name: 'Arjay Elbore',
            image: text,
            title: 'Managing Director',
            role: 'Vice Chairman of Asia Equity Capital Markets and Head of China Equity Capital Markets',
            email: 'arjay.elbore@bofa.com',
            contacts: { office: '121212121', mobile: '+6598142033' }
          },
          {
            nbkId: 'zkzuj14',
            name: 'Arjay Elbore',
            image: text,
            title: 'Managing Director',
            role: 'Vice Chairman of Asia Equity Capital Markets and Head of China Equity Capital Markets',
            email: 'arjay.elbore@bofa.com',
            contacts: { office: '121212121', mobile: '+6598142033' }
          },
          {
            nbkId: 'zkzuj15',
            name: 'Arjay Elbore',
            image: text,
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