'use client'

import { motion } from 'framer-motion'
import { CheckCircle2, Shield, Brain, Zap, Users, Lock, AlertTriangle, BarChart3, Workflow } from 'lucide-react'
import { FeatureIcon } from '@/components/Icons/FeatureIcons'
import { COLOR_PRIMARY, COLOR_ACCENT, COLOR_TEXT_SECONDARY, COLOR_BORDER, COLOR_SURFACE_SUCCESS } from '@/styles/forward-colors'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function DiligencePage() {
  return (
    <motion.div
      className="max-w-7xl mx-auto px-6 py-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-12 flex items-start gap-4">
        <FeatureIcon name="security" size={64} />
        <div>
          <h1 className="text-5xl font-black mb-2" style={{ color: COLOR_PRIMARY }}>
            Advanced Diligence & Compliance
          </h1>
          <p className="text-xl" style={{ color: COLOR_TEXT_SECONDARY }}>
            The world's most advanced KYC/AML system. Better than traditional vendors. Faster, smarter, automated.
          </p>
        </div>
      </motion.div>

      {/* Key Stats */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
        variants={containerVariants}
      >
        {[
          { label: 'Compliance Checklists', value: '40% faster', icon: CheckCircle2, color: COLOR_ACCENT },
          { label: 'Due Diligence Cycle', value: '2 weeks ahead', icon: Zap, color: '#10b981' },
          { label: 'KYC Accuracy', value: '99.2%', icon: Shield, color: '#1D4ED8' },
          { label: 'Advisor Teams', value: '10-person auto-orchestration', icon: Users, color: '#B45309' },
        ].map((stat) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.label}
              variants={itemVariants}
              className="p-6 rounded-lg border"
              style={{ borderColor: COLOR_BORDER, background: 'white' }}
              whileHover={{ y: -4 }}
            >
              <Icon className="w-6 h-6 mb-3" style={{ color: stat.color }} />
              <p className="text-xs font-medium mb-2" style={{ color: COLOR_TEXT_SECONDARY }}>
                {stat.label}
              </p>
              <p className="text-2xl font-black" style={{ color: stat.color }}>
                {stat.value}
              </p>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Why Forward's Diligence is Unbeatable */}
      <motion.section variants={itemVariants} className="mb-12">
        <div className="flex items-center gap-4 mb-8">
          <FeatureIcon name="trends" size={48} />
          <h2 className="text-3xl font-black" style={{ color: COLOR_PRIMARY }}>
            Why Forward Diligence is Superior
          </h2>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          variants={containerVariants}
        >
          {[
            {
              title: 'Traditional KYC Vendors',
              icon: 'risk',
              items: [
                'Manual document collection',
                '4-6 week turnaround',
                'Generic templates',
                'Limited to AML/sanctions',
                'Siloed from deal data',
                'No integration planning',
              ],
              isOld: true,
            },
            {
              title: 'Forward Diligence',
              icon: 'success',
              items: [
                'Auto-pulled from 50+ sources',
                '2-week turnaround (40% faster)',
                'Deal-specific compliance plans',
                'Full KYC + fraud prevention + synergy planning',
                'Integrated with heat maps & predictions',
                '✓ Auto-generates integration playbooks',
              ],
            },
          ].map((comparison) => (
            <motion.div
              key={comparison.title}
              variants={itemVariants}
              className="p-8 rounded-lg border"
              style={{
                borderColor: COLOR_BORDER,
                background: !comparison.isOld ? '#F0FDF4' : '#FEF2F2',
              }}
            >
              <div className="flex items-center gap-3 mb-6">
                <FeatureIcon name={comparison.icon as any} size={32} />
                <h3
                  className="text-2xl font-black"
                  style={{ color: COLOR_PRIMARY }}
                >
                  {comparison.title}
                </h3>
              </div>
              <ul className="space-y-3">
                {comparison.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3"
                    style={{ color: COLOR_TEXT_SECONDARY }}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 16 16"
                      fill="none"
                      className="mt-0.5 flex-shrink-0"
                      style={{
                        stroke: !comparison.isOld ? '#10B981' : '#EF4444',
                      }}
                    >
                      {!comparison.isOld ? (
                        <polyline points="3 8 6 11 13 4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      ) : (
                        <>
                          <line x1="4" y1="4" x2="12" y2="12" strokeWidth="2" strokeLinecap="round" />
                          <line x1="12" y1="4" x2="4" y2="12" strokeWidth="2" strokeLinecap="round" />
                        </>
                      )}
                    </svg>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* 7 Pillars of Advanced Diligence */}
      <motion.section variants={itemVariants} className="mb-12">
        <div className="flex items-center gap-4 mb-8">
          <FeatureIcon name="dataRoom" size={48} />
          <h2 className="text-3xl font-black" style={{ color: COLOR_PRIMARY }}>
            The 7 Pillars of Forward Diligence
          </h2>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          variants={containerVariants}
        >
          {[
            {
              number: '1',
              pillar: 'Automated KYC/AML',
              description: 'Real-time sanctions screening, beneficial ownership verification, PEP (Politically Exposed Person) detection',
              features: [
                'OFAC, UN, EU sanctions list screening (real-time)',
                'UBO (Ultimate Beneficial Owner) verification via public records',
                'PEP database cross-referencing',
                'High-risk jurisdiction detection',
                '99.2% accuracy on match validation',
              ],
            },
            {
              number: '2',
              pillar: 'Seller Verification System',
              description: 'Anti-fraud verification preventing 95% of fake or problematic sellers',
              features: [
                'Company legitimacy scoring',
                'Financial health verification',
                'Legal/regulatory issue detection',
                'Litigation history analysis',
                'Bankruptcy/restructuring flags',
              ],
            },
            {
              number: '3',
              pillar: 'Financial Diligence Automation',
              description: 'Auto-analyzed financials, SEC filings, tax returns, loan documents',
              features: [
                'Revenue quality analysis',
                'EBITDA normalization (auto-calculated)',
                'Working capital requirements',
                'Debt schedule verification',
                'Customer concentration risk',
              ],
            },
            {
              number: '4',
              pillar: 'Legal & IP Diligence',
              description: 'Automated contract analysis, IP portfolio verification, regulatory compliance checks',
              features: [
                'Material contract flagging',
                'IP ownership verification',
                'Regulatory compliance status',
                'Environmental liability screening',
                'Employment law violations',
              ],
            },
            {
              number: '5',
              pillar: 'Compliance Checklist Generation',
              description: '40% faster than manual - auto-generated deal-specific compliance roadmaps',
              features: [
                'Industry-specific requirements',
                'Regulatory timeline planning',
                'Approval workflow automation',
                'Document collection prioritization',
                'Risk-based focus areas',
              ],
            },
            {
              number: '6',
              pillar: 'Advisor Team Orchestration',
              description: 'Automatically manage & coordinate 10-person advisor teams (lawyers, accountants, bankers)',
              features: [
                'Task auto-assignment based on expertise',
                'Timeline synchronization',
                'Real-time status dashboards',
                'Bottleneck identification',
                'Cost optimization recommendations',
              ],
            },
            {
              number: '7',
              pillar: 'Integration Playbook Generation',
              description: 'Auto-generate post-close 100-day integration plans with synergy tracking',
              features: [
                'Day-1 readiness checklist',
                'Department-by-department plans',
                'Key talent retention strategies',
                'Systems integration roadmap',
                'Synergy realization tracking',
              ],
            },
          ].map((pillar) => (
            <motion.div
              key={pillar.pillar}
              variants={itemVariants}
              className="p-6 rounded-lg border hover:shadow-lg transition-all"
              style={{ borderColor: COLOR_BORDER, background: 'white' }}
              whileHover={{ y: -4 }}
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold flex-shrink-0">{pillar.number}</div>
                <div>
                  <h3 className="text-lg font-black" style={{ color: COLOR_PRIMARY }}>
                    {pillar.pillar}
                  </h3>
                  <p className="text-sm mt-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                    {pillar.description}
                  </p>
                </div>
              </div>

              <ul className="space-y-2 border-t pt-4" style={{ borderColor: COLOR_BORDER }}>
                {pillar.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2 text-sm"
                    style={{ color: COLOR_TEXT_SECONDARY }}
                  >
                    <span style={{ color: COLOR_ACCENT }}>→</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* Real-Time Monitoring */}
      <motion.section variants={itemVariants} className="mb-12">
        <h2 className="text-3xl font-black mb-8 flex items-center gap-3" style={{ color: COLOR_PRIMARY }}>
          <FeatureIcon name="security" size={40} />
          Real-Time Monitoring & Alerts
        </h2>

        <div className="space-y-6">
          {[
            {
              monitor: 'Seller Watch List',
              what: 'Continuous monitoring for legal/regulatory changes',
              alert: 'NEW lawsuit filed against seller',
              action: 'Escalate to legal team, assess materiality',
            },
            {
              monitor: 'Financial Health',
              what: 'Quarterly financial metric tracking',
              alert: 'EBITDA down 25% YoY (material change)',
              action: 'Re-baseline financials, assess earn-out risk',
            },
            {
              monitor: 'Regulatory Compliance',
              what: 'Ongoing regulatory filing monitoring',
              alert: 'OSHA violation filed against target',
              action: 'Investigate, assess remediation costs',
            },
            {
              monitor: 'Key Person Risk',
              what: 'Track critical employee departures',
              alert: 'CEO/CTO just updated LinkedIn "open to opportunities"',
              action: 'Activate retention bonus, plan for succession',
            },
          ].map((item) => (
            <motion.div
              key={item.monitor}
              variants={itemVariants}
              className="p-6 rounded-lg border"
              style={{ borderColor: COLOR_BORDER, background: 'white' }}
              whileHover={{ y: -2 }}
            >
              <div className="flex items-start gap-4">
                <AlertTriangle className="w-6 h-6" style={{ color: COLOR_ACCENT }} />
                <div className="flex-1">
                  <h3 className="font-bold mb-2" style={{ color: COLOR_PRIMARY }}>
                    {item.monitor}
                  </h3>
                  <p className="text-sm mb-3" style={{ color: COLOR_TEXT_SECONDARY }}>
                    <strong>What we monitor:</strong> {item.what}
                  </p>
                  <div
                    className="p-3 rounded mb-3 text-sm"
                    style={{
                      background: '#fff3cd',
                      color: '#856404',
                      borderLeft: `3px solid #ffc107`,
                    }}
                  >
                    <strong>Example Alert:</strong> {item.alert}
                  </div>
                  <p className="text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
                    <strong>Action:</strong> {item.action}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Post-Close Diligence */}
      <motion.section variants={itemVariants}>
        <h2 className="text-3xl font-black mb-8 flex items-center gap-3" style={{ color: COLOR_PRIMARY }}>
          <CheckCircle2 className="w-8 h-8" style={{ color: '#10B981' }} />
          Post-Close Diligence & Outcome Tracking
        </h2>

        <div
          className="p-8 rounded-lg border"
          style={{
            borderColor: COLOR_BORDER,
            background: COLOR_SURFACE_SUCCESS,
          }}
        >
          <p className="mb-6" style={{ color: COLOR_TEXT_SECONDARY }}>
            Forward doesn't stop at close. We track and verify every promised outcome:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {[
              {
                metric: 'Revenue Run-Rate',
                tracking: 'Monthly verification vs. forecast',
                target: '95%+ of forecast achieved',
              },
              {
                metric: 'EBITDA Accretion',
                tracking: 'Cost synergy realization tracking',
                target: '85%+ of synergies realized in Y1',
              },
              {
                metric: 'Key Person Retention',
                tracking: 'Management team stability',
                target: '90%+ of critical staff retained in Y2',
              },
              {
                metric: 'Integration Milestones',
                tracking: 'System consolidation, process alignment',
                target: '100-day integration plan completion',
              },
            ].map((item) => (
              <div key={item.metric} className="p-4 rounded-lg" style={{ background: 'rgba(255,255,255,0.5)' }}>
                <p className="text-sm font-bold mb-1" style={{ color: COLOR_ACCENT }}>
                  {item.metric}
                </p>
                <p className="text-xs mb-2" style={{ color: COLOR_TEXT_SECONDARY }}>
                  {item.tracking}
                </p>
                <p className="text-xs font-semibold" style={{ color: COLOR_PRIMARY }}>
                  Target: {item.target}
                </p>
              </div>
            ))}
          </div>

          <p style={{ color: COLOR_TEXT_SECONDARY }}>
            💡 <strong>Why This Matters:</strong> Forward is the only platform that tracks outcomes permanently. Every deal teaches the system. Every synergy miss is analyzed. Every success is replicated. Over time, Forward's diligence gets smarter with every deal.
          </p>
        </div>
      </motion.section>
    </motion.div>
  )
}
