import type { Metadata } from "next";
import { Cairo, Roboto } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import ReduxProvider from "@/provider/ReduxProvider";
import { Locale } from "@/i18n.config";
import { Toaster } from "@/components/ui/toaster";
import SessionProviderContext from "@/provider/SessionProvider";
import Footer from "@/components/footer";


const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  preload: true,
});

const cairo = Cairo({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  preload: true,
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: { locale: Locale };
}>) {

  const locale = (await params).locale;

  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"} cz-shortcut-listen="true">
      <body className={locale === "ar" ? cairo.className : roboto.className}>
        <SessionProviderContext>
          <ReduxProvider>
            <Header />
            {children}
            <Footer />
            <Toaster />
          </ReduxProvider>
        </SessionProviderContext>
      </body>
    </html>
  );
}
