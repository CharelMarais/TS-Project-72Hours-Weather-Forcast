import { defineConfig } from 'vite';
import FullReload from 'vite-plugin-full-reload';

export default defineConfig({
  plugins: [FullReload(['config/routes.rb', 'app/views/**/*'])],
});
