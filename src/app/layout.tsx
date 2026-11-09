import type { Metadata } from "next";
import { Bungee, Rubik } from "next/font/google";
import "lenis/dist/lenis.css";
import "./globals.css";
import { Providers } from "@/components/Providers";

const display = Bungee({
  variable: "--font-bungee",
  subsets: ["latin"],
  weight: "400",
});
const sans = Rubik({ variable: "--font-rubik", subsets: ["latin"] });

const title = "CV Show | Luka Amiranashvili, full-stack developer";
const description =
  "Skip the CV and interview me instead. Full-stack developer in Tbilisi working with Next.js, TypeScript, Node.js and Flutter.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description, type: "website" },
  twitter: { card: "summary_large_image", title, description },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} h-full antialiased`}
    >
      <head>
        <noscript>
          <style>{".pre-anim{visibility:visible!important}.start-screen{display:none!important}"}</style>
        </noscript>
      </head>
      <body className="min-h-full font-sans text-ink">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
