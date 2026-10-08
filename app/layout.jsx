import '@fontsource/manrope/latin-400.css';
import '@fontsource/manrope/latin-ext-400.css';
import '@fontsource/manrope/latin-500.css';
import '@fontsource/manrope/latin-ext-500.css';
import '@fontsource/manrope/latin-600.css';
import '@fontsource/manrope/latin-ext-600.css';
import '@fontsource/manrope/latin-700.css';
import '@fontsource/manrope/latin-ext-700.css';
import '@fontsource/lora/latin-400.css';
import '@fontsource/lora/latin-ext-400.css';
import '@fontsource/lora/latin-400-italic.css';
import '@fontsource/lora/latin-ext-400-italic.css';
import './globals.css';

export const metadata = {
  title: 'Vita — Sağlamlığınıza bir az daha qayğı',
  description: 'Sağlamlığınıza diqqətlə yanaşın. Müayinə, diaqnostika və fərdi qayğı ilə tanış olun.',
};

export default function RootLayout({ children }) {
  return <html lang="az"><body>{children}</body></html>;
}
