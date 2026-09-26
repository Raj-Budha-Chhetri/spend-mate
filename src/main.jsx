import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Global layers first: tokens, resets, then shared primitives. Component
// stylesheets are imported by the components themselves and therefore land
// after these, so a component rule always wins a specificity tie.
import './styles/tokens.css'
import './styles/base.css'
import './styles/ui.css'

import { App } from './App'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
