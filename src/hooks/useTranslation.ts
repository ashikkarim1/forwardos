/**
 * Translation Hook
 * Provides easy access to translated strings in components
 *
 * Usage:
 * const t = useTranslation()
 * t('pricing.title')  // Returns translated string based on current locale
 */

import { useLocale } from '@/context/LocaleContext'
import { t as translateKey } from '@/lib/translations'

export function useTranslation() {
  const { locale } = useLocale()

  /**
   * Translate a key to the current locale
   * Falls back to English if key not found in current locale
   */
  return (key: string): string => {
    return translateKey(key, locale)
  }
}
