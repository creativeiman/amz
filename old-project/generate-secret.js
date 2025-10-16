// Generate a random NextAuth secret
const crypto = require('crypto');
const secret = crypto.randomBytes(32).toString('hex');
console.log('NEXTAUTH_SECRET=' + secret);
console.log('\nCopy this to your Vercel environment variables as NEXTAUTH_SECRET');



