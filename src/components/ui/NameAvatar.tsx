import { initials } from '../../lib/format'

const tones = [
  'bg-brand-100 text-brand-700',
  'bg-emerald-100 text-emerald-700',
  'bg-sky-100 text-sky-700',
  'bg-amber-100 text-amber-700',
  'bg-violet-100 text-violet-700',
  'bg-pink-100 text-pink-700',
]

export function NameAvatar({
  name,
  size = 'md',
}: {
  name: string
  size?: 'sm' | 'md' | 'lg'
}) {
  const [first = '', last = ''] = name.trim().split(' ')
  const parts = { firstName: first, lastName: last || first }
  const index = Math.abs([...name].reduce((acc, ch) => acc + ch.charCodeAt(0), 0)) % tones.length

  const sizes = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-9 w-9 text-sm',
    lg: 'h-14 w-14 text-lg',
  }

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-semibold ${sizes[size]} ${tones[index]}`}
      aria-hidden="true"
    >
      {initials(parts)}
    </span>
  )
}