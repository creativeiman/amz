import { prisma } from '../client'
import { Prisma } from '@prisma/client'

// Get user's scans
export async function getUserScans(userId: string) {
  return await prisma.scan.findMany({
    where: { userId },
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
      user: {
        select: {
          id: true,
          name: true,
          email: true,
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
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      issues: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
}

