import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email, userType, industry, frequency } = await request.json()

    if (!email || !userType || !industry) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Prepare subscription data
    const subscriptionData = {
      email,
      userType,
      industry,
      frequency,
      subscribedAt: new Date().toISOString(),
    }

    // Log subscription (in production, save to database or send to email service)
    console.log('New subscription:', subscriptionData)

    // Send confirmation email via Resend
    // Note: In production, configure RESEND_API_KEY environment variable
    if (process.env.RESEND_API_KEY) {
      try {
        const resendResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: 'Forward OS <onboarding@resend.dev>',
            to: email,
            subject: 'Welcome to Forward OS! 🚀',
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #FF8C00;">Welcome to Forward OS</h1>
                <p>Thanks for subscribing! We're excited to have you on board.</p>
                <div style="background: #f7f6f4; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <h3>Your Preferences:</h3>
                  <ul>
                    <li><strong>Account Type:</strong> ${userType === 'buyer' ? 'Buyer & Investor' : userType === 'seller' ? 'Seller & Founder' : 'Broker & Advisor'}</li>
                    <li><strong>Industry:</strong> ${industry}</li>
                    <li><strong>Update Frequency:</strong> ${frequency.charAt(0).toUpperCase() + frequency.slice(1)}</li>
                  </ul>
                </div>
                <p>You'll start receiving curated deal signals and platform updates tailored to your preferences.</p>
                <p>Questions? Contact us at <strong>ceo@theupcapital.com</strong></p>
                <p style="margin-top: 40px; color: #999; font-size: 12px;">
                  Forward OS • Corporate Transactions Operating System
                </p>
              </div>
            `,
          }),
        })

        if (!resendResponse.ok) {
          console.error('Resend error:', await resendResponse.text())
        }
      } catch (resendError) {
        console.error('Failed to send email via Resend:', resendError)
        // Continue anyway - subscription is still valid
      }
    }

    // Also notify the CEO
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
            subject: `New Subscriber: ${email} (${userType})`,
            html: `
              <div>
                <h2>New Forward OS Subscriber</h2>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Type:</strong> ${userType}</p>
                <p><strong>Industry:</strong> ${industry}</p>
                <p><strong>Frequency:</strong> ${frequency}</p>
                <p><strong>Subscribed:</strong> ${new Date().toISOString()}</p>
              </div>
            `,
          }),
        })
      } catch (ceoEmailError) {
        console.error('Failed to notify CEO:', ceoEmailError)
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Successfully subscribed!',
        data: subscriptionData,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Subscription error:', error)
    return NextResponse.json(
      { error: 'Failed to process subscription' },
      { status: 500 }
    )
  }
}
