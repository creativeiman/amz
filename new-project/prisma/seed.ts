import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create admin user (system administrator)
  const adminPassword = await bcrypt.hash('admin123', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@productlabelchecker.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@productlabelchecker.com',
      password: adminPassword,
      role: 'ADMIN',
      emailVerified: new Date(),
      isActive: true,
    },
  })
  console.log('✅ Created admin user:', admin.email)

  // Create test users
  const testPassword = await bcrypt.hash('test123', 12)
  
  const freeUser = await prisma.user.upsert({
    where: { email: 'free@test.com' },
    update: {},
    create: {
      name: 'Free User',
      email: 'free@test.com',
      password: testPassword,
      role: 'USER',
      emailVerified: new Date(),
      isActive: true,
    },
  })
  console.log('✅ Created free user:', freeUser.email)

  const deluxeUser = await prisma.user.upsert({
    where: { email: 'deluxe@test.com' },
    update: {},
    create: {
      name: 'Deluxe User',
      email: 'deluxe@test.com',
      password: testPassword,
      role: 'USER',
      emailVerified: new Date(),
      isActive: true,
    },
  })
  console.log('✅ Created deluxe user:', deluxeUser.email)

  const oneTimeUser = await prisma.user.upsert({
    where: { email: 'onetime@test.com' },
    update: {},
    create: {
      name: 'One-Time User',
      email: 'onetime@test.com',
      password: testPassword,
      role: 'USER',
      emailVerified: new Date(),
      isActive: true,
    },
  })
  console.log('✅ Created one-time user:', oneTimeUser.email)

  // Create accounts (workspaces) for users
  const freeAccount = await prisma.account.upsert({
    where: { slug: 'free-user-workspace' },
    update: {},
    create: {
      name: 'Free Workspace',
      slug: 'free-user-workspace',
      ownerId: freeUser.id,
      plan: 'FREE',
      subscriptionStatus: 'ACTIVE',
      isActive: true,
      businessName: 'Free User Business',
      primaryMarketplace: 'USA',
      scanLimitPerMonth: 1, // 1 scan per account lifetime (FREE plan)
      scansUsedThisMonth: 0,
      scanLimitResetAt: new Date(new Date().setDate(1)), // First day of current month
    },
  })
  console.log('✅ Created free account:', freeAccount.name)

  const deluxeAccount = await prisma.account.upsert({
    where: { slug: 'test-business-inc' },
    update: {},
    create: {
      name: 'Test Business Inc.',
      slug: 'test-business-inc',
      ownerId: deluxeUser.id,
      plan: 'DELUXE',
      subscriptionStatus: 'ACTIVE',
      isActive: true,
      businessName: 'Test Business Inc.',
      primaryMarketplace: 'USA',
      productCategories: ['TOYS', 'BABY_PRODUCTS'],
      scanLimitPerMonth: null, // Unlimited for DELUXE
      scansUsedThisMonth: 2,
    },
  })
  console.log('✅ Created deluxe account:', deluxeAccount.name)

  const oneTimeAccount = await prisma.account.upsert({
    where: { slug: 'onetime-workspace' },
    update: {},
    create: {
      name: 'One-Time Workspace',
      slug: 'onetime-workspace',
      ownerId: oneTimeUser.id,
      plan: 'ONE_TIME',
      subscriptionStatus: 'ACTIVE',
      isActive: true,
      scanLimitPerMonth: 1,
      scansUsedThisMonth: 0,
    },
  })
  console.log('✅ Created one-time account:', oneTimeAccount.name)

  // Create team members for deluxe account
  const teamMember1 = await prisma.user.upsert({
    where: { email: 'editor@test.com' },
    update: {},
    create: {
      name: 'Editor User',
      email: 'editor@test.com',
      password: testPassword,
      role: 'USER',
      emailVerified: new Date(),
      isActive: true,
    },
  })
  console.log('✅ Created team member (editor):', teamMember1.email)

  await prisma.accountMember.upsert({
    where: {
      accountId_userId: {
        accountId: deluxeAccount.id,
        userId: teamMember1.id,
      },
    },
    update: {},
    create: {
      accountId: deluxeAccount.id,
      userId: teamMember1.id,
      role: 'EDITOR',
      permissions: ['SCAN_CREATE', 'SCAN_VIEW', 'SCAN_EDIT', 'TEAM_VIEW'],
      invitedBy: deluxeUser.id,
      isActive: true,
    },
  })
  console.log('✅ Added editor to deluxe account')

  const teamMember2 = await prisma.user.upsert({
    where: { email: 'viewer@test.com' },
    update: {},
    create: {
      name: 'Viewer User',
      email: 'viewer@test.com',
      password: testPassword,
      role: 'USER',
      emailVerified: new Date(),
      isActive: true,
    },
  })
  console.log('✅ Created team member (viewer):', teamMember2.email)

  await prisma.accountMember.upsert({
    where: {
      accountId_userId: {
        accountId: deluxeAccount.id,
        userId: teamMember2.id,
      },
    },
    update: {},
    create: {
      accountId: deluxeAccount.id,
      userId: teamMember2.id,
      role: 'VIEWER',
      permissions: ['SCAN_VIEW', 'TEAM_VIEW'],
      invitedBy: deluxeUser.id,
      isActive: true,
    },
  })
  console.log('✅ Added viewer to deluxe account')

  // Create sample invitation (optional - uncomment to test invite flow)
  // Note: Deluxe plan allows 2 team members max. We already have 2 active members.
  // This invitation would put us at the limit (2 members + 1 pending = 3 total).
  // The API will block new invitations when currentMembers + pendingInvites >= maxTeamMembers
  const crypto = await import('crypto')
  
  // Uncomment below to test invitation acceptance flow:
  /*
  await prisma.accountInvite.upsert({
    where: {
      accountId_email: {
        accountId: deluxeAccount.id,
        email: 'pending-editor@test.com',
      },
    },
    update: {},
    create: {
      accountId: deluxeAccount.id,
      email: 'pending-editor@test.com',
      role: 'EDITOR',
      permissions: ['SCAN_CREATE', 'SCAN_VIEW', 'SCAN_EDIT', 'TEAM_VIEW'],
      invitedBy: deluxeUser.id,
      token: crypto.randomUUID(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    },
  })
  console.log('✅ Created pending invitation for pending-editor@test.com')
  */

  // Create regulatory rules
  const regulatoryRules = [
    // USA - Toys
    {
      category: 'TOYS' as const,
      marketplace: 'USA',
      requirement: 'Age grading must be clearly visible',
      description: 'Age grading helps parents choose appropriate toys for their children. Must be prominently displayed on packaging.',
      regulation: 'CPSC 16 CFR Part 1501',
      criticality: 'CRITICAL' as const,
      example: 'AGES 3+',
    },
    {
      category: 'TOYS' as const,
      marketplace: 'USA',
      requirement: 'Choking hazard warning required for small parts',
      description: 'Small parts can be a choking hazard for children under 3 years old.',
      regulation: 'CPSC 16 CFR 1500.19',
      criticality: 'CRITICAL' as const,
      example: 'WARNING: CHOKING HAZARD - Small parts. Not for children under 3 years.',
    },
    {
      category: 'TOYS' as const,
      marketplace: 'USA',
      requirement: 'CPSC compliance mark required',
      description: 'All toys must meet Consumer Product Safety Commission safety standards.',
      regulation: 'CPSC 16 CFR Part 1107',
      criticality: 'CRITICAL' as const,
      example: 'Meets CPSC Safety Requirements',
    },
    // USA - Baby Products
    {
      category: 'BABY_PRODUCTS' as const,
      marketplace: 'USA',
      requirement: 'FDA registration number required',
      description: 'Baby products must be registered with the Food and Drug Administration.',
      regulation: 'FDA 21 CFR Part 107',
      criticality: 'CRITICAL' as const,
      example: 'FDA Registration No.: 12345678',
    },
    {
      category: 'BABY_PRODUCTS' as const,
      marketplace: 'USA',
      requirement: 'Nutritional information for food products',
      description: 'Baby food must include complete nutritional information panel.',
      regulation: 'FDA 21 CFR 101.9',
      criticality: 'CRITICAL' as const,
    },
    // USA - Cosmetics
    {
      category: 'COSMETICS_PERSONAL_CARE' as const,
      marketplace: 'USA',
      requirement: 'FDA ingredient list required',
      description: 'All cosmetic ingredients must be listed in descending order of predominance.',
      regulation: 'FDA 21 CFR 701.3',
      criticality: 'CRITICAL' as const,
      example: 'Ingredients: Water, Glycerin, Cetyl Alcohol...',
    },
    {
      category: 'COSMETICS_PERSONAL_CARE' as const,
      marketplace: 'USA',
      requirement: 'Net weight declaration required',
      description: 'Package must show net weight or volume in both metric and US customary units.',
      regulation: 'FDA 21 CFR 701.13',
      criticality: 'CRITICAL' as const,
      example: 'Net Wt. 1.7 oz (50g)',
    },
    // UK - Toys
    {
      category: 'TOYS' as const,
      marketplace: 'UK',
      requirement: 'UKCA marking required',
      description: 'Products must bear UKCA mark for UK market post-Brexit.',
      regulation: 'Toys Safety Regulations 2011',
      criticality: 'CRITICAL' as const,
      example: 'UKCA mark visible on product',
    },
    {
      category: 'TOYS' as const,
      marketplace: 'UK',
      requirement: 'Age appropriate warnings in English',
      description: 'All safety warnings must be clearly displayed in English.',
      regulation: 'UK Toys Safety Regulations',
      criticality: 'CRITICAL' as const,
    },
    // Germany - Toys
    {
      category: 'TOYS' as const,
      marketplace: 'GERMANY',
      requirement: 'CE marking required',
      description: 'Products must bear CE mark for EU market compliance.',
      regulation: 'EN 71 European Toy Safety Standard',
      criticality: 'CRITICAL' as const,
      example: 'CE mark visible on product',
    },
    {
      category: 'TOYS' as const,
      marketplace: 'GERMANY',
      requirement: 'German language warnings required',
      description: 'All safety warnings must be provided in German.',
      regulation: 'ProdSG - German Product Safety Act',
      criticality: 'CRITICAL' as const,
      example: 'ACHTUNG: Nicht für Kinder unter 36 Monaten geeignet',
    },
  ]

  for (const rule of regulatoryRules) {
    await prisma.regulatoryRule.upsert({
      where: {
        category_marketplace_requirement: {
          category: rule.category,
          marketplace: rule.marketplace,
          requirement: rule.requirement,
        },
      },
      update: {},
      create: rule,
    })
  }
  console.log(`✅ Created ${regulatoryRules.length} regulatory rules`)

  // Create sample scans for deluxe account
  const scan1 = await prisma.scan.create({
    data: {
      accountId: deluxeAccount.id,
      createdBy: deluxeUser.id,
      productName: 'Toy Car Racing Set',
      category: 'TOYS',
      marketplaces: ['USA'],
      labelUrl: 'https://example.com/label1.jpg',
      extractedText: 'AGES 3+ WARNING: Small parts',
      score: 85,
      riskLevel: 'LOW',
      status: 'COMPLETED',
      results: {
        passed: 8,
        failed: 2,
        warnings: 1,
      },
    },
  })
  console.log('✅ Created sample scan:', scan1.productName)

  const scan2 = await prisma.scan.create({
    data: {
      accountId: deluxeAccount.id,
      createdBy: teamMember1.id, // Created by editor
      productName: 'Baby Food - Organic Puree',
      category: 'BABY_PRODUCTS',
      marketplaces: ['USA', 'UK'],
      labelUrl: 'https://example.com/label2.jpg',
      extractedText: 'FDA Registration No.: 12345678 Net Wt. 4 oz (113g)',
      score: 92,
      riskLevel: 'LOW',
      status: 'COMPLETED',
      results: {
        passed: 10,
        failed: 1,
        warnings: 0,
      },
    },
  })
  console.log('✅ Created sample scan 2:', scan2.productName)

  // Create a sample payment for deluxe account
  await prisma.payment.create({
    data: {
      accountId: deluxeAccount.id,
      stripePaymentId: 'pi_test_1234567890',
      amount: 2999, // $29.99
      currency: 'usd',
      plan: 'DELUXE',
      status: 'COMPLETED',
      invoiceUrl: 'https://example.com/invoice.pdf',
    },
  })
  console.log('✅ Created sample payment for deluxe account')

  // Seed comprehensive compliance rules
  console.log('\n📋 Seeding compliance rules...')
  const { seedComplianceRules } = await import('./seed-rules-data')
  await seedComplianceRules(prisma)
  console.log('✅ Compliance rules seeded successfully!')

  console.log('\n🎉 Database seeding completed!')
  console.log('\n📝 Test Credentials (all passwords: test123 or admin123):')
  console.log('   ═══════════════════════════════════════════════════════════')
  console.log('   System Admin: admin@productlabelchecker.com / admin123')
  console.log('   ═══════════════════════════════════════════════════════════')
  console.log('   Free Plan Owner: free@test.com / test123')
  console.log('   Deluxe Plan Owner: deluxe@test.com / test123')
  console.log('   One-Time Plan Owner: onetime@test.com / test123')
  console.log('   ═══════════════════════════════════════════════════════════')
  console.log('   Team Members (Test Business Inc.):')
  console.log('     - Editor: editor@test.com / test123')
  console.log('     - Viewer: viewer@test.com / test123')
  console.log('   ═══════════════════════════════════════════════════════════')
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

