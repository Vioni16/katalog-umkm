import NavAdmin from "@/components/NavAdmin";
import TabelProduk from "@/components/TabelProduk";
import Tombol from "@/components/Tombol";
import { createServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function HalamanAdmin() {
  let daftarProduk = [];
  try {
    const db = createServerClient();
    const { data } = await db
      .from("produk")
      .select("*")
      .order("id", { ascending: true });
    daftarProduk = data || [];
  } catch {
    daftarProduk = [];
  }

  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold">Produk</h1>
        <Tombol href="/admin/produk/baru">Tambah produk</Tombol>
      </div>
      <TabelProduk daftarProduk={daftarProduk} />
    </div>
  );
}
