import { useEffect, useRef, useState } from 'react'

// Chart.js's own resize() sometimes doesn't shrink the canvas back down after
// its container grows (a known quirk — verified: even calling chart.resize()
// or chart.resize(w, h) directly can leave the canvas at its largest-ever
// size). Forcing a full remount via `key` when the container's width bucket
// changes is the reliable fix: a fresh mount always measures correctly.
export function useChartResize() {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [widthBucket, setWidthBucket] = useState(0)

  useEffect(() => {
    const el = wrapperRef.current
    if (!el) return

    function measure() {
      const width = el!.getBoundingClientRect().width
      if (width) setWidthBucket(Math.round(width / 8) * 8)
    }

    const observer = new ResizeObserver(measure)
    observer.observe(el)
    window.addEventListener('resize', measure)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [])

  return { wrapperRef, chartKey: widthBucket }
}
