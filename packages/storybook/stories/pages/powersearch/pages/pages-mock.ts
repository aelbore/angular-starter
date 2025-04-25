import { createUrl } from '@lithium/pages/powersearch/common'
import { PagesSearchResult } from '@lithium/pages/powersearch/pages/types'
import { http, HttpResponse } from 'msw'

export const handlers = { 
  pages: [
    http.get(createUrl('Page'), () => {
      return HttpResponse.json<PagesSearchResult>({
        totalCount: 3,
        results: [
          {
            id: 1251,
            type: 'LevFin',
            title: 'Best Efforts High Yield Bond -1',            
            description: `Consult with BSC onm changes to deal teams (including ongoing update of additions and removal) Ensure a cross-border transaction is staffed with local \u003Cem style=\"text-decoration: underline; font-weight: boldl;\"\u003Ebankers\u003C/em\u003E`,
            sourceType: 'Deal Process',
            linkType: 'dealprocess-1253-2363',
            sectionPath: "Pre-Execution123 \u003E Clear Conflicts"
          },
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