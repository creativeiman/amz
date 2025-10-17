import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/db/client'

// GET account information for the logged-in user (owner or member)
export async function GET() {
  try {
    const session = await auth()
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id

    // Check if user owns an account
    const ownedAccount = await prisma.account.findFirst({
      where: { ownerId: userId },
      select: {
        id: true,
        name: true,
        slug: true,
        plan: true,
        businessName: true,
        billingEmail: true,
        primaryMarketplace: true,
        productCategories: true,
      },
    })

    if (ownedAccount) {
      return NextResponse.json({ account: ownedAccount }, { status: 200 })
    }

    // If not an owner, check if they're a member
    const membership = await prisma.accountMember.findFirst({
      where: { userId },
      select: {
        account: {
          select: {
            id: true,
            name: true,
            slug: true,
            plan: true,
            businessName: true,
            billingEmail: true,
            primaryMarketplace: true,
            productCategories: true,
          },
        },
      },
    })

    if (membership) {
      return NextResponse.json({ account: membership.account }, { status: 200 })
    }

    return NextResponse.json({ error: 'No account found' }, { status: 404 })
  } catch (error) {
    console.error('Error fetching account:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH update account information (Owner only)
export async function PATCH(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Only account owners can update account settings
    const isOwner = (session.user as { isOwner?: boolean })?.isOwner
    if (!isOwner) {
      return NextResponse.json(
        { error: 'Forbidden: Only account owners can update account settings' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { name, businessName, billingEmail } = body

    // Validation
    if (!name || name.trim().length < 2) {
      return NextResponse.json(
        { error: 'Account name must be at least 2 characters' },
        { status: 400 }
      )
    }

    // Find user's owned account
    const account = await prisma.account.findFirst({
      where: { ownerId: session.user.id },
      select: { id: true },
    })

    if (!account) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 })
    }

    // Update account
    const updatedAccount = await prisma.account.update({
      where: { id: account.id },
      data: {
        name: name.trim(),
        businessName: businessName?.trim() || null,
        billingEmail: billingEmail?.trim() || null,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        plan: true,
        businessName: true,
        billingEmail: true,
        primaryMarketplace: true,
        productCategories: true,
      },
    })

    return NextResponse.json(
      { 
        message: 'Account updated successfully',
        account: updatedAccount,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error updating account:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

