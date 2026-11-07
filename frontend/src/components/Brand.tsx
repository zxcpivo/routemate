import logo from '../../../assets/brand/routemate-logo.svg'

export function Brand({ decorative = false }: { decorative?: boolean }) {
  return <img className="logo__wordmark" src={logo} alt={decorative ? '' : 'Routemate'} />
}
