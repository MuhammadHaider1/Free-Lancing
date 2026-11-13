import { cn, initials } from '../../lib/utils'

interface AvatarProps {
  name?: string | null
  src?: string | null
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const sizes = {
  xs: 'h-7 w-7 text-[10px]',
  sm: 'h-9 w-9 text-xs',
  md: 'h-11 w-11 text-sm',
  lg: 'h-14 w-14 text-base',
  xl: 'h-20 w-20 text-2xl',
}

export function Avatar({ name, src, size = 'md', className }: AvatarProps) {
  if (src) {
    return (
      <img
        src={src}
        alt={name ? `${name}'s avatar` : 'User avatar'}
        className={cn('rounded-full object-cover ring-2 ring-white', sizes[size], className)}
      />
    )
  }

  return (
    <span
      className={cn('avatar shrink-0 ring-2 ring-white', sizes[size], className)}
      aria-hidden="true"
    >
      {initials(name)}
    </span>
  )
}

export default Avatar
