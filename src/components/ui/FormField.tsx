import type { InputHTMLAttributes, ReactNode } from 'react'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { cn } from '@/lib/cn'

export interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  hint?: ReactNode
  requiredMark?: boolean
}

export function FormField({
  id,
  label,
  error,
  hint,
  requiredMark,
  className,
  ...inputProps
}: FormFieldProps) {
  const fieldId = id ?? inputProps.name

  return (
    <div className={cn('w-full', className)}>
      <Label htmlFor={fieldId} requiredMark={requiredMark}>
        {label}
      </Label>
      <Input
        id={fieldId}
        hasError={Boolean(error)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${fieldId}-error` : undefined}
        {...inputProps}
      />
      {error ? (
        <p id={`${fieldId}-error`} className="mt-1.5 text-sm text-danger" role="alert">
          {error}
        </p>
      ) : null}
      {!error && hint ? (
        <p className="mt-1.5 text-sm text-muted">{hint}</p>
      ) : null}
    </div>
  )
}
