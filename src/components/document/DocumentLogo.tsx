interface DocumentLogoProps {
  src: string
  alt?: string
  className?: string
}

export function DocumentLogo({ src, alt = 'Bhavana Studio', className = '' }: DocumentLogoProps) {
  return (
    <img
      src={src}
      alt={alt}
      className={`mx-auto object-contain ${className}`}
      style={{ maxHeight: '96px', width: 'auto' }}
    />
  )
}
