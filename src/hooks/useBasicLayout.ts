import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'

export function useBasicLayout() {
  const breakpoints = useBreakpoints(breakpointsTailwind)
  const isMobile = breakpoints.smaller('sm')
  const isTablet = breakpoints.smaller('md')
  const isDesktop = breakpoints.smaller('lg')
  const isLargeDesktop = breakpoints.greater('2xl')

  return { isMobile, isTablet, isDesktop, isLargeDesktop }
}
