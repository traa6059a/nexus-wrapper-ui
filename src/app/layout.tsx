import { ColorModeScript, theme } from '@chakra-ui/react'
import { fonts } from './fonts'
import { Providers } from './providers'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode,
}) {
  return (
    <html lang='en' className={fonts.rubik.variable}>
      <body>
        <Providers>{children}</Providers>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      </body>
    </html>
  )
}
