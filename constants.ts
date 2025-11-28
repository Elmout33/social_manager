
// ------------------------------------------------------------------
// CONFIGURATION SUPABASE
// ------------------------------------------------------------------

// Fonction sécurisée pour récupérer les variables d'environnement sans faire planter l'app si import.meta.env n'existe pas
const getEnv = (key: string) => {
  try {
    // @ts-ignore
    return (import.meta as any).env?.[key];
  } catch {
    return undefined;
  }
};

export const SUPABASE_URL = getEnv('VITE_SUPABASE_URL') || "https://sachkdqkneiheebjaffu.supabase.co";
export const SUPABASE_ANON_KEY = getEnv('VITE_SUPABASE_ANON_KEY') || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNhY2hrZHFrbmVpaGVlYmphZmZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQwNzU1NzEsImV4cCI6MjA3OTY1MTU3MX0.aHBXkA8A9LbHgJcq7GbIoIYXJMWntUNSWXIAW7S61eM";

// IMPORTANT: Nom exact du bucket dans Supabase Storage
export const SUPABASE_STORAGE_BUCKET = "post_image"; 

export const SOCIAL_COLORS = {
  linkedin: 'bg-[#0077b5]',
  twitter: 'bg-[#1DA1F2]',
  facebook: 'bg-[#4267B2]',
  instagram: 'bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045]',
  unknown: 'bg-gray-400'
};
