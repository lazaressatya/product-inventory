import "./globals.css";

export const metadata = {
  title: "InventoryPro",
  description: "Product Inventory Management"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}