'use client'

import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

/**
 * Password input with a built-in show/hide ("peek") toggle. Drop-in replacement
 * for a normal <input type="password"> — accepts all the same props. Manages its
 * own visibility state, so no extra state is needed in the parent form.
 */
export function PasswordInput({
  className = '',
  style,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  const [show, setShow] = useState(false)

  return (
    <div className="relative w-full">
      <input
        {...props}
        type={show ? 'text' : 'password'}
        // reserve room on the right for the eye button
        className={`${className} pr-11`}
        style={style}
      />
      <button
        type="button"
        tabIndex={-1}
        onClick={() => setShow((s) => !s)}
        aria-label={show ? 'Hide password' : 'Show password'}
        title={show ? 'Hide password' : 'Show password'}
        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-700 transition-colors"
      >
        {show ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  )
}
