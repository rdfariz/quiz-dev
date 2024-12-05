import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";

const nunitoFont = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Quizz Dev / Edu",
  description: "Quizz Dev Edu - Website game quiz simpel.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${nunitoFont.variable} --font-nunito antialiased`}
      >
        <div id="background"></div>
        <div className="max-w-screen-md mx-auto min-h-screen flex justify-center flex-col flex-wrap p-2 sm:p-0">
          <div className="bg-white rounded-xl overflow-auto">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
