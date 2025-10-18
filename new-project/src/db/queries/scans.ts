import { prisma } from '../client'
import { Prisma } from '@prisma/client'

// Get scans by account
export async function getUserScans(accountId: string) {
  return await prisma.scan.findMany({
    where: { accountId },
    include: {
      issues: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
}

// Get scan by ID
export async function getScanById(id: string) {
  return await prisma.scan.findUnique({
    where: { id },
    include: {
      account: {
        select: {
          id: true,
          name: true,
        },
      },
      issues: true,
    },
  })
}

// Create scan
export async function createScan(data: Prisma.ScanCreateInput) {
  return await prisma.scan.create({
    data,
  })
}

// Update scan
export async function updateScan(id: string, data: Prisma.ScanUpdateInput) {
  return await prisma.scan.update({
    where: { id },
    data,
  })
}

// Get all scans (admin only)
export async function getAllScans() {
  return await prisma.scan.findMany({
    include: {
      account: {
        select: {
          id: true,
          name: true,
        },
      },
      issues: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
}

