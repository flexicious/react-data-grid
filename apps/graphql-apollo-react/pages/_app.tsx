import '../styles/globals.css'
import type { AppProps } from 'next/app'

import "@ezgrid/grid-core/icons.css";
import "@ezgrid/grid-core/styles.css";
export default function App({ Component, pageProps: { ...pageProps } }: AppProps) {
  return <Component {...pageProps} />
}
