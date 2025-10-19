import { env, publicEnv } from '@/config/env'

export interface EmailData {
  to: string
  subject: string
  html: string
  text: string
}

export class EmailService {
  /**
   * Send password reset email with token link
   */
  static async sendPasswordResetEmail(
    userEmail: string,
    userName: string,
    resetToken: string
  ): Promise<boolean> {
    try {
      const resetLink = `${publicEnv.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`
      
      const emailData: EmailData = {
        to: userEmail,
        subject: 'Reset Your Password - Product Label Checker',
        html: this.getPasswordResetEmailHTML(userName, resetLink),
        text: this.getPasswordResetEmailText(userName, resetLink),
      }

      // If SendGrid is configured, send via SendGrid
      if (env.SENDGRID_API_KEY) {
        await this.sendViaSendGrid(emailData)
      } else {
        // Development mode - log to console
        console.log('='.repeat(60))
        console.log('📧 PASSWORD RESET EMAIL (Development Mode)')
        console.log('='.repeat(60))
        console.log(`To: ${emailData.to}`)
        console.log(`Subject: ${emailData.subject}`)
        console.log('\nReset Link:')
        console.log(resetLink)
        console.log('\nContent:')
        console.log(emailData.text)
        console.log('='.repeat(60))
      }

      return true
    } catch (error) {
      console.error('Error sending password reset email:', error)
      return false
    }
  }

  /**
   * Send via SendGrid API
   */
  private static async sendViaSendGrid(emailData: EmailData): Promise<void> {
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${env.SENDGRID_API_KEY}`,
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email: emailData.to }],
            subject: emailData.subject,
          },
        ],
        from: {
          email: env.SENDGRID_FROM_EMAIL,
          name: 'Product Label Checker',
        },
        content: [
          {
            type: 'text/plain',
            value: emailData.text,
          },
          {
            type: 'text/html',
            value: emailData.html,
          },
        ],
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`SendGrid API error: ${error}`)
    }
  }

  /**
   * HTML template for password reset email
   */
  private static getPasswordResetEmailHTML(userName: string, resetLink: string): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset Your Password</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
          <div style="background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <div style="background: linear-gradient(135deg, #ea580c 0%, #2563eb 100%); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px;">Reset Your Password</h1>
              <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Product Label Checker</p>
            </div>
            
            <div style="padding: 30px;">
              <h2 style="color: #333; margin-top: 0;">Hi ${userName}! 👋</h2>
              
              <p>We received a request to reset your password for your Product Label Checker account.</p>
              
              <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
                <p style="margin: 0; color: #92400e;"><strong>⏱️ This link expires in 1 hour</strong></p>
              </div>
              
              <p>Click the button below to reset your password:</p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${resetLink}" 
                   style="background: linear-gradient(135deg, #ea580c 0%, #2563eb 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                  Reset Password
                </a>
              </div>
              
              <p style="font-size: 14px; color: #666;">
                Or copy and paste this link into your browser:<br>
                <a href="${resetLink}" style="color: #2563eb; word-break: break-all;">${resetLink}</a>
              </p>
              
              <div style="background: #fee2e2; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
                <p style="margin: 0; color: #991b1b; font-size: 14px;">
                  <strong>⚠️ Security Notice:</strong><br>
                  If you didn't request this password reset, please ignore this email or contact support if you have concerns.
                </p>
              </div>
              
              <p style="font-size: 14px; color: #666; margin-top: 30px; border-top: 1px solid #e5e5e5; padding-top: 20px;">
                Need help? Contact us at <a href="mailto:support@productlabelchecker.com" style="color: #2563eb;">support@productlabelchecker.com</a>
              </p>
            </div>
          </div>
          
          <p style="text-align: center; font-size: 12px; color: #999; margin-top: 20px;">
            © 2025 Product Label Checker. All rights reserved.
          </p>
        </body>
      </html>
    `
  }

  /**
   * Plain text version for password reset email
   */
  private static getPasswordResetEmailText(userName: string, resetLink: string): string {
    return `
Reset Your Password - Product Label Checker

Hi ${userName}!

We received a request to reset your password for your Product Label Checker account.

⏱️ This link expires in 1 hour

Click the link below to reset your password:
${resetLink}

⚠️ Security Notice:
If you didn't request this password reset, please ignore this email or contact support if you have concerns.

Need help? Contact us at support@productlabelchecker.com

© 2025 Product Label Checker. All rights reserved.
    `.trim()
  }
}

