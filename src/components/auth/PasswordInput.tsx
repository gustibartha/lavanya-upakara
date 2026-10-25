"use client";

import { useState, type InputHTMLAttributes } from "react";
import { Eye, EyeOff } from "lucide-react";

/** Kolom kata sandi dengan tombol untuk menampilkan/menyembunyikan isinya. */
export function PasswordInput(props: Omit<InputHTMLAttributes<HTMLInputElement>, "type">) {
  const [terlihat, setTerlihat] = useState(false);

  return (
    <div className="auth-password-wrap">
      <input {...props} type={terlihat ? "text" : "password"} className="auth-input auth-password-input" />
      <button
        type="button"
        className="auth-password-toggle"
        onClick={() => setTerlihat((v) => !v)}
        aria-label={terlihat ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
        aria-pressed={terlihat}
        title={terlihat ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
      >
        {terlihat ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
}
