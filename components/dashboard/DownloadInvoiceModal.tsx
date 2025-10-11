'use client'

import { useState, useEffect } from 'react'
import { X, Download, Calendar, FileText, CheckCircle } from 'lucide-react'
import { toast } from 'react-hot-toast'

interface Invoice {
  id: string
  date: string
  amount: number
  status: string
  description: string
  invoiceUrl?: string
}

interface DownloadInvoiceModalProps {
  isOpen: boolean
  onClose: () => void
  currentPlan: string
}

export default function DownloadInvoiceModal({ isOpen, onClose, currentPlan }: DownloadInvoiceModalProps) {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [downloadingInvoice, setDownloadingInvoice] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      fetchInvoices()
    }
  }, [isOpen])

  const fetchInvoices = async () => {
    setIsLoading(true)
    try {
      // TODO: Fetch real invoices from Stripe
      // For now, create mock invoices based on plan
      const mockInvoices: Invoice[] = []
      
      if (currentPlan === 'deluxe') {
        // Generate monthly invoices for the past 6 months
        for (let i = 0; i < 6; i++) {
          const date = new Date()
          date.setMonth(date.getMonth() - i)
          mockInvoices.push({
            id: `inv-deluxe-${i + 1}`,
            date: date.toISOString(),
            amount: 15.00,
            status: 'paid',
            description: 'Deluxe Plan - Monthly Subscription',
            invoiceUrl: `https://stripe.com/invoices/inv-deluxe-${i + 1}`
          })
        }
      } else if (currentPlan === 'one-time') {
        // Single invoice for one-time payment
        const date = new Date()
        date.setMonth(date.getMonth() - 1) // Assume paid last month
        mockInvoices.push({
          id: 'inv-onetime-1',
          date: date.toISOString(),
          amount: 39.99,
          status: 'paid',
          description: 'One-Time Plan - Single Payment',
          invoiceUrl: 'https://stripe.com/invoices/inv-onetime-1'
        })
      }
      
      setInvoices(mockInvoices)
    } catch (error) {
      console.error('Error fetching invoices:', error)
      toast.error('Failed to load invoices')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownloadInvoice = async (invoice: Invoice) => {
    setDownloadingInvoice(invoice.id)
    try {
      // TODO: Implement real invoice download from Stripe
      // For now, simulate download
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Create a mock PDF download
      const link = document.createElement('a')
      link.href = `data:application/pdf;base64,${btoa('Mock PDF content for invoice ' + invoice.id)}`
      link.download = `invoice-${invoice.id}.pdf`
      link.click()
      
      toast.success('Invoice downloaded successfully')
    } catch (error) {
      toast.error('Failed to download invoice')
    } finally {
      setDownloadingInvoice(null)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatAmount = (amount: number) => {
    return `$${amount.toFixed(2)}`
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Download Invoices</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {currentPlan === 'free' ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Invoices Available</h3>
              <p className="text-gray-600 mb-6">
                You need to upgrade to a paid plan to generate invoices.
              </p>
              <button
                onClick={onClose}
                className="bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors"
              >
                Close
              </button>
            </div>
          ) : (
            <div>
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading invoices...</p>
                </div>
              ) : invoices.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Invoices Found</h3>
                  <p className="text-gray-600">No invoices available for download.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <div className="flex items-center mb-2">
                      <Calendar className="w-5 h-5 text-gray-600 mr-2" />
                      <h3 className="font-semibold text-gray-900">Available Invoices</h3>
                    </div>
                    <p className="text-sm text-gray-600">
                      Select an invoice to download. All invoices are in PDF format.
                    </p>
                  </div>

                  {invoices.map((invoice) => (
                    <div
                      key={invoice.id}
                      className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <h4 className="font-medium text-gray-900">{invoice.description}</h4>
                            <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              {invoice.status}
                            </span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="w-4 h-4 mr-1" />
                            {formatDate(invoice.date)}
                            <span className="mx-2">•</span>
                            <span className="font-medium text-gray-900">{formatAmount(invoice.amount)}</span>
                          </div>
                        </div>
                        
                        <button
                          onClick={() => handleDownloadInvoice(invoice)}
                          disabled={downloadingInvoice === invoice.id}
                          className="ml-4 bg-orange-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center"
                        >
                          {downloadingInvoice === invoice.id ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Downloading...
                            </>
                          ) : (
                            <>
                              <Download className="w-4 h-4 mr-2" />
                              Download PDF
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}



