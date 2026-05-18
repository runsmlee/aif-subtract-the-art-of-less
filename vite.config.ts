/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    conditions: ['development'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'vendor';
          }
          // Split large component groups into separate chunks
          if (id.includes('src/components/SubtractionExercise') || id.includes('src/components/SubtractionJournal') || id.includes('src/components/ProgressTracker')) {
            return 'features-interactive';
          }
          if (id.includes('src/components/DailyChallenge') || id.includes('src/components/BeforeAfter') || id.includes('src/components/MindfulBreak')) {
            return 'features-content';
          }
          if (id.includes('src/components/Quote') || id.includes('src/components/Reflection') || id.includes('src/components/Principles')) {
            return 'features-reflection';
          }
        },
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/__tests__/setup.ts',
    css: true,
  },
});
