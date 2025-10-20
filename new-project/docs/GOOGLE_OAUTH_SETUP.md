# Google OAuth Setup Guide

This guide walks you through setting up Google OAuth authentication for the Product Label Checker application.

## Prerequisites

- Google Cloud Platform account
- Access to Google Cloud Console

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown at the top
3. Click "New Project"
4. Enter project name (e.g., "Product Label Checker")
5. Click "Create"

## Step 2: Enable Google+ API

1. In the Google Cloud Console, select your project
2. Go to "APIs & Services" > "Library"
3. Search for "Google+ API"
4. Click on it and click "Enable"

## Step 3: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. If prompted, configure the OAuth consent screen:
   - Choose "External" user type
   - Fill in required fields:
     - App name: Product Label Checker
     - User support email: your email
     - Developer contact: your email
   - Click "Save and Continue"
   - Skip "Scopes" for now
   - Add test users if needed
   - Click "Save and Continue"

4. Create OAuth Client ID:
   - Application type: "Web application"
   - Name: "Product Label Checker Web"
   - Authorized JavaScript origins:
     - Development: `http://localhost:3001`
     - Production: `https://yourdomain.com`
   - Authorized redirect URIs:
     - Development: `http://localhost:3001/api/auth/callback/google`
     - Production: `https://yourdomain.com/api/auth/callback/google`
   - Click "Create"

5. Copy the Client ID and Client Secret

## Step 4: Configure Environment Variables

Add the following to your `.env.local` file:

```env
# Google OAuth Credentials
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

## Step 5: Test the Integration

1. Restart your development server:
   ```bash
   make dev
   ```

2. Go to the login page: `http://localhost:3001/login`

3. Click "Continue with Google"

4. You should be redirected to Google's OAuth consent screen

5. After granting permissions, you'll be redirected back to the app

## Troubleshooting

### "redirect_uri_mismatch" Error

- Verify that the redirect URI in Google Cloud Console exactly matches: `http://localhost:3001/api/auth/callback/google`
- Ensure there are no trailing slashes
- Check that the port number is correct (3001)

### "invalid_client" Error

- Verify that `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are correctly set in `.env.local`
- Restart your development server after changing environment variables

### OAuth Consent Screen Needs Verification

- For development, you can use the app in "Testing" mode with test users
- For production, submit your app for verification

## User Flow

1. User clicks "Continue with Google" on login or register page
2. User is redirected to Google OAuth consent screen
3. User grants permissions (email, profile)
4. Google redirects back to your app with authorization code
5. NextAuth exchanges code for user information
6. If new user: Creates user account with FREE plan
7. If existing user: Logs them in
8. User is redirected to dashboard (or billing if plan was selected)

## Security Notes

- OAuth credentials should never be committed to version control
- Use different credentials for development and production
- Regularly rotate your Client Secret
- Monitor OAuth usage in Google Cloud Console
- Restrict your OAuth client to specific domains in production

## Additional Resources

- [NextAuth.js Google Provider Docs](https://next-auth.js.org/providers/google)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Google Cloud Console](https://console.cloud.google.com/)

