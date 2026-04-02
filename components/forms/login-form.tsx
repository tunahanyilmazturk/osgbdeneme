"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/stores";
import { useForm } from "@/lib/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Lock, Eye, EyeOff, ArrowRight, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface LoginFormValues {
  email: string;
  sifre: string;
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

interface LoginFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function LoginForm({ onSuccess, onError }: LoginFormProps) {
  const router = useRouter();
  const { girisYap } = useAuthStore();
  const [sifreGoster, setSifreGoster] = useState(false);

  const { values, errors, isSubmitting, setValue, handleSubmit } = useForm<LoginFormValues>({
    initialValues: { email: "", sifre: "" },
    onSubmit: async (values) => {
      const success = await girisYap(values.email, values.sifre);
      if (success) {
        onSuccess?.();
        router.push("/dashboard");
      } else {
        onError?.(useAuthStore.getState().error || "E-posta veya şifre hatalı");
      }
    },
  });

  const sifreGucu = sifreGucuHesapla(values.sifre);

  const setDemoCredentials = () => {
    setValue("email", "admin@hantech.com");
    setValue("sifre", "admin123");
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Hoş Geldiniz</h2>
        <p className="text-muted-foreground mt-1">Hesabınıza giriş yapın</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-medium">E-posta Adresi</label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="email"
              placeholder="ornek@sirket.com"
              value={values.email}
              onChange={(e) => setValue("email", e.target.value)}
              className="pl-11 h-12 rounded-xl"
              required
            />
          </div>
          {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Şifre</label>
            <button type="button" className="text-xs text-primary hover:underline">Şifremi Unuttum</button>
          </div>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type={sifreGoster ? "text" : "password"}
              placeholder="•••••••••"
              value={values.sifre}
              onChange={(e) => setValue("sifre", e.target.value)}
              className="pl-11 pr-11 h-12 rounded-xl"
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

        <div className="flex items-center gap-2">
          <input type="checkbox" id="remember" className="h-4 w-4 rounded accent-primary" />
          <label htmlFor="remember" className="text-sm text-muted-foreground">Beni hatırla</label>
        </div>

        <Button type="submit" variant="gradient" className="w-full h-12 rounded-xl text-base font-semibold" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Giriş yapılıyor...
            </>
          ) : (
            <>
              Giriş Yap
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>

        {/* Sosyal Giriş */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-3 text-muted-foreground">veya</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" type="button" className="h-11 rounded-xl">
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google
          </Button>
          <Button variant="outline" type="button" className="h-11 rounded-xl">
            <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.913 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"/>
            </svg>
            Apple
          </Button>
        </div>
      </form>

      {/* Demo */}
      <Card className="mt-6 border-dashed bg-muted/30">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium">Demo Giriş</span>
          </div>
          <button
            className="w-full rounded-lg bg-background p-3 text-left hover:bg-accent transition-colors cursor-pointer flex items-center justify-between"
            onClick={setDemoCredentials}
          >
            <div>
              <p className="text-xs font-mono text-primary">admin@hantech.com</p>
              <p className="text-xs font-mono text-muted-foreground">admin123</p>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </button>
        </CardContent>
      </Card>
    </div>
  );
}
