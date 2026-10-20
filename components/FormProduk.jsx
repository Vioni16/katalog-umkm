"use client";

import { useActionState } from "react";
import Input from "@/components/Input";
import Tombol from "@/components/Tombol";
import { simpanProduk } from "@/app/admin/actions";

// Dipakai untuk tambah produk (US-08) dan ubah produk (US-09).
// Nama field sama dengan kolom tabel "produk".
export default function FormProduk({ produk = {}, labelTombol }) {
  const [state, formAction, isPending] = useActionState(simpanProduk, null);
  const values = state?.values || produk;

  return (
    <form action={formAction} className="flex max-w-xl flex-col gap-4">
      {values.id && <input type="hidden" name="id" value={values.id} />}

      <div>
        <Input
          key={`nama-${state ? "err" : "init"}`}
          label="Nama produk"
          name="nama"
          defaultValue={values.nama ?? ""}
          required
        />
        {state?.errors?.nama && (
          <p className="mt-1 text-xs text-bahaya">{state.errors.nama}</p>
        )}
      </div>

      <div>
        <Input
          key={`harga-${state ? "err" : "init"}`}
          label="Harga (Rp)"
          name="harga"
          type="number"
          min="0"
          defaultValue={values.harga ?? ""}
          required
        />
        {state?.errors?.harga && (
          <p className="mt-1 text-xs text-bahaya">{state.errors.harga}</p>
        )}
      </div>

      <div>
        <Input
          key={`kategori-${state ? "err" : "init"}`}
          label="Kategori"
          name="kategori"
          defaultValue={values.kategori ?? ""}
        />
      </div>

      <div>
        <Input
          key={`foto_url-${state ? "err" : "init"}`}
          label="Link foto"
          name="foto_url"
          placeholder="https://... atau /produk/nama-file.svg"
          defaultValue={values.foto_url ?? ""}
        />
      </div>

      <div>
        <Input
          key={`deskripsi-${state ? "err" : "init"}`}
          label="Deskripsi"
          name="deskripsi"
          textarea
          defaultValue={values.deskripsi ?? ""}
        />
      </div>

      {state?.errors?.general && (
        <p className="rounded-lg border border-garis bg-permukaan p-3 text-sm text-bahaya">
          {state.errors.general}
        </p>
      )}

      <div className="flex gap-3">
        <Tombol type="submit" disabled={isPending}>
          {isPending ? "Menyimpan..." : labelTombol}
        </Tombol>
        <Tombol href="/admin" varian="garis">
          Batal
        </Tombol>
      </div>
    </form>
  );
}
