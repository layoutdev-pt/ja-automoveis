import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import './index.css'
import App from './App.tsx'

const container = document.getElementById('root')!

const tree = (
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>
)

// Se o HTML já foi pré-renderizado no build, hidratamos em vez de recriar.
if (container.hasChildNodes()) {
  // As tags de SEO injetadas no <head> pelo passo de pré-renderização não
  // pertencem ao React. Removemo-las antes de hidratar para que o React fique
  // dono do <head> e as substitua em cada navegação, em vez de as acumular.
  // Ficam no HTML servido, que é o que os crawlers sem JavaScript leem.
  document.head.querySelectorAll('[data-ssr-head]').forEach(node => node.remove())

  hydrateRoot(container, tree)
} else {
  createRoot(container).render(tree)
}
