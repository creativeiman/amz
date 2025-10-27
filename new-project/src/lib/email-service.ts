import { env, publicEnv } from '@/config/env'
import { Resend } from 'resend'

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

      // If Resend is configured, send via Resend
      if (env.RESEND_API_KEY) {
        await this.sendViaResend(emailData)
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
   * Send welcome email to new users
   */
  static async sendWelcomeEmail(
    userEmail: string,
    userName: string
  ): Promise<boolean> {
    try {
      const emailData: EmailData = {
        to: userEmail,
        subject: 'Welcome to Product Label Checker! 🎉',
        html: this.getWelcomeEmailHTML(userName),
        text: this.getWelcomeEmailText(userName),
      }

      // If Resend is configured, send via Resend
      if (env.RESEND_API_KEY) {
        await this.sendViaResend(emailData)
      } else {
        // Development mode - log to console
        console.log('='.repeat(60))
        console.log('📧 WELCOME EMAIL (Development Mode)')
        console.log('='.repeat(60))
        console.log(`To: ${emailData.to}`)
        console.log(`Subject: ${emailData.subject}`)
        console.log('\nContent:')
        console.log(emailData.text)
        console.log('='.repeat(60))
      }

      return true
    } catch (error) {
      console.error('Error sending welcome email:', error)
      return false
    }
  }

  /**
   * Send team invitation email
   */
  static async sendInvitationEmail(
    userEmail: string,
    inviterName: string,
    accountName: string,
    invitationToken: string,
    role: string
  ): Promise<boolean> {
    try {
      const invitationLink = `${publicEnv.NEXT_PUBLIC_APP_URL}/accept-invite?token=${invitationToken}`
      
      const emailData: EmailData = {
        to: userEmail,
        subject: `You've been invited to join ${accountName} - Product Label Checker`,
        html: this.getInvitationEmailHTML(inviterName, accountName, invitationLink, role),
        text: this.getInvitationEmailText(inviterName, accountName, invitationLink, role),
      }

      // If Resend is configured, send via Resend
      if (env.RESEND_API_KEY) {
        await this.sendViaResend(emailData)
      } else {
        // Development mode - log to console
        console.log('='.repeat(60))
        console.log('📧 TEAM INVITATION EMAIL (Development Mode)')
        console.log('='.repeat(60))
        console.log(`To: ${emailData.to}`)
        console.log(`Subject: ${emailData.subject}`)
        console.log('\nInvitation Link:')
        console.log(invitationLink)
        console.log('\nContent:')
        console.log(emailData.text)
        console.log('='.repeat(60))
      }

      return true
    } catch (error) {
      console.error('Error sending invitation email:', error)
      return false
    }
  }

  /**
   * Send via Resend SDK
   */
  private static async sendViaResend(emailData: EmailData): Promise<void> {
    const resend = new Resend(env.RESEND_API_KEY)
    
    const { error } = await resend.emails.send({
      from: `Product Label Checker <${env.RESEND_FROM_EMAIL}>`,
      to: [emailData.to],
      subject: emailData.subject,
      html: emailData.html,
      text: emailData.text,
    })

    if (error) {
      throw new Error(`Resend API error: ${error.message}`)
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

  /**
   * HTML template for team invitation email
   */
  private static getInvitationEmailHTML(
    inviterName: string,
    accountName: string,
    invitationLink: string,
    role: string
  ): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Team Invitation</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
          <div style="background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <div style="background: linear-gradient(135deg, #ea580c 0%, #2563eb 100%); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px;">🎉 You're Invited!</h1>
              <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Product Label Checker</p>
            </div>
            
            <div style="padding: 30px;">
              <h2 style="color: #333; margin-top: 0;">Join ${accountName}'s Team</h2>
              
              <p><strong>${inviterName}</strong> has invited you to join their team on Product Label Checker as a <strong>${role}</strong>.</p>
              
              <div style="background: #dbeafe; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2563eb;">
                <p style="margin: 0; color: #1e40af;"><strong>🎯 Role:</strong> ${role}</p>
              </div>
              
              <p>As a team member, you'll be able to collaborate on product label analysis and compliance checking.</p>
              
              <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
                <p style="margin: 0; color: #92400e;"><strong>⏱️ This invitation expires in 7 days</strong></p>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${invitationLink}" 
                   style="background: linear-gradient(135deg, #ea580c 0%, #2563eb 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                  Accept Invitation
                </a>
              </div>
              
              <p style="font-size: 14px; color: #666;">
                Or copy and paste this link into your browser:<br>
                <a href="${invitationLink}" style="color: #2563eb; word-break: break-all;">${invitationLink}</a>
              </p>
              
              <div style="background: #fee2e2; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
                <p style="margin: 0; color: #991b1b; font-size: 14px;">
                  <strong>⚠️ Notice:</strong><br>
                  If you didn't expect this invitation, you can safely ignore this email.
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
   * Plain text version for team invitation email
   */
  private static getInvitationEmailText(
    inviterName: string,
    accountName: string,
    invitationLink: string,
    role: string
  ): string {
    return `
You're Invited to Join ${accountName}'s Team - Product Label Checker

${inviterName} has invited you to join their team on Product Label Checker as a ${role}.

🎯 Role: ${role}

As a team member, you'll be able to collaborate on product label analysis and compliance checking.

⏱️ This invitation expires in 7 days

Click the link below to accept the invitation:
${invitationLink}

⚠️ Notice:
If you didn't expect this invitation, you can safely ignore this email.

Need help? Contact us at support@productlabelchecker.com

© 2025 Product Label Checker. All rights reserved.
    `.trim()
  }

  /**
   * HTML template for welcome email
   */
  private static getWelcomeEmailHTML(userName: string): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to Product Label Checker</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
          <div style="background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <div style="background: linear-gradient(135deg, #ea580c 0%, #2563eb 100%); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 32px;">🎉 Welcome!</h1>
              <p style="color: white; margin: 10px 0 0 0; font-size: 18px;">Product Label Checker</p>
            </div>
            
            <div style="padding: 30px;">
              <h2 style="color: #333; margin-top: 0;">Hi ${userName}! 👋</h2>
              
              <p>Thank you for joining <strong>Product Label Checker</strong>! We're excited to help you navigate Amazon's complex regulatory requirements and avoid costly compliance mistakes.</p>
              
              <div style="background: #dbeafe; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #2563eb;">
                <h3 style="margin-top: 0; color: #1e40af;">🚀 What's Next?</h3>
                <ul style="margin: 10px 0; padding-left: 20px; color: #1e40af;">
                  <li style="margin: 8px 0;">Upload your product labels for compliance checking</li>
                  <li style="margin: 8px 0;">Get detailed analysis for US, UK, and German markets</li>
                  <li style="margin: 8px 0;">Receive actionable recommendations to fix issues</li>
                  <li style="margin: 8px 0;">Ensure your products meet FDA, CPSC, and EU standards</li>
                </ul>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${publicEnv.NEXT_PUBLIC_APP_URL}/dashboard" 
                   style="background: linear-gradient(135deg, #ea580c 0%, #2563eb 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                  Get Started
                </a>
              </div>
              
              <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
                <p style="margin: 0; color: #92400e;">
                  <strong>💡 Pro Tip:</strong><br>
                  Start with your best-selling product to see immediate value from our compliance analysis!
                </p>
              </div>
              
              <p style="font-size: 14px; color: #666; margin-top: 30px; border-top: 1px solid #e5e5e5; padding-top: 20px;">
                Need help getting started? Reply to this email or contact us at <a href="mailto:support@productlabelchecker.com" style="color: #2563eb;">support@productlabelchecker.com</a>
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
   * Plain text version for welcome email
   */
  private static getWelcomeEmailText(userName: string): string {
    return `
Welcome to Product Label Checker! 🎉

Hi ${userName}!

Thank you for joining Product Label Checker! We're excited to help you navigate Amazon's complex regulatory requirements and avoid costly compliance mistakes.

🚀 What's Next?
• Upload your product labels for compliance checking
• Get detailed analysis for US, UK, and German markets
• Receive actionable recommendations to fix issues
• Ensure your products meet FDA, CPSC, and EU standards

Get started: ${publicEnv.NEXT_PUBLIC_APP_URL}/dashboard

💡 Pro Tip:
Start with your best-selling product to see immediate value from our compliance analysis!

Need help getting started? Reply to this email or contact us at support@productlabelchecker.com

© 2025 Product Label Checker. All rights reserved.
    `.trim()
  }
}

