import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { userType, name, email, phone, title, company, message } = await request.json()

    if (!userType || !name || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Log the submission (in production, send via Resend)
    console.log('Contact Sales Form Submission:', {
      userType,
      name,
      email,
      phone,
      title,
      company,
      message,
      submittedAt: new Date().toISOString(),
    })

    // Send email via Resend if configured
    if (process.env.RESEND_API_KEY) {
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: 'Forward OS <onboarding@resend.dev>',
            to: 'ceo@theupcapital.com',
            subject: `New Contact Sales Inquiry - ${userType.charAt(0).toUpperCase() + userType.slice(1)}`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #FF8C00;">New Sales Inquiry</h2>

                <h3>Contact Information:</h3>
                <ul style="list-style: none; padding: 0;">
                  <li><strong>Name:</strong> ${name}</li>
                  <li><strong>Email:</strong> ${email}</li>
                  <li><strong>Phone:</strong> ${phone || 'Not provided'}</li>
                  <li><strong>Title:</strong> ${title || 'Not provided'}</li>
                  <li><strong>Company:</strong> ${company || 'Not provided'}</li>
                </ul>

                <h3>User Type:</h3>
                <p style="background: #FFF7F3; padding: 10px; border-radius: 4px;">
                  <strong>${userType === 'buyer' ? '🔍 Buyer / Investor' : userType === 'seller' ? '📊 Seller / Founder' : '🤝 Broker / Advisor'}</strong>
                </p>

                <h3>Message:</h3>
                <p style="background: #f5f5f5; padding: 10px; border-radius: 4px; white-space: pre-wrap;">
                  ${message || 'No message provided'}
                </p>

                <hr style="margin-top: 20px; border: none; border-top: 1px solid #ccc;">
                <p style="color: #999; font-size: 12px; margin-top: 20px;">
                  This inquiry was submitted via Forward OS Contact Sales form at ${new Date().toLocaleString()}
                </p>
              </div>
            `,
          }),
        })
      } catch (emailError) {
        console.error('Failed to send email via Resend:', emailError)
        // Continue anyway - form submission still succeeds
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Thank you for your inquiry. Our team will contact you shortly.',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Contact sales error:', error)
    return NextResponse.json(
      { error: 'Failed to process contact inquiry' },
      { status: 500 }
    )
  }
}
