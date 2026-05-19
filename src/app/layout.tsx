import "./globals.css";
import Navbar from "@/components/Navbar";
import { Providers } from "@/components/Providers";

export const metadata = {
  title: "D&D Character Creator",
  description: "Create and manage your D&D characters",
};

export const dynamic = "force-dynamic";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar key="navbar" />
          <main key="main">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
