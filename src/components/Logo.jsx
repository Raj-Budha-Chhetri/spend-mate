export function Logo() {
  return (
    <div className="logo">
      <span className="logo-mark" aria-hidden="true">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M7 15.6c1 1.1 2.5 1.7 4.2 1.7 2.6 0 4.3-1.3 4.3-3.2 0-1.9-1.3-2.8-3.9-3.3l-1.2-.3c-1.4-.3-2-.7-2-1.5 0-.9.9-1.6 2.2-1.6 1.3 0 2.4.5 3.2 1.4"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path d="M12 4.5v15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </span>
      <span className="logo-word">
        Spend<span className="logo-word-accent">Mate</span>
      </span>
    </div>
  )
}
