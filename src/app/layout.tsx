import "./globals.css";
import Navbar from "@/components/Navbar";
import { Providers } from "@/components/Providers";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "D&D Character Creator",
  description: "Create and manage your D&D characters",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
