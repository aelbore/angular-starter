import { createUrl } from '@lithium/pages/powersearch'
import { BiosSearchResult } from '@lithium/pages/powersearch/people/types'
import { http, HttpHandler, HttpResponse } from 'msw'

export const handlers: HttpHandler[] = [
  http.get(createUrl('Bios'), () => {
    return HttpResponse.json<BiosSearchResult>({
      totalCount: 1,
      results: [
        {
          nbkId: 'zkzujo6',
          name: 'Arjay Elbore',
          image: 'https://2019.ng-my.org/assets/imgs/speakers/arjay-elbore.webp',
          title: 'Managing Director',
          role: 'Head Corporate Banking'
        },
        {
          nbkId: 'zkzujo7',
          name: 'Arjay Elbore',
          image: 'https://2019.ng-my.org/assets/imgs/speakers/arjay-elbore.webp',
          title: 'Managing Director'
        },
        {
          nbkId: 'zkzujo8',
          name: 'Arjay Elbore',
          image: 'https://2019.ng-my.org/assets/imgs/speakers/arjay-elbore.webp',
          title: 'Managing Director',
          role: 'Vice Chairman of Asia Equity Capital Markets and Head of China Equity Capital Markets'
        }
      ]
    }, 
    {
      status: 200
    })
  })
]