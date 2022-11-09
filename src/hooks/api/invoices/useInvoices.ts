import useSWR from 'swr'

import { EP_GET_INVOICES } from '../../../enums/api.enum'
import { getInvoices } from '../../../services/api/invoices'
import { InvoiceType } from '../../../types/invoice.type'
import { PaginationMetaType } from '../../../types/pagination-meta.type'
import { omitEmpty } from '../../../utils/obj'
import { stringifyURL } from '../../../utils/query'
import useFilters, { UseFilters } from '../../ui/useFilters'
import usePagination, { UsePagination } from '../../ui/usePagination'
import useInvoice, { UseInvoice } from './useInvoice'

export interface InvoicesFilters {
  search?: string
  status?: string
  invoice_from?: string | number
  invoice_to?: string | number
}

interface InvoicesQuery {
  page: number
  include: string
  filter: InvoicesFilters
  per_page: number
}

export interface UseInvoices {
  isLoading: boolean
  error: any
  invoices: InvoiceType[]
  meta: PaginationMetaType
}

function getKey(params: InvoicesQuery) {
  params.filter = omitEmpty(params.filter)
  return stringifyURL(EP_GET_INVOICES, params)
}

interface UseInvoicesConfig {
  initialFilters?: InvoicesFilters
  initialInclude?: string
  perPage?: number
}

export default function useInvoices(
  config: UseInvoicesConfig = {}
): UseInvoices & UseInvoice & UsePagination & UseFilters<InvoicesFilters> {
  const pagination = usePagination()
  const filters = useFilters<InvoicesFilters>()

  const params: InvoicesQuery = {
    page: pagination.page,
    include: config?.initialInclude || 'invoiceTo',
    filter: { ...(config?.initialFilters || {}), ...filters.filters },
    per_page: config.perPage || 10
  }

  const { data, error, mutate } = useSWR(() => getKey(params), getInvoices)

  const invoice = useInvoice({ mutate })

  const isLoading = !data && !error
  const invoices = data?.data || []
  const meta = data?.meta || {}
  return {
    isLoading,
    error,
    invoices,
    meta,
    ...invoice,
    ...pagination,
    ...filters
  }
}
