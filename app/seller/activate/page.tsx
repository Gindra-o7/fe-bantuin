"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import PublicLayout from "@/components/layouts/PublicLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  TbTools,
  TbShieldCheck,
  TbCoin,
  TbStar,
  TbArrowLeft,
} from "react-icons/tb";
import Link from "next/link";

const SellerActivate = () => {
  const { user, loading, isAuthenticated, activateSellerMode } = useAuth();
  const router = useRouter();
  const [isActivating, setIsActivating] = useState(false);
  const [error, setError] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [bio, setBio] = useState("");

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/");
    }

    if (!loading && user?.isSeller) {
      router.push("/seller/dashboard");
    }
  }, [user, loading, isAuthenticated, router]);

  const handleActivate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validasi
    if (!phoneNumber || phoneNumber.length < 10) {
      setError("Nomor telepon minimal 10 digit");
      return;
    }

    if (!bio || bio.length < 50) {
      setError("Bio minimal 50 karakter");
      return;
    }

    try {
      setIsActivating(true);
      await activateSellerMode(phoneNumber, bio);
    } catch (err: any) {
      console.error("Failed to activate seller mode:", err);
      setError(
        err.message || "Gagal mengaktifkan mode penyedia. Silakan coba lagi."
      );
    } finally {
      setIsActivating(false);
    }
  };

  if (loading) {
    return (
      <PublicLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </PublicLayout>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <PublicLayout>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Back Button */}
          <Link href="/">
            <Button variant="ghost" className="mb-6">
              <TbArrowLeft /> Kembali
            </Button>
          </Link>

          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <div className="bg-primary/10 p-4 rounded-full">
                <TbTools className="h-12 w-12 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Jadi Penyedia Jasa
            </h1>
            <p className="text-xl text-gray-600">
              Mulai tawarkan keahlianmu dan dapatkan penghasilan tambahan
            </p>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card>
              <CardHeader>
                <TbCoin className="h-8 w-8 text-primary mb-2" />
                <CardTitle className="text-lg">Penghasilan Fleksibel</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Tentukan sendiri harga jasamu dan kelola waktumu sendiri
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <TbShieldCheck className="h-8 w-8 text-primary mb-2" />
                <CardTitle className="text-lg">Transaksi Aman</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Sistem escrow menjamin pembayaran aman setelah pekerjaan
                  selesai
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <TbStar className="h-8 w-8 text-primary mb-2" />
                <CardTitle className="text-lg">Bangun Reputasi</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Dapatkan rating dan review untuk membangun kredibilitas
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          {/* Activation Form */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Lengkapi Profil Penyedia</CardTitle>
              <CardDescription>
                Isi informasi berikut untuk mengaktifkan mode penyedia jasa
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleActivate} className="space-y-6">
                {/* User Info Display */}
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Nama:</span>
                    <span className="font-medium">{user.fullName}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium">{user.email}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Jurusan:</span>
                    <span className="font-medium">{user.major || "-"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Angkatan:</span>
                    <span className="font-medium">{user.batch || "-"}</span>
                  </div>
                </div>

                {/* Phone Number Input */}
                <div>
                  <label
                    htmlFor="phoneNumber"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Nomor WhatsApp <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="08xxxxxxxxxx"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Nomor ini akan digunakan untuk komunikasi dengan pembeli
                  </p>
                </div>

                {/* Bio Input */}
                <div>
                  <label
                    htmlFor="bio"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Bio / Deskripsi Diri <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Ceritakan tentang dirimu dan keahlianmu... (minimal 50 karakter)"
                    required
                    rows={5}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {bio.length}/50 karakter. Deskripsikan keahlian dan
                    pengalamanmu.
                  </p>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                    {error}
                  </div>
                )}

                {/* Terms & Conditions */}
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">
                    Syarat & Ketentuan Penyedia Jasa:
                  </h3>
                  <ul className="space-y-2 text-sm text-blue-800">
                    <li className="flex items-start">
                      <span className="mr-2">✓</span>
                      <span>Harus mahasiswa aktif UIN Suska Riau</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">✓</span>
                      <span>Bertanggung jawab atas kualitas layanan</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">✓</span>
                      <span>Memberikan pelayanan yang profesional</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">✓</span>
                      <span>Tidak melanggar aturan kampus dan hukum</span>
                    </li>
                  </ul>
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-4 pt-4">
                  <Button
                    type="submit"
                    size="lg"
                    className="flex-1"
                    disabled={isActivating || bio.length < 50}
                  >
                    {isActivating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Mengaktifkan...
                      </>
                    ) : (
                      <>
                        <TbTools className="mr-2" />
                        Aktifkan Sekarang
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    onClick={() => router.push("/")}
                    disabled={isActivating}
                  >
                    Nanti Saja
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* FAQ */}
          <Card>
            <CardHeader>
              <CardTitle>Pertanyaan Umum</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">
                  Apakah ada biaya untuk menjadi penyedia?
                </h4>
                <p className="text-sm text-gray-600">
                  Tidak ada biaya pendaftaran. Platform hanya mengambil komisi
                  dari transaksi yang berhasil.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">
                  Bagaimana cara menerima pembayaran?
                </h4>
                <p className="text-sm text-gray-600">
                  Pembayaran akan masuk ke dompet digital setelah pembeli
                  mengkonfirmasi pekerjaan selesai. Kamu bisa withdraw ke
                  rekening bank kapan saja.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">
                  Apakah bisa membatalkan mode penyedia?
                </h4>
                <p className="text-sm text-gray-600">
                  Ya, kamu bisa menonaktifkan mode penyedia kapan saja. Namun
                  pastikan semua pesanan aktif sudah diselesaikan.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PublicLayout>
  );
};

export default SellerActivate;
