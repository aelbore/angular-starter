import { createUrl } from '@lithium/pages/powersearch'
import { PagesSearchResult } from '@lithium/pages/powersearch/pages/types'
import { http, HttpResponse } from 'msw'

export const handlers = { 
  pages: [
    http.get(createUrl('Page'), () => {
      return HttpResponse.json<PagesSearchResult>({
        totalCount: 2,
        results: [
          {
            id: 2207,
            type: 'App Section',
            title: 'Deal Process',
            description: `Deal Process`
          },
          {
            id: 2344,
            type: 'Initiative',
            title: 'Sustainable Banking Solutions Group Initiative',
            description: `
              Sustainable Banking Solutions Group,
              Sustainable Banking Solutions Group,
              Sustainable Banking Solutions Group
              \u003Cem\u003EBank\u003C/em\u003E of America and for may of
              our clients
            `
          }
        ]
      })
    })
  ]
}