import logoSvg from '../../../assets/brand/routemate-logo.svg?raw'

// Inlined so the wordmark can follow the in-app light/dark switch (an <img> only
// sees the device setting). The file's own dark-mode style, size and title are dropped;
// --color-brand-ink colours the lettering instead.
const markup = logoSvg
  .replace(/<style>[\s\S]*?<\/style>/, '')
  .replace(/<title[\s\S]*?<\/title>/, '')
  .replace(/<svg[^>]*>/, (tag) => tag.replace(/\s(width|height|role|aria-labelledby)="[^"]*"/g, ''))

export function Brand({ decorative = false }: { decorative?: boolean }) {
  return (
    <span
      className="logo__wordmark"
      role={decorative ? undefined : 'img'}
      aria-label={decorative ? undefined : 'Routemate'}
      aria-hidden={decorative || undefined}
      dangerouslySetInnerHTML={{ __html: markup }}
    />
  )
}
