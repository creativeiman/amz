import { prisma } from '../client'
import { Prisma } from '@prisma/client'

// Get account's payment history
export async function getUserPayments(accountId: string) {
  return await prisma.payment.findMany({
    where: { accountId },
    orderBy: {
      createdAt: 'desc',
    },
  })
}

// Create payment record
export async function createPayment(data: Prisma.PaymentCreateInput) {
  return await prisma.payment.create({
    data,
  })
}

// Update payment status
export async function updatePaymentStatus(
  stripePaymentId: string,
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED'
) {
  return await prisma.payment.update({
    where: { stripePaymentId },
    data: { status },
  })
}

// Get payment by Stripe ID
export async function getPaymentByStripeId(stripePaymentId: string) {
  return await prisma.payment.findUnique({
    where: { stripePaymentId },
    include: {
      account: true,
    },
  })
}

