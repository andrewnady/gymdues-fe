declare module 'react-usa-map' {
  interface USAMapProps {
    customize?: Record<string, { fill?: string }>
    defaultFill?: string
    title?: string
    onClick?: (stateAbbreviation: string) => void
    onMouseEnter?: (stateAbbreviation: string) => void
    onMouseLeave?: () => void
  }
  const USAMap: React.ComponentType<USAMapProps>
  export default USAMap
}
