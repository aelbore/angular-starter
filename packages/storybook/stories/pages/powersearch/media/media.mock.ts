import { createUrl } from '@lithium/pages/powersearch/common'
import { MediaSearchResult } from '@lithium/pages/powersearch/types'
import { http, HttpResponse } from 'msw'

export const handlers = { 
  pages: [
    http.get(createUrl('Media'), async () => {
      const base64 = await fetch('/media-base-64')
      const text = await base64.text()
      return HttpResponse.json<MediaSearchResult>({
        totalCount: 1,
        results: [
          {
            id: 1251,  
            name: 'GCIB Launch Tutorial - Banker Dairy',       
            description: 'Tutorial to learn how to navigate Banker Dairy Historical and Expected Time submission',
            resourceType: 'Logo Library',
            imageContent: text
          },
          {
            id: 1252,  
            name: 'GCIB Launch Tutorial - Banker Dairy',       
            description: 'Tutorial to learn how to navigate Banker Dairy Historical and Expected Time submission',
            resourceType: 'Logo Library',
            imageContent: text
          }
        ]
      })
    })
  ]
}