"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function EditFournisseurPage() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirection temporaire vers la liste des fournisseurs car la page d'édition est vide
    router.push("/admin2/fournisseurs");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600 font-semibold">Redirection vers la gestion des fournisseurs...</p>
      </div>
    </div>
  );
}
