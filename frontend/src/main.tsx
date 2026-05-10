import { createRoot } from 'react-dom/client';
import App from '@/adapters/primary/ui/App';
import '@/shared/styles/index.css';

createRoot(document.getElementById('root')!).render(<App />);