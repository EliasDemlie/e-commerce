import { getPaymentStatusColor } from '@/lib/utils'

interface PaymentStatusBadgeProps {
  status: string
}

export function PaymentStatusBadge({ status }: PaymentStatusBadgeProps) {
  const colorClass = getPaymentStatusColor(status)

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}
