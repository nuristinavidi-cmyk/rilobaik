"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<{ name: string; price: number }[]>([]);
  const [loaded, setLoaded] = useState(false);

  // ⛔ Amanin localStorage biar tidak error SSR
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
      setLoaded(true);
    }
  }, []);

  if (!loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  // 🔹 Group item berdasarkan nama
  const grouped = cart.reduce((acc: any, item) => {
    if (!acc[item.name]) {
      acc[item.name] = { ...item, qty: 1 };
    } else {
      acc[item.name].qty += 1;
    }
    return acc;
  }, {});

  const items = Object.values(grouped);

  const total = items.reduce(
    (sum: number, item: any) => sum + item.price * item.qty,
    0
  );

  // 🔸 Hapus hanya 1 item, bukan semua
  const handleRemove = (name: string) => {
    // hapus satu item pertama
    const index = cart.findIndex((item) => item.name === name);
    if (index !== -1) {
      const newCart = [...cart];
      newCart.splice(index, 1); // hapus 1
      setCart(newCart);
      localStorage.setItem("cart", JSON.stringify(newCart));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold text-blue-700 mb-6">🛍️ Checkout</h1>

      <div className="bg-white shadow rounded p-6 w-full max-w-lg">
        <h2 className="text-xl font-semibold mb-4">Daftar Belanja</h2>

        {items.length === 0 ? (
          <p className="text-gray-500">Keranjang kosong.</p>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b">
                <th className="py-2">Produk</th>
                <th className="py-2 text-center">Qty</th>
                <th className="py-2 text-right">Harga</th>
                <th className="py-2 text-right">Subtotal</th>
                <th className="py-2 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item: any, i) => (
                <tr key={i} className="border-b">
                  <td className="py-2">{item.name}</td>
                  <td className="py-2 text-center">{item.qty}</td>
                  <td className="py-2 text-right">
                    Rp {item.price.toLocaleString()}
                  </td>
                  <td className="py-2 text-right">
                    Rp {(item.price * item.qty).toLocaleString()}
                  </td>
                  <td className="py-2 text-center">
                    <button
                      onClick={() => handleRemove(item.name)}
                      className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Hapus 1
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className="mt-4 text-right font-bold text-lg">
          Total: Rp {total.toLocaleString()}
        </div>

        <button
          onClick={() => router.push("/thankyou")}
          disabled={items.length === 0}
          className="mt-6 w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
        >
          Bayar Sekarang
        </button>
      </div>
    </div>
  );
}
