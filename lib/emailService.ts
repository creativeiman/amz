export interface EmailData {
  to: string
  subject: string
  html: string
  text: string
}

export class EmailService {
  static async sendWelcomeEmail(userEmail: string, userName: string): Promise<boolean> {
    try {
      const emailData: EmailData = {
        to: userEmail,
        subject: 'Welcome to LabelCompliance! 🎉',
        html: this.getWelcomeEmailHTML(userName),
        text: this.getWelcomeEmailText(userName)
      }

      // For now, we'll log the email (in production, integrate with SendGrid, Resend, etc.)
      console.log('='.repeat(50))
      console.log('📧 WELCOME EMAIL SENT')
      console.log('='.repeat(50))
      console.log(`To: ${emailData.to}`)
      console.log(`Subject: ${emailData.subject}`)
      console.log('Content:')
      console.log(emailData.text)
      console.log('='.repeat(50))

      // Simulate email sending delay
      await new Promise(resolve => setTimeout(resolve, 100))

      return true
    } catch (error) {
      console.error('Error sending welcome email:', error)
      return false
    }
  }

  private static getWelcomeEmailHTML(userName: string): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to LabelCompliance</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to LabelCompliance!</h1>
            <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Your compliance journey starts here</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-top: 0;">Hi ${userName}! 👋</h2>
            
            <p>Thank you for joining LabelCompliance! We're excited to help you navigate Amazon's complex regulatory requirements and avoid costly compliance mistakes.</p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
              <h3 style="margin-top: 0; color: #667eea;">What's Next?</h3>
              <ul style="margin: 0; padding-left: 20px;">
                <li>Upload your product labels for compliance checking</li>
                <li>Get detailed analysis for US, UK, and German markets</li>
                <li>Receive actionable recommendations to fix issues</li>
                <li>Ensure your products meet FDA, CPSC, and EU standards</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://vercel-deploy-1t440oiiu-joyeneghalu-gmailcoms-projects.vercel.app/dashboard" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
                Get Started Now
              </a>
            </div>
            
            <p style="font-size: 14px; color: #666; margin-top: 30px;">
              Need help? Reply to this email or visit our support center.
            </p>
          </div>
        </body>
      </html>
    `
  }

  private static getWelcomeEmailText(userName: string): string {
    return `
Welcome to LabelCompliance!

Hi ${userName}!

Thank you for joining LabelCompliance! We're excited to help you navigate Amazon's complex regulatory requirements and avoid costly compliance mistakes.

What's Next?
• Upload your product labels for compliance checking
• Get detailed analysis for US, UK, and German markets  
• Receive actionable recommendations to fix issues
• Ensure your products meet FDA, CPSC, and EU standards

Get started: https://vercel-deploy-1t440oiiu-joyeneghalu-gmailcoms-projects.vercel.app/dashboard

Need help? Reply to this email or visit our support center.

Best regards,
The LabelCompliance Team
    `.trim()
  }
}
