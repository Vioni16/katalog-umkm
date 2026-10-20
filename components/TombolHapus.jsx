"use client";

import Tombol from "@/components/Tombol";

export default function TombolHapus() {
  return (
    <Tombol
      type="submit"
      varian="bahaya"
      onClick={(e) => {
        if (!confirm("Hapus produk ini?")) {
          e.preventDefault();
        }
      }}
    >
      Hapus
    </Tombol>
  );
}

