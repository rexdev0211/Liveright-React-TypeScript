import useSWR from 'swr'

import { EP_GET_INVOICES } from '../../../enums/api.enum'
import { getInvoices } from '../../../services/api/invoices'
import { InvoiceType } from '../../../types/invoice.type'
import { stringifyURL } from '../../../utils/query'
import { useAuth } from '../../auth.hook'

interface useTotalRecieved {
  totalRecieved: number
  currency: string
  invoiceCount: number
  mutate: any
}

export default function useTotalRecieved(): useTotalRecieved {
  const auth = useAuth()

  const filters = {
    filter: {
      status: 'paid',
      payment_method: 'credit_card',
      invoice_from: auth.id
    },
    per_page: 10000000
  }
  const url = stringifyURL(EP_GET_INVOICES, filters)
  const { data, mutate } = useSWR(url, getInvoices)

  console.log(data)

  const totalRecieved =
    data?.data.reduce((acc: number, d: InvoiceType) => {
      return acc + d.total
    }, 0) || 0
  const currency = data?.data[0]?.currency.code || ''
  const invoiceCount = data?.meta.total || 0

  return {
    totalRecieved,
    currency,
    invoiceCount,
    mutate
  }
}
