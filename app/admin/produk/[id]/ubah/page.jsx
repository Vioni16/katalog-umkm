import { notFound } from "next/navigation";
import NavAdmin from "@/components/NavAdmin";
import FormProduk from "@/components/FormProduk";
import { createServerClient } from "@/lib/supabase/server";

export default async function HalamanUbahProduk({ params }) {
  const { id } = await params;
  const db = createServerClient();

  const { data: produk, error } = await db
    .from("produk")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !produk) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />
      <h1 className="text-2xl font-extrabold">Ubah produk</h1>
      <FormProduk produk={produk} labelTombol="Simpan perubahan" />
    </div>
  );
}
