"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createSessionClient } from "@/lib/supabase/session";
import { createAuthClient } from "@/lib/supabase/auth";
import { createServerClient } from "@/lib/supabase/server";

export async function login(prevState, formData) {
  const data = formData instanceof FormData ? formData : prevState;
  const email = data?.get("email");
  const password = data?.get("password");

  if (!email || !password) {
    return { error: "Email dan password wajib diisi." };
  }

  const supabase = await createSessionClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: String(email).trim(),
    password: String(password),
  });

  if (error) {
    if (error.message.toLowerCase().includes("invalid login credentials")) {
      return { error: "Email atau password salah. Silakan coba lagi." };
    }
    return { error: error.message || "Gagal masuk. Silakan coba lagi." };
  }

  redirect("/admin");
}

export async function logout() {
  const supabase = await createSessionClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function gantiPassword(prevState, formData) {
  const data = formData instanceof FormData ? formData : prevState;
  const passwordBaru = data?.get("password_baru");
  const konfirmasiPassword = data?.get("konfirmasi_password");

  const supabase = await createSessionClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Sesi tidak valid atau telah berakhir. Silakan login kembali." };
  }

  if (!passwordBaru || !konfirmasiPassword) {
    return { error: "Semua kolom password wajib diisi." };
  }

  if (String(passwordBaru).length < 8) {
    return { error: "Password baru minimal 8 karakter." };
  }

  if (passwordBaru !== konfirmasiPassword) {
    return { error: "Konfirmasi password tidak cocok dengan password baru." };
  }

  const { error } = await supabase.auth.updateUser({
    password: String(passwordBaru),
  });

  if (error) {
    return { error: error.message || "Gagal mengganti password." };
  }

  return { success: "Password berhasil diganti." };
}

export async function simpanProduk(prevState, formData) {
  const authClient = await createAuthClient();
  const {
    data: { user },
    error: authError,
  } = await authClient.auth.getUser();

  if (authError || !user) {
    redirect("/admin/login");
  }

  const id = formData.get("id");
  const nama = formData.get("nama")?.toString().trim() || "";
  const hargaRaw = formData.get("harga")?.toString().trim() || "";
  const kategori = formData.get("kategori")?.toString().trim() || "";
  const foto_url = formData.get("foto_url")?.toString().trim() || "";
  const deskripsi = formData.get("deskripsi")?.toString().trim() || "";

  const values = {
    ...(id ? { id: String(id) } : {}),
    nama,
    harga: hargaRaw,
    kategori,
    foto_url,
    deskripsi,
  };

  const errors = {};

  if (!nama) {
    errors.nama = "Nama produk wajib diisi.";
  }

  const hargaNum = Number(hargaRaw);
  if (!hargaRaw || isNaN(hargaNum) || hargaNum <= 0) {
    errors.harga = "Harga harus berupa angka lebih besar dari 0.";
  }

  if (Object.keys(errors).length > 0) {
    return { errors, values };
  }

  const db = createServerClient();
  const dataProduk = {
    nama,
    harga: Math.round(hargaNum),
    kategori: kategori || null,
    foto_url: foto_url || null,
    deskripsi: deskripsi || null,
  };

  if (id) {
    const { error } = await db.from("produk").update(dataProduk).eq("id", id);
    if (error) {
      return { errors: { general: error.message }, values };
    }
  } else {
    const { error } = await db.from("produk").insert([dataProduk]);
    if (error) {
      return { errors: { general: error.message }, values };
    }
  }

  revalidatePath("/admin");
  revalidatePath("/");
  if (id) {
    revalidatePath(`/produk/${id}`);
  }
  redirect("/admin");
}

export async function hapusProduk(formData) {
  const authClient = await createAuthClient();
  const {
    data: { user },
    error: authError,
  } = await authClient.auth.getUser();

  if (authError || !user) {
    redirect("/admin/login");
  }

  const id = formData.get("id");
  if (!id) {
    redirect("/admin");
  }

  const db = createServerClient();
  await db.from("produk").delete().eq("id", id);

  revalidatePath("/admin");
  revalidatePath("/");
  redirect("/admin");
}
