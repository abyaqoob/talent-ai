import { RouterProvider } from 'react-router';
import { router } from '../routes/routes';
import { ThemeProvider } from './components/ThemeProvider';
import { AuthProvider } from '@/presentation/context/AuthContext';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ThemeProvider>
  );
}