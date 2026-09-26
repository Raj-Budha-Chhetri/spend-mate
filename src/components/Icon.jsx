/**
 * A small hand-rolled icon set. Every glyph is drawn on the same 24×24 grid
 * with a 1.75 stroke, which keeps them optically consistent without pulling in
 * an icon package.
 */

const PATHS = {
  // Navigation
  grid: 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z',
  receipt: 'M6 3h12v18l-3-2-3 2-3-2-3 2zM9 8h6M9 12h6M9 16h4',
  chart: 'M4 20V10M10 20V4M16 20v-7M22 20H2',
  sliders: 'M4 6h10M18 6h2M4 12h4M12 12h8M4 18h10M18 18h2M14 6v0M8 12v0M14 18v0',
  wallet: 'M3 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v1M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-3M21 14h-4a2 2 0 0 1 0-4h4z',
  target: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2z',

  // Actions
  plus: 'M12 5v14M5 12h14',
  search: 'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM20 20l-4-4',
  trash: 'M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3',
  pencil: 'M4 20h4L19 9a2.5 2.5 0 0 0-3.5-3.5L4 16.5z',
  close: 'M6 6l12 12M18 6L6 18',
  download: 'M12 3v12M7 11l5 5 5-5M4 20h16',
  upload: 'M12 16V4M7 8l5-5 5 5M4 20h16',
  check: 'M4 12.5l5 5L20 6.5',

  // Indicators
  sun: 'M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10zM12 2v2M12 20v2M4.2 4.2l1.5 1.5M18.3 18.3l1.5 1.5M2 12h2M20 12h2M4.2 19.8l1.5-1.5M18.3 5.7l1.5-1.5',
  moon: 'M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z',
  monitor: 'M3 5h18v11H3zM8 20h8M12 16v4',
  arrowUp: 'M12 19V5M6 11l6-6 6 6',
  arrowDown: 'M12 5v14M6 13l6 6 6-6',
  chevronLeft: 'M14.5 5.5L8 12l6.5 6.5',
  chevronRight: 'M9.5 5.5L16 12l-6.5 6.5',
  chevronDown: 'M5.5 9.5L12 16l6.5-6.5',
  alert: 'M12 3l9.5 17H2.5zM12 10v4M12 17.5v0',
  info: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 11v6M12 7.5v0',
  inbox: 'M3 13h5l1.5 3h5L16 13h5M3 13l3-8h12l3 8v6H3z',
  menu: 'M4 7h16M4 12h16M4 17h16',
  sparkle: 'M12 3l1.9 5.6L19.5 10l-5.6 1.9L12 17.5l-1.9-5.6L4.5 10l5.6-1.4z',

  // Categories
  cup: 'M4 8h13v6a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5zM17 9h2a2.5 2.5 0 0 1 0 5h-2M7 2.5v2M11 2.5v2',
  basket: 'M3 9h18l-2 10H5zM8 9l2-5M16 9l-2-5M10 13v3M14 13v3',
  car: 'M5 16h14M4 16v3M20 16v3M3 12l2-5h14l2 5v4H3zM7.5 12.5v0M16.5 12.5v0',
  home: 'M4 11l8-7 8 7M6 10v10h12V10M10 20v-6h4v6',
  bolt: 'M13 3L5 13.5h6L11 21l8-10.5h-6z',
  bag: 'M5 8h14l1 12H4zM9 8V6a3 3 0 0 1 6 0v2',
  heart: 'M12 20S3.5 14.5 3.5 9A4.5 4.5 0 0 1 12 6.8 4.5 4.5 0 0 1 20.5 9c0 5.5-8.5 11-8.5 11z',
  play: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM10 8.5l6 3.5-6 3.5z',
  book: 'M5 4h9a3 3 0 0 1 3 3v13H8a3 3 0 0 0-3 3zM17 7h2v13h-2',
  dots: 'M6 12v0M12 12v0M18 12v0',
  briefcase: 'M3 8h18v12H3zM8 8V5h8v3M3 13h18',
  laptop: 'M5 6h14v10H5zM2 19h20',
  trending: 'M4 16l5-5 3 3 6-7M14 7h5v5',
  gift: 'M3 11h18v9H3zM3 8h18v3H3zM12 8v12M12 8S9 8 8 7a2 2 0 1 1 4-1 2 2 0 1 1 4 1c-1 1-4 1-4 1z',
}

// Icons whose visual weight is carried by a filled shape rather than a line.
const DOT_ICONS = new Set(['dots'])

export function Icon({ name, size = 18, strokeWidth = 1.75, className, ...rest }) {
  const path = PATHS[name]
  if (!path) return null

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={DOT_ICONS.has(name) ? 2.5 : strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
      {...rest}
    >
      <path d={path} />
    </svg>
  )
}
