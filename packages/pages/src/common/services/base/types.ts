import type { Signal } from '@angular/core'
import type { PaginatePipeArgs } from 'ngx-pagination'
import type { Observable } from 'rxjs/internal/Observable'

export type PaginateArgs = {
  id?: string
  maxSize?: number
}

export interface ResultTotalCount {
  totalCount?: number
}

export interface SectionResult extends ResultTotalCount {
  results?: unknown[]
}

export type PaginationArgs = PaginatePipeArgs & PaginateArgs

export type SectionParams = {
  PageSize?: number
  PageIndex?: number
}

export interface GetDataBase {
  result: Signal<SectionResult | undefined>
  params: Signal<SectionParams>
  totalCount: Signal<number>
  getData<TResult>(params: SectionParams): Observable<TResult>
  updateParams(value: SectionParams): void
}

export interface PaginationBaseService {
  paginateArgs: Signal<PaginationArgs>
  updatePaginateArgs(args: PaginationArgs): void
  updateCurrentPage(currentPage: number): void
  updatePageItems(itemsPerPage: number): void
}

export type WithLoaderOptions = {
  start?: () => void
  done?: () => void
}

export type HttpResultOptions<TParams, TResult> = {
  params?: Signal<TParams>
  data: (params: TParams) => Observable<TResult>
  initialValue?: () => TResult | Signal<TResult>
  loading?: WithLoaderOptions
}