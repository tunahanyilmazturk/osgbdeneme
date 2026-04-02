"use client";

import { useState } from "react";
import { useForm } from "@/lib/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, User, Phone, KeyRound, Eye, EyeOff, UserPlus, CheckCircle2 } from "lucide-react";

interface RegisterFormValues {
  ad: string;
  soyad: string;
  email: string;
  telefon: string;
  sifre: string;
  sifreTekrar: string;
}

function sifreGucuHesapla(sifre: string) {
  if (!sifre) return { skor: 0, seviye: "", renk: "", genislik: "0%" };

  let skor = 0;
  if (sifre.length >= 6) skor++;
  if (sifre.length >= 10) skor++;
  if (/[a-z]/.test(sifre) && /[A-Z]/.test(sifre)) skor++;
  if (/[0-9]/.test(sifre)) skor++;
  if (/[^a-zA-Z0-9]/.test(sifre)) skor++;

  const seviyeler = [
    { seviye: "Çok Zayıf", renk: "bg-red-500", genislik: "20%" },
    { seviye: "Zayıf", renk: "bg-orange-500", genislik: "40%" },
    { seviye: "Orta", renk: "bg-yellow-500", genislik: "60%" },
    { seviye: "Güçlü", renk: "bg-green-500", genislik: "80%" },
    { seviye: "Çok Güçlü", renk: "bg-emerald-500", genislik: "100%" },
  ];

  const idx = Math.min(skor, 5) - 1;
  if (idx < 0) return { skor: 0, seviye: "", renk: "", genislik: "0%" };
  return { skor, ...seviyeler[idx] };
}

interface RegisterFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function RegisterForm({ onSuccess, onError }: RegisterFormProps) {
  const [sifreGoster, setSifreGoster] = useState(false);

  const validate = (values: RegisterFormValues) => {
    const errors: Partial<Record<keyof RegisterFormValues, string>> = {};
    
    if (values.sifre !== values.sifreTekrar) {
      errors.sifreTekrar = "Şifreler eşleşmiyor";
    }
    if (values.sifre.length < 6) {
      errors.sifre = "Şifre en az 6 karakter olmalıdır";
    }
    
    return errors;
  };

  const { values, errors, isSubmitting, setValue, handleSubmit } = useForm<RegisterFormValues>({
    initialValues: { ad: "", soyad: "", email: "", telefon: "", sifre: "", sifreTekrar: "" },
    validate,
    onSubmit: async () => {
      // Simulate API call
      await new Promise((r) => setTimeout(r, 1500));
      onSuccess?.();
    },
  });

  const sifreGucu = sifreGucuHesapla(values.sifre);
  const sifrelerEslesiyor = values.sifreTekrar && values.sifre === values.sifreTekrar;
  const sifrelerEslesmiyor = values.sifreTekrar && values.sifre !== values.sifreTekrar;

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Hesap Oluşturun</h2>
        <p className="text-muted-foreground mt-1">Ücretsiz hesabınızı oluşturun</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Ad</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Adınız"
                value={values.ad}
                onChange={(e) => setValue("ad", e.target.value)}
                className="pl-10 h-11 rounded-xl"
                required
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Soyad</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Soyadınız"
                value={values.soyad}
                onChange={(e) => setValue("soyad", e.target.value)}
                className="pl-10 h-11 rounded-xl"
                required
              />
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">E-posta</label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="email"
              placeholder="ornek@sirket.com"
              value={values.email}
              onChange={(e) => setValue("email", e.target.value)}
              className="pl-11 h-11 rounded-xl"
              required
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">Telefon</label>
          <div className="relative">
            <Phone className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="tel"
              placeholder="0 (5XX) XXX XX XX"
              value={values.telefon}
              onChange={(e) => setValue("telefon", e.target.value)}
              className="pl-11 h-11 rounded-xl"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">Şifre</label>
          <div className="relative">
            <KeyRound className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type={sifreGoster ? "text" : "password"}
              placeholder="En az 6 karakter"
              value={values.sifre}
              onChange={(e) => setValue("sifre", e.target.value)}
              className="pl-11 pr-11 h-11 rounded-xl"
              required
            />
            <button
              type="button"
              onClick={() => setSifreGoster(!sifreGoster)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {sifreGoster ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.sifre && <p className="text-xs text-destructive">{errors.sifre}</p>}
          {values.sifre && (
            <div className="space-y-1.5 animate-slide-up">
              <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${sifreGucu.renk}`}
                  style={{ width: sifreGucu.genislik }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Parola gücü: <span className="font-medium">{sifreGucu.seviye}</span>
              </p>
            </div>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">Şifre Tekrar</label>
          <div className="relative">
            <KeyRound className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="password"
              placeholder="Şifrenizi tekrar girin"
              value={values.sifreTekrar}
              onChange={(e) => setValue("sifreTekrar", e.target.value)}
              className="pl-11 h-11 rounded-xl"
              required
            />
          </div>
          {sifrelerEslesmiyor && (
            <p className="text-xs text-destructive animate-slide-up">Şifreler eşleşmiyor</p>
          )}
          {sifrelerEslesiyor && (
            <p className="text-xs text-green-600 flex items-center gap-1 animate-slide-up">
              <CheckCircle2 className="h-3 w-3" /> Şifreler eşleşiyor
            </p>
          )}
        </div>

        <div className="flex items-start gap-2 pt-1">
          <input type="checkbox" id="terms" className="h-4 w-4 rounded accent-primary mt-0.5" required />
          <label htmlFor="terms" className="text-xs text-muted-foreground leading-relaxed">
            <a href="#" className="text-primary hover:underline">Kullanım Koşulları</a> ve{" "}
            <a href="#" className="text-primary hover:underline">Gizlilik Politikası</a>
            {"'nı kabul ediyorum."}
          </label>
        </div>

        <Button type="submit" variant="gradient" className="w-full h-12 rounded-xl text-base font-semibold" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Hesap oluşturuluyor...
            </>
          ) : (
            <>
              <UserPlus className="mr-2 h-5 w-5" />
              Hesap Oluştur
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
