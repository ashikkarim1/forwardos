/**
 * WEEK 1: SKELETON LOADING COMPONENTS
 * 8 variants for different UI patterns
 *
 * Usage:
 * import { CardSkeleton, TableSkeleton, DealDetailSkeleton } from '@/components/Skeleton'
 */

import React from 'react';

// ============================================
// GENERIC SKELETON
// ============================================

interface SkeletonProps {
  className?: string;
  count?: number;
}

export function Skeleton({ className = '', count = 1 }: SkeletonProps) {
  return (
    <>
      {Array(count)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            role="status"
            aria-label="Loading"
            className={`h-4 bg-gradient-to-r from-[#f3f4f6] via-[#e5e7eb] to-[#f3f4f6] rounded animate-pulse ${className}`}
            style={{
              backgroundSize: '200% 100%',
              animation: 'shimmer 2s infinite',
            }}
          />
        ))}
    </>
  );
}

// ============================================
// CARD SKELETON
// ============================================

export function CardSkeleton() {
  return (
    <div className="bg-white border border-[#e5e7eb] rounded-lg overflow-hidden">
      {/* Image */}
      <div className="h-40 bg-gradient-to-r from-[#f3f4f6] via-[#e5e7eb] to-[#f3f4f6] animate-pulse" />

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Title */}
        <div className="space-y-2">
          <div className="h-6 bg-gradient-to-r from-[#f3f4f6] via-[#e5e7eb] to-[#f3f4f6] rounded animate-pulse w-3/4" />
          <div className="h-4 bg-gradient-to-r from-[#f3f4f6] via-[#e5e7eb] to-[#f3f4f6] rounded animate-pulse w-1/2" />
        </div>

        {/* Metrics */}
        <div className="space-y-3 pb-4 border-b border-[#e5e7eb]">
          <div className="flex justify-between">
            <div className="h-4 bg-gradient-to-r from-[#f3f4f6] via-[#e5e7eb] to-[#f3f4f6] rounded animate-pulse w-1/4" />
            <div className="h-4 bg-gradient-to-r from-[#f3f4f6] via-[#e5e7eb] to-[#f3f4f6] rounded animate-pulse w-1/4" />
          </div>
          <div className="flex justify-between">
            <div className="h-4 bg-gradient-to-r from-[#f3f4f6] via-[#e5e7eb] to-[#f3f4f6] rounded animate-pulse w-1/4" />
            <div className="h-4 bg-gradient-to-r from-[#f3f4f6] via-[#e5e7eb] to-[#f3f4f6] rounded animate-pulse w-1/4" />
          </div>
        </div>

        {/* Tags */}
        <div className="flex gap-2">
          <div className="h-6 bg-gradient-to-r from-[#f3f4f6] via-[#e5e7eb] to-[#f3f4f6] rounded-full animate-pulse w-20" />
          <div className="h-6 bg-gradient-to-r from-[#f3f4f6] via-[#e5e7eb] to-[#f3f4f6] rounded-full animate-pulse w-20" />
        </div>

        {/* Button */}
        <div className="h-10 bg-gradient-to-r from-[#f3f4f6] via-[#e5e7eb] to-[#f3f4f6] rounded animate-pulse" />
      </div>
    </div>
  );
}

// ============================================
// TABLE SKELETON
// ============================================

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
}

export function TableSkeleton({ rows = 5, columns = 5 }: TableSkeletonProps) {
  return (
    <div className="border border-[#e5e7eb] rounded-lg overflow-hidden">
      <table className="w-full">
        {/* Header */}
        <thead className="bg-[#f9fafb] border-b border-[#e5e7eb]">
          <tr>
            {Array(columns)
              .fill(0)
              .map((_, i) => (
                <th key={i} className="px-4 py-3">
                  <div className="h-4 bg-gradient-to-r from-[#f3f4f6] via-[#e5e7eb] to-[#f3f4f6] rounded animate-pulse" />
                </th>
              ))}
          </tr>
        </thead>

        {/* Body */}
        <tbody>
          {Array(rows)
            .fill(0)
            .map((_, rowIdx) => (
              <tr
                key={rowIdx}
                className={`border-b border-[#e5e7eb] ${
                  rowIdx % 2 === 0 ? 'bg-white' : 'bg-[#f9fafb]'
                }`}
              >
                {Array(columns)
                  .fill(0)
                  .map((_, colIdx) => (
                    <td key={colIdx} className="px-4 py-3">
                      <div className="h-4 bg-gradient-to-r from-[#f3f4f6] via-[#e5e7eb] to-[#f3f4f6] rounded animate-pulse" />
                    </td>
                  ))}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

// ============================================
// DEAL DETAIL SKELETON
// ============================================

export function DealDetailSkeleton() {
  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex gap-2">
        {Array(3)
          .fill(0)
          .map((_, i) => (
            <React.Fragment key={i}>
              <div className="h-4 bg-gradient-to-r from-[#f3f4f6] via-[#e5e7eb] to-[#f3f4f6] rounded animate-pulse w-16" />
              {i < 2 && <div className="w-4" />}
            </React.Fragment>
          ))}
      </div>

      {/* Heading */}
      <div className="space-y-2">
        <div className="h-8 bg-gradient-to-r from-[#f3f4f6] via-[#e5e7eb] to-[#f3f4f6] rounded animate-pulse w-2/3" />
        <div className="h-4 bg-gradient-to-r from-[#f3f4f6] via-[#e5e7eb] to-[#f3f4f6] rounded animate-pulse w-1/3" />
      </div>

      {/* Main content area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white border border-[#e5e7eb] rounded-lg p-6 space-y-4">
            <div className="h-6 bg-gradient-to-r from-[#f3f4f6] via-[#e5e7eb] to-[#f3f4f6] rounded animate-pulse" />
            <div className="space-y-3">
              {Array(4)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="h-4 bg-gradient-to-r from-[#f3f4f6] via-[#e5e7eb] to-[#f3f4f6] rounded animate-pulse" />
                ))}
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-[#e5e7eb] rounded-lg p-6 space-y-4">
            {Array(6)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="h-4 bg-gradient-to-r from-[#f3f4f6] via-[#e5e7eb] to-[#f3f4f6] rounded animate-pulse" />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// FORM SKELETON
// ============================================

interface FormSkeletonProps {
  fields?: number;
}

export function FormSkeleton({ fields = 4 }: FormSkeletonProps) {
  return (
    <form className="space-y-4">
      {Array(fields)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 bg-gradient-to-r from-[#f3f4f6] via-[#e5e7eb] to-[#f3f4f6] rounded animate-pulse w-24" />
            <div className="h-10 bg-gradient-to-r from-[#f3f4f6] via-[#e5e7eb] to-[#f3f4f6] rounded animate-pulse" />
          </div>
        ))}
      <div className="h-10 bg-gradient-to-r from-[#f3f4f6] via-[#e5e7eb] to-[#f3f4f6] rounded animate-pulse w-32" />
    </form>
  );
}

// ============================================
// TEXT SKELETON
// ============================================

interface TextSkeletonProps {
  lines?: number;
}

export function TextSkeleton({ lines = 3 }: TextSkeletonProps) {
  return (
    <div className="space-y-3">
      {Array(lines)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            className={`h-4 bg-gradient-to-r from-[#f3f4f6] via-[#e5e7eb] to-[#f3f4f6] rounded animate-pulse ${
              i === lines - 1 ? 'w-3/4' : 'w-full'
            }`}
          />
        ))}
    </div>
  );
}

// ============================================
// AVATAR SKELETON
// ============================================

interface AvatarSkeletonProps {
  size?: 'sm' | 'md' | 'lg';
}

export function AvatarSkeleton({ size = 'md' }: AvatarSkeletonProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  return (
    <div
      className={`${sizeClasses[size]} bg-gradient-to-r from-[#f3f4f6] via-[#e5e7eb] to-[#f3f4f6] rounded-full animate-pulse`}
    />
  );
}

// ============================================
// GRID SKELETON
// ============================================

interface GridSkeletonProps {
  columns?: number;
  rows?: number;
}

export function GridSkeleton({ columns = 4, rows = 2 }: GridSkeletonProps) {
  return (
    <div
      className={`grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-${columns}`}
    >
      {Array(columns * rows)
        .fill(0)
        .map((_, i) => (
          <CardSkeleton key={i} />
        ))}
    </div>
  );
}

/**
 * USAGE EXAMPLES:
 *
 * import {
 *   CardSkeleton,
 *   TableSkeleton,
 *   DealDetailSkeleton,
 *   FormSkeleton,
 *   GridSkeleton,
 * } from '@/components/Skeleton'
 *
 * // Deal card loading
 * <CardSkeleton />
 *
 * // Financial table loading
 * <TableSkeleton rows={5} columns={8} />
 *
 * // Deal detail page loading
 * <DealDetailSkeleton />
 *
 * // Form loading
 * <FormSkeleton fields={6} />
 *
 * // Grid of cards loading
 * <GridSkeleton columns={4} rows={2} />
 */
