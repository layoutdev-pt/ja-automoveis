import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function ScrollToTop() {
  const { pathname, state } = useLocation();

  useEffect(() => {
    // Só faz scroll para o topo se não houver a flag 'scrollToForm' no estado
    if (!state?.scrollToForm) {
      window.scrollTo(0, 0);
    }
  }, [pathname, state]);

  return null;
}