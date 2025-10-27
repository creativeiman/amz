# Stripe Integration Setup Guide

This guide will help you set up Stripe payment integration for the AMZ Label Checker application.

## Table of Contents

1. [Environment Variables](#environment-variables)
2. [Stripe Dashboard Setup](#stripe-dashboard-setup)
3. [Webhook Configuration](#webhook-configuration)
4. [Testing Locally](#testing-locally)
5. [Production Deployment](#production-deployment)

## Environment Variables

### Required Environment Variables

Add these to your `.env.local` file:

```bash
# Stripe Payment Integration
# Mode: 'sandbox' for testing, 'live' for production
STRIPE_MODE="sandbox"

# Stripe Test Keys (for sandbox mode)
STRIPE_TEST_SECRET_KEY="sk_test_51SIoOc9W2vd5PpZcZEm6jzKJ7ErUS2JddA8kMKQeOEVMncl8OsvCAnFUuAikkJNXjad3FaL3oiyFvRv76mhal1NL00yIBsVepg"
NEXT_PUBLIC_STRIPE_TEST_PUBLISHABLE_KEY="pk_test_51SIoOc9W2vd5PpZcbR5LiGpoXuCXJ3F361K4B7mUmVewfOUD9Hj0luhBHwE1HPJ9amq1DYYqIwBM9SismlnWDRUS004yv1wZb1"
STRIPE_TEST_WEBHOOK_SECRET="whsec_your_test_webhook_secret_here"

# Stripe Live Keys (for production mode - leave empty for now)
STRIPE_LIVE_SECRET_KEY=""
NEXT_PUBLIC_STRIPE_LIVE_PUBLISHABLE_KEY=""
STRIPE_LIVE_WEBHOOK_SECRET=""

# Stripe Price IDs
NEXT_PUBLIC_STRIPE_ONE_TIME_PRICE_ID="price_1SLU2t9W2vd5PpZc5eryXilL"
NEXT_PUBLIC_STRIPE_DELUXE_PRICE_ID="price_1SLU2T9W2vd5PpZcnhHVFZHz"
```

### Environment Mode Switching

The application uses `STRIPE_MODE` to determine which keys to use:

- **sandbox** (default): Uses test keys for development
- **live**: Uses live keys for production

This allows you to easily switch between test and production Stripe accounts.

## Stripe Dashboard Setup

### 1. Access Your Stripe Dashboard

- Go to [https://dashboard.stripe.com](https://dashboard.stripe.com)
- Sign in with your account
- Make sure you're in **Test Mode** (toggle in top right)

### 2. Verify Your Products and Prices

Your products should already be set up with these price IDs:

- **One-Time Use Plan**: `price_1SLU2t9W2vd5PpZc5eryXilL` ($59.99)
- **Deluxe Plan**: `price_1SLU2T9W2vd5PpZcnhHVFZHz` ($29.99/month)

To verify:
1. Go to **Products** in the dashboard
2. Click on each product
3. Verify the Price ID matches the environment variables

## Webhook Configuration

Webhooks are required for the application to receive updates about payments and subscriptions.

### 1. Create a Webhook Endpoint

#### Option A: Production/Staging URL

1. Go to **Developers** → **Webhooks** in Stripe Dashboard
2. Click **Add endpoint**
3. Enter your webhook URL: `https://yourdomain.com/api/stripe/webhook`
4. Click **Select events**
5. Add these events:
   - `checkout.session.completed`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
6. Click **Add endpoint**
7. Copy the **Signing secret** (starts with `whsec_`)
8. Add it to your environment variables as `STRIPE_TEST_WEBHOOK_SECRET` or `STRIPE_LIVE_WEBHOOK_SECRET`

#### Option B: Local Development (using Stripe CLI)

For local testing, use the Stripe CLI:

```bash
# Install Stripe CLI
# macOS
brew install stripe/stripe-cli/stripe

# Windows
scoop install stripe

# Linux
# Download from https://github.com/stripe/stripe-cli/releases

# Login to Stripe
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/stripe/webhook

# This will output a webhook signing secret (whsec_...)
# Copy this and add to .env.local as STRIPE_TEST_WEBHOOK_SECRET
```

### 2. Required Webhook Events

The application handles these events:

| Event | Purpose |
|-------|---------|
| `checkout.session.completed` | Initial payment completed, upgrade user plan |
| `invoice.payment_succeeded` | Recurring payment succeeded, keep subscription active |
| `invoice.payment_failed` | Payment failed, mark subscription as past due |
| `customer.subscription.updated` | Subscription status changed |
| `customer.subscription.deleted` | Subscription canceled, downgrade to free plan |

### 3. Test Webhook Events

You can test webhooks using Stripe CLI:

```bash
# Test checkout completion
stripe trigger checkout.session.completed

# Test invoice payment
stripe trigger invoice.payment_succeeded

# Test subscription cancellation
stripe trigger customer.subscription.deleted
```

## Testing Locally

### 1. Start Your Development Server

```bash
cd new-project
pnpm dev
```

### 2. Start Stripe Webhook Forwarding

In a separate terminal:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

### 3. Test the Payment Flow

1. Go to `http://localhost:3000/pricing`
2. Click on a paid plan (Deluxe or One-Time)
3. You'll be redirected to Stripe Checkout
4. Use test card: `4242 4242 4242 4242`
   - Any future expiry date
   - Any 3-digit CVC
   - Any billing zip code
5. Complete the payment
6. You'll be redirected back to `/dashboard/billing?success=true`
7. Check the webhook logs in your terminal to see events being processed

### 4. Test Customer Portal

1. After purchasing a plan, go to `/dashboard/billing`
2. Click "Manage Subscription"
3. You'll be redirected to Stripe Customer Portal
4. Test updating payment method, canceling subscription, etc.

## Production Deployment

### 1. Switch to Live Mode

In Stripe Dashboard:
- Toggle to **Live Mode** (top right)
- Create live versions of your products if needed
- Get your live API keys from **Developers** → **API keys**

### 2. Update Environment Variables

```bash
# Set mode to live
STRIPE_MODE="live"

# Add live keys
STRIPE_LIVE_SECRET_KEY="sk_live_your_key"
NEXT_PUBLIC_STRIPE_LIVE_PUBLISHABLE_KEY="pk_live_your_key"
STRIPE_LIVE_WEBHOOK_SECRET="whsec_your_live_webhook_secret"

# Update price IDs if different in live mode
NEXT_PUBLIC_STRIPE_ONE_TIME_PRICE_ID="price_live_xxx"
NEXT_PUBLIC_STRIPE_DELUXE_PRICE_ID="price_live_xxx"
```

### 3. Set Up Production Webhook

1. Go to **Developers** → **Webhooks** (in Live Mode)
2. Add your production webhook URL: `https://yourdomain.com/api/stripe/webhook`
3. Select the same events as before
4. Copy the signing secret and update `STRIPE_LIVE_WEBHOOK_SECRET`

### 4. Enable Billing Portal

1. Go to **Settings** → **Billing** → **Customer portal**
2. Activate the customer portal
3. Configure:
   - Enable subscription cancellation
   - Enable payment method updates
   - Set your branding
   - Add business information

## Troubleshooting

### Webhook Signature Verification Failed

- Check that `STRIPE_WEBHOOK_SECRET` matches the webhook endpoint
- Ensure you're using the correct secret for test/live mode
- Verify the endpoint URL is correct

### Payment Not Updating User Plan

- Check webhook logs in Stripe Dashboard → **Developers** → **Webhooks**
- Verify webhook is receiving events
- Check application logs for errors
- Ensure metadata (accountId, planId) is being passed correctly

### Customer Portal Not Working

- Verify `stripeCustomerId` is stored in account record
- Check that customer portal is activated in Stripe Dashboard
- Ensure return URL is correct

### Testing Cards

Use these test cards:

| Card Number | Description |
|-------------|-------------|
| 4242 4242 4242 4242 | Successful payment |
| 4000 0000 0000 0002 | Declined card |
| 4000 0025 0000 3155 | Requires authentication (3D Secure) |
| 4000 0000 0000 9995 | Insufficient funds |

## Additional Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Testing](https://stripe.com/docs/testing)
- [Stripe Webhooks Guide](https://stripe.com/docs/webhooks)
- [Stripe CLI](https://stripe.com/docs/stripe-cli)

## Support

If you encounter issues:

1. Check Stripe Dashboard → **Developers** → **Events** for event logs
2. Check application logs for errors
3. Verify all environment variables are set correctly
4. Test with Stripe CLI locally before deploying

