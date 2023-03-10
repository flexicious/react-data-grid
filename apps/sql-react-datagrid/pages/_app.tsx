import '../styles/globals.css'
import type { AppProps } from 'next/app'
import "@euxdt/grid-core/icons.css";
import "@euxdt/grid-core/styles.css";
export default function App({ Component, pageProps: { ...pageProps } }: AppProps) {
  return <Component {...pageProps} />
}
