import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dogs Trust Home Check",
  description: "Dogs Trust home check",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
