'use client'

/**
 * WEEK 3: REDESIGNED DEAL CARD
 * Better visual hierarchy, heat index, improved UX
 */

import React, { useState } from 'react';
import Link from 'next/link';

export interface Deal {
  id: string;
  name: string;
  image?: string;
  industry: string;
  stage: string;
  location: string;
  revenue: number;
  ebitda: number;
  heat: number;
  avgDaysToClose: number;
  status: 'active' | 'closed' | 'pending' | 'at-risk';
}

interface DealCardProps {
  deal: Deal;
  onClick?: () => void;
}

function getHeatColor(heat: number): string {
  if (heat >= 80) return 'text-red-600';
  if (heat >= 60) return 'text-amber-500';
  if (heat >= 40) return 'text-gray-500';
  return 'text-blue-500';
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'active':
    case 'closed':
      return 'bg-green-50 text-green-900';
    case 'pending':
      return 'bg-blue-50 text-blue-900';
    case 'at-risk':
      return 'bg-yellow-50 text-yellow-900';
    default:
      return 'bg-gray-50 text-gray-900';
  }
}

function getStatusLabel(status: string): string {
  switch (status) {
    case 'active':
      return '✓ ACTIVE';
    case 'closed':
      return '✓ CLOSED';
    case 'pending':
      return '⏳ PENDING';
    case 'at-risk':
      return '⚠ AT RISK';
    default:
      return status.toUpperCase();
  }
}

export function DealCardRedesigned({ deal, onClick }: DealCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link href={`/deals/${deal.id}`} className="block">
      <div
        className="bg-white border border-gray-200 rounded-lg overflow-hidden transition-all duration-200 cursor-pointer hover:shadow-lg hover:scale-105"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={onClick}
      >
        {/* IMAGE SECTION */}
        <div className="relative h-40 bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center overflow-hidden">
          <div className="text-5xl">🏢</div>

          {/* Heat Badge */}
          <div className="absolute top-3 right-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full shadow-md">
            <span className="text-base font-bold">🔥</span>
            <span className={`font-bold text-sm ${getHeatColor(deal.heat)}`}>
              {deal.heat}%
            </span>
          </div>
        </div>

        {/* CONTENT SECTION */}
        <div className="p-6 space-y-4">
          {/* TITLE */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 line-clamp-2 mb-1">
              {deal.name}
            </h3>
            <p className="text-sm text-gray-600">
              {deal.industry} • {deal.stage}
            </p>
          </div>

          {/* KEY METRICS */}
          <div className="space-y-3 pb-4 border-b border-gray-200">
            {/* Revenue */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Revenue</span>
              <span className="text-base font-bold text-gray-900">
                ${deal.revenue}M
              </span>
            </div>

            {/* EBITDA */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">EBITDA</span>
              <div className="text-right">
                <span className="text-base font-bold text-gray-900">
                  ${deal.ebitda}M
                </span>
                <p className="text-xs text-gray-600">
                  {((deal.ebitda / deal.revenue) * 100).toFixed(1)}% margin
                </p>
              </div>
            </div>

            {/* Close Time */}
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                📅 Avg Close
              </div>
              <span className="text-base font-bold text-gray-900">
                {deal.avgDaysToClose} days
              </span>
            </div>
          </div>

          {/* LOCATION & INDUSTRY TAGS */}
          <div className="flex flex-wrap gap-2">
            <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-50 text-gray-900 rounded-full text-xs font-medium">
              📍 {deal.location}
            </div>
            <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 text-gray-900 rounded-full text-xs font-medium">
              📈 {deal.stage}
            </div>
          </div>

          {/* STATUS INDICATOR */}
          <div
            className={`text-xs font-semibold py-1.5 px-3 rounded-md text-center ${getStatusColor(
              deal.status
            )}`}
          >
            {getStatusLabel(deal.status)}
          </div>

          {/* CTA BUTTON */}
          <button
            className={`w-full py-2.5 px-4 rounded-md font-semibold text-sm transition-all duration-150 ${
              isHovered
                ? 'bg-teal-700 text-white'
                : 'bg-green-50 text-teal-700'
            }`}
          >
            {isHovered ? 'View Deal Details →' : 'Learn More'}
          </button>
        </div>
      </div>
    </Link>
  );
}

export interface DealCardGridProps {
  deals: Deal[];
  isLoading?: boolean;
  onCardClick?: (dealId: string) => void;
}

export function DealCardGrid({
  deals,
  isLoading,
  onCardClick,
}: DealCardGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array(8)
          .fill(0)
          .map((_, i) => (
            <div
              key={i}
              className="bg-white border border-gray-200 rounded-lg h-96 animate-pulse"
            />
          ))}
      </div>
    );
  }

  if (deals.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg font-semibold text-gray-900 mb-2">
          No deals found
        </p>
        <p className="text-gray-600">
          Try adjusting your filters or search criteria
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {deals.map((deal) => (
        <DealCardRedesigned
          key={deal.id}
          deal={deal}
          onClick={() => onCardClick?.(deal.id)}
        />
      ))}
    </div>
  );
}
