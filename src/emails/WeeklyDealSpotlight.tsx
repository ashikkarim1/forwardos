import React from 'react'
import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
  Column,
} from '@react-email/components'

interface WeeklyDealSpotlightProps {
  userName: string
  featuredDeal: {
    name: string
    location: string
    revenue: string
    valuation: string
    growth: string
    url: string
  }
  trendingDeals: Array<{
    name: string
    location: string
    valuation: string
    url: string
  }>
  userPreferences: {
    unsubscribeUrl: string
    preferencesUrl: string
  }
}

export const WeeklyDealSpotlight: React.FC<WeeklyDealSpotlightProps> = ({
  userName,
  featuredDeal,
  trendingDeals,
  userPreferences,
}) => {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://forward.com'

  return (
    <Html>
      <Head />
      <Preview>Your perfect match: {featuredDeal.name} +{featuredDeal.growth} growth</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Text style={logo}>✨ Forward OS</Text>
            <Text style={headerText}>Weekly Deal Spotlight</Text>
          </Section>

          {/* Greeting */}
          <Section style={content}>
            <Text style={heading}>Hi {userName},</Text>
            <Text style={paragraph}>
              We found a deal that matches your investment criteria. Check it out below.
            </Text>
          </Section>

          {/* Featured Deal */}
          <Section style={featuredSection}>
            <Row>
              <Column style={dealCard}>
                <Text style={dealName}>{featuredDeal.name}</Text>
                <Text style={dealLocation}>📍 {featuredDeal.location}</Text>

                <Section style={metrics}>
                  <Row>
                    <Column style={metricColumn}>
                      <Text style={metricLabel}>Revenue</Text>
                      <Text style={metricValue}>{featuredDeal.revenue}</Text>
                    </Column>
                    <Column style={metricColumn}>
                      <Text style={metricLabel}>Valuation</Text>
                      <Text style={metricValue}>{featuredDeal.valuation}</Text>
                    </Column>
                    <Column style={metricColumn}>
                      <Text style={metricLabel}>Growth</Text>
                      <Text style={metricValue}>{featuredDeal.growth}</Text>
                    </Column>
                  </Row>
                </Section>

                <Button style={primaryButton} href={`${baseUrl}/deal/${featuredDeal.url}`}>
                  View CIM Dashboard →
                </Button>
              </Column>
            </Row>
          </Section>

          <Hr style={divider} />

          {/* Trending Deals */}
          <Section style={content}>
            <Text style={subheading}>Other Deals You Might Like</Text>

            {trendingDeals.map((deal, index) => (
              <Section key={index} style={trendingDeal}>
                <Row>
                  <Column style={{ width: '70%' }}>
                    <Text style={trendingDealName}>{deal.name}</Text>
                    <Text style={trendingDealLocation}>📍 {deal.location}</Text>
                    <Text style={trendingDealValuation}>{deal.valuation} valuation</Text>
                  </Column>
                  <Column style={{ width: '30%', textAlign: 'right' as const }}>
                    <Link href={`${baseUrl}/deal/${deal.url}`} style={secondaryButton}>
                      View →
                    </Link>
                  </Column>
                </Row>
              </Section>
            ))}
          </Section>

          <Hr style={divider} />

          {/* CTA Section */}
          <Section style={ctaSection}>
            <Text style={ctaText}>Want more deals matched to your interests?</Text>
            <Button style={secondaryButtonFullWidth} href={`${baseUrl}/preferences`}>
              Manage Your Preferences
            </Button>
          </Section>

          <Hr style={divider} />

          {/* Footer */}
          <Section style={footer}>
            <Row>
              <Column style={{ width: '50%' }}>
                <Text style={footerText}>
                  © 2026 Forward OS. All rights reserved.
                </Text>
              </Column>
              <Column style={{ width: '50%', textAlign: 'right' as const }}>
                <Link href={userPreferences.preferencesUrl} style={footerLink}>
                  Preferences
                </Link>
                <Text style={footerSeparator}>•</Text>
                <Link href={userPreferences.unsubscribeUrl} style={footerLink}>
                  Unsubscribe
                </Link>
              </Column>
            </Row>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export default WeeklyDealSpotlight

const main = {
  backgroundColor: '#f7f6f4',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
}

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  width: '100%',
  maxWidth: '600px',
}

const header = {
  backgroundColor: '#1a1a1a',
  padding: '24px',
  textAlign: 'center' as const,
  borderRadius: '12px 12px 0 0',
}

const logo = {
  color: '#ff8c00',
  fontSize: '24px',
  fontWeight: '900',
  margin: '0 0 8px 0',
}

const headerText = {
  color: '#ffffff',
  fontSize: '14px',
  fontWeight: '600',
  margin: '0',
}

const content = {
  padding: '24px',
  backgroundColor: '#ffffff',
}

const heading = {
  color: '#1a1a1a',
  fontSize: '20px',
  fontWeight: '700',
  margin: '0 0 12px 0',
}

const paragraph = {
  color: '#6b7280',
  fontSize: '14px',
  lineHeight: '1.6',
  margin: '0 0 16px 0',
}

const subheading = {
  color: '#1a1a1a',
  fontSize: '16px',
  fontWeight: '700',
  margin: '0 0 12px 0',
}

const featuredSection = {
  backgroundColor: '#f7f6f4',
  padding: '24px',
  margin: '20px 24px',
  borderRadius: '12px',
}

const dealCard = {
  backgroundColor: '#ffffff',
  padding: '20px',
  borderRadius: '8px',
  border: '1px solid #e5e4e0',
}

const dealName = {
  color: '#1a1a1a',
  fontSize: '18px',
  fontWeight: '700',
  margin: '0 0 8px 0',
}

const dealLocation = {
  color: '#6b7280',
  fontSize: '14px',
  margin: '0 0 16px 0',
}

const metrics = {
  margin: '16px 0',
}

const metricColumn = {
  textAlign: 'center' as const,
  padding: '8px',
}

const metricLabel = {
  color: '#6b7280',
  fontSize: '12px',
  fontWeight: '600',
  textTransform: 'uppercase' as const,
  margin: '0 0 4px 0',
}

const metricValue = {
  color: '#ff8c00',
  fontSize: '18px',
  fontWeight: '700',
  margin: '0',
}

const primaryButton = {
  backgroundColor: '#ff8c00',
  color: '#ffffff',
  padding: '12px 24px',
  borderRadius: '8px',
  fontWeight: '700',
  fontSize: '14px',
  textDecoration: 'none',
  display: 'inline-block',
  width: '100%',
  textAlign: 'center' as const,
}

const secondaryButton = {
  color: '#ff8c00',
  fontWeight: '700',
  fontSize: '14px',
  textDecoration: 'none',
}

const secondaryButtonFullWidth = {
  backgroundColor: '#f7f6f4',
  color: '#ff8c00',
  padding: '12px 24px',
  borderRadius: '8px',
  fontWeight: '700',
  fontSize: '14px',
  textDecoration: 'none',
  display: 'inline-block',
  width: '100%',
  textAlign: 'center' as const,
  border: '2px solid #ff8c00',
}

const trendingDeal = {
  padding: '12px 0',
  borderBottom: '1px solid #e5e4e0',
}

const trendingDealName = {
  color: '#1a1a1a',
  fontSize: '14px',
  fontWeight: '700',
  margin: '0 0 4px 0',
}

const trendingDealLocation = {
  color: '#6b7280',
  fontSize: '12px',
  margin: '0 0 4px 0',
}

const trendingDealValuation = {
  color: '#ff8c00',
  fontSize: '12px',
  fontWeight: '700',
  margin: '0',
}

const ctaSection = {
  backgroundColor: '#1a1a1a',
  padding: '24px',
  textAlign: 'center' as const,
  color: '#ffffff',
}

const ctaText = {
  color: '#ffffff',
  fontSize: '14px',
  margin: '0 0 16px 0',
}

const divider = {
  borderColor: '#e5e4e0',
  margin: '0',
}

const footer = {
  padding: '24px',
  backgroundColor: '#ffffff',
  borderRadius: '0 0 12px 12px',
}

const footerText = {
  color: '#6b7280',
  fontSize: '12px',
  margin: '0',
}

const footerLink = {
  color: '#ff8c00',
  textDecoration: 'none',
  fontSize: '12px',
}

const footerSeparator = {
  color: '#e5e4e0',
  margin: '0 4px',
  display: 'inline',
}
