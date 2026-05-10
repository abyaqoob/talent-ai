import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';

export function BackButton() {
  const navigate = useNavigate();

  return (
    <motion.button
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ x: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate(-1)}
      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-200"
      style={{
        background: 'rgba(5, 150, 105, 0.1)',
        border: '1px solid rgba(5, 150, 105, 0.3)',
        color: 'var(--accent-primary)',
        fontWeight: 500,
      }}
    >
      <ArrowLeft className="w-5 h-5" />
      <span>Back</span>
    </motion.button>
  );
}
