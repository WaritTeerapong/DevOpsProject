import "./globals.css";

export const metadata = {
  title: "Premier League Stats",
  description: "Live results and league table",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
