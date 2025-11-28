
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_STORAGE_BUCKET } from '../constants';
import { Post, PostUpdatePayload } from '../types';

// Initialize the Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const fetchPosts = async (): Promise<Post[]> => {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Erreur lors de la récupération des posts:", error);
    throw error;
  }

  // Sécurité : retourne un tableau vide si data est null
  return (data || []) as Post[];
};

export const updatePost = async (id: string, updates: PostUpdatePayload): Promise<void> => {
  const { error } = await supabase
    .from('posts')
    .update(updates)
    .eq('id', id);

  if (error) {
    console.error("Erreur lors de la mise à jour du post:", error);
    throw error;
  }
};

export const uploadPostImage = async (file: File): Promise<string> => {
  const bucketName = SUPABASE_STORAGE_BUCKET || 'post_image'; 
  
  // Nom unique pour le fichier: timestamp_nomoriginal
  const fileName = `${Date.now()}_${file.name.replace(/\s/g, '_')}`;
  
  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(fileName, file);

  if (error) {
    console.error("Erreur upload image:", error);
    throw error;
  }

  return data.path;
};

export const getImageUrl = (imagePath: string | null): string => {
  if (!imagePath) return ""; 
  
  // Si c'est déjà une URL complète
  if (imagePath.startsWith('http')) return imagePath;

  const bucketName = SUPABASE_STORAGE_BUCKET || 'post_image';

  // Nettoyage critique: si le chemin stocké en base est "post_image/monfichier.jpg"
  // et qu'on demande l'URL publique du bucket "post_image", Supabase concatène parfois bêtement.
  // On s'assure que le path ne commence PAS par le nom du bucket.
  let cleanPath = imagePath;
  if (cleanPath.startsWith(`${bucketName}/`)) {
    cleanPath = cleanPath.replace(`${bucketName}/`, '');
  }

  const { data } = supabase.storage
    .from(bucketName)
    .getPublicUrl(cleanPath);
    
  return data.publicUrl;
};
