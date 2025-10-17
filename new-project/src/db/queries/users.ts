import { prisma } from '../client'
import { Prisma } from '@prisma/client'

// Get user by email
export async function getUserByEmail(email: string) {
  return await prisma.user.findUnique({
    where: { email },
    include: {
      accounts: true,
    },
  })
}

// Get user by ID
export async function getUserById(id: string) {
  return await prisma.user.findUnique({
    where: { id },
    include: {
      accounts: true,
      ownedTeamMembers: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
    },
  })
}

// Create user
export async function createUser(data: Prisma.UserCreateInput) {
  return await prisma.user.create({
    data,
  })
}

// Update user
export async function updateUser(id: string, data: Prisma.UserUpdateInput) {
  return await prisma.user.update({
    where: { id },
    data,
  })
}

// Get all users (admin only)
export async function getAllUsers() {
  return await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      plan: true,
      role: true,
      createdAt: true,
      _count: {
        select: {
          scans: true,
          payments: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
}

