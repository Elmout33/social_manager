
import React, { useState, useEffect, useRef } from 'react';
import { Post, PostStatus, SocialNetwork } from '../types';
import { getImageUrl, updatePost, uploadPostImage } from '../services/supabaseClient';
import { SOCIAL_COLORS } from '../constants';

interface PostModalProps {
  post: Post;
  onClose: () => void;
  onUpdate: () => void;
}

const PostModal: React.FC<PostModalProps> = ({ post, onClose, onUpdate }) => {
  const [text, setText] = useState(post.text);
  const [status, setStatus] = useState(post.status);
  const [dateStr, setDateStr] = useState('');

  // Gestion de l'image (upload)
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setText(post.text);
    setStatus(post.status);
    setFileToUpload(null);
    setPreviewImage(getImageUrl(post.image));

    if (post.publication_date) {
      try {
        setDateStr(new Date(post.publication_date).toISOString().slice(0, 16));
      } catch {
        setDateStr('');
      }
    } else {
      setDateStr('');
    }
  }, [post]);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileToUpload(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const dateToSave = dateStr ? new Date(dateStr).toISOString() : null;
      let imagePath = post.image;

      if (fileToUpload) {
        imagePath = await uploadPostImage(fileToUpload);
      }

      await updatePost(post.id, {
        text,
        status,
        image: imagePath,
        publication_date: dateToSave
      });

      onUpdate(); 
    } catch (e) {
      alert("Erreur lors de la sauvegarde");
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  const network = (post.social_network || 'unknown').toLowerCase();
  const socialColor = SOCIAL_COLORS[network as keyof typeof SOCIAL_COLORS] || SOCIAL_COLORS.unknown;

  // Composant interne pour l'en-tête du téléphone selon le réseau
  const PhoneHeader = () => {
    if (network === SocialNetwork.INSTAGRAM) {
      return (
        <div className="flex items-center justify-between p-3 border-b border-gray-100">
           <div className="flex items-center gap-2">
             <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 to-purple-600 p-[2px]">
               <div className="w-full h-full rounded-full bg-white p-[2px]">
                 <div className="w-full h-full rounded-full bg-slate-200"></div>
               </div>
             </div>
             <span className="text-xs font-semibold text-slate-900">votre_compte</span>
           </div>
           <span className="text-slate-400">•••</span>
        </div>
      );
    }
    if (network === SocialNetwork.LINKEDIN) {
      return (
        <div className="flex items-center gap-3 p-4 border-b border-gray-100">
           <div className="w-10 h-10 rounded-full bg-slate-200"></div>
           <div className="flex flex-col">
             <span className="text-sm font-semibold text-slate-800">Votre Nom</span>
             <span className="text-[10px] text-slate-500">Expert en Photographie • 2h</span>
           </div>
        </div>
      );
    }
    // Default
    return (
        <div className="flex items-center gap-3 p-3 border-b border-gray-100">
           <div className="w-8 h-8 rounded-full bg-slate-200"></div>
           <div className="flex flex-col">
             <span className="text-sm font-semibold text-slate-800">Votre Compte</span>
             <span className="text-xs text-slate-500">Maintenant</span>
           </div>
        </div>
    );
  };

  const PhoneActions = () => {
      if (network === SocialNetwork.INSTAGRAM) {
          return (
              <div className="flex justify-between px-3 py-2">
                  <div className="flex gap-4">
                      <div className="w-6 h-6 border-2 border-slate-800 rounded-full"></div> {/* Heart */}
                      <div className="w-6 h-6 border-2 border-slate-800 rounded-full"></div> {/* Comment */}
                      <div className="w-6 h-6 border-2 border-slate-800 rounded-full"></div> {/* Share */}
                  </div>
                  <div className="w-6 h-6 border-2 border-slate-800 rounded-full"></div> {/* Save */}
              </div>
          )
      }
      if (network === SocialNetwork.LINKEDIN) {
          return (
              <div className="flex justify-around px-2 py-3 border-t border-slate-100 mt-2">
                  <span className="text-xs font-medium text-slate-500">J'aime</span>
                  <span className="text-xs font-medium text-slate-500">Commenter</span>
                  <span className="text-xs font-medium text-slate-500">Partager</span>
                  <span className="text-xs font-medium text-slate-500">Envoyer</span>
              </div>
          )
      }
      return <div className="p-3 border-t border-slate-100 mt-2 text-xs text-slate-400">Actions sociales...</div>
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-7xl h-[90vh] overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()} 
      >
        {/* Header App Modal */}
        <div className="px-6 py-3 flex items-center justify-between border-b border-slate-200 bg-slate-50">
           <h2 className="text-lg font-bold text-slate-700 flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${socialColor}`}></span>
              Édition & Prévisualisation
           </h2>
           <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
               <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
             </svg>
           </button>
        </div>

        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
            
            {/* GAUCHE: Éditeur */}
            <div className="flex-1 flex flex-col overflow-y-auto border-r border-slate-200 bg-white p-6 gap-6">
                
                {/* 1. Image Upload - HAUTEUR RÉDUITE ICI (h-40) */}
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Visuel</label>
                    <div 
                        className="group relative w-full h-40 rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 flex items-center justify-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition-colors overflow-hidden"
                        onClick={handleImageClick}
                    >
                        {previewImage ? (
                            <img src={previewImage} alt="Preview" className="w-full h-full object-contain" />
                        ) : (
                            <div className="text-center p-4">
                                <p className="text-sm text-slate-500">Cliquez pour ajouter une image</p>
                            </div>
                        )}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 flex items-center justify-center transition-all">
                             <span className="opacity-0 group-hover:opacity-100 bg-white shadow-md text-slate-800 text-xs font-bold px-4 py-2 rounded-full">
                                 Changer l'image
                             </span>
                        </div>
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                    </div>
                </div>

                {/* 2. Text Editor - PRENDRA PLUS D'ESPACE (flex-1) */}
                <div className="flex-1 flex flex-col">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Contenu</label>
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="flex-1 w-full p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm leading-relaxed resize-none min-h-[200px]"
                        placeholder="Rédigez votre post ici..."
                    />
                </div>

                {/* 3. Admin Footer (Dans la colonne gauche) */}
                <div className="bg-slate-50 rounded-lg p-5 border border-slate-200 mt-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Statut</label>
                            <select 
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full border-slate-300 rounded shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                            >
                                <option value={PostStatus.TO_VERIFY}>{PostStatus.TO_VERIFY}</option>
                                <option value={PostStatus.VALIDATED}>{PostStatus.VALIDATED}</option>
                                <option value={PostStatus.REJECTED}>{PostStatus.REJECTED}</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Publication</label>
                            <input 
                                type="datetime-local" 
                                value={dateStr}
                                onChange={(e) => setDateStr(e.target.value)}
                                className="w-full border-slate-300 rounded shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                            />
                        </div>
                    </div>
                    <div className="flex gap-3 pt-2 border-t border-slate-200">
                         <button onClick={onClose} className="flex-1 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded hover:bg-slate-50">Annuler</button>
                         <button onClick={handleSave} disabled={isSaving} className="flex-1 py-2 text-sm font-medium text-white bg-indigo-600 rounded hover:bg-indigo-700 shadow-sm">
                            {isSaving ? 'Sauvegarde...' : 'Enregistrer'}
                         </button>
                    </div>
                </div>
            </div>

            {/* DROITE: Phone Preview */}
            <div className="w-full lg:w-[450px] bg-slate-100 flex items-center justify-center p-8 overflow-y-auto">
                <div className="w-full max-w-[375px] bg-white rounded-[30px] border-[8px] border-slate-800 shadow-2xl overflow-hidden min-h-[600px] flex flex-col relative">
                    
                    {/* Notch */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-800 rounded-b-xl z-10"></div>
                    
                    {/* Status Bar Mockup */}
                    <div className="h-8 bg-white w-full flex justify-between px-6 items-end pb-1 text-[10px] font-bold text-slate-800 select-none">
                        <span>9:41</span>
                        <div className="flex gap-1">
                            <span>5G</span>
                            <div className="w-4 h-2.5 bg-slate-800 rounded-sm"></div>
                        </div>
                    </div>

                    {/* App Content */}
                    <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar">
                        <PhoneHeader />
                        
                        {/* Post Content Wrapper */}
                        <div className="flex flex-col">
                            {/* Text above image for LinkedIn/Facebook style */}
                            {network !== SocialNetwork.INSTAGRAM && text && (
                                <div className="px-4 py-2 text-sm text-slate-800 whitespace-pre-wrap">
                                    {text}
                                </div>
                            )}

                            {/* Image */}
                            {previewImage && (
                                <div className="w-full bg-slate-100">
                                    <img src={previewImage} alt="Post" className="w-full h-auto object-cover" />
                                </div>
                            )}

                            {/* Actions bar */}
                            <PhoneActions />

                            {/* Text below image for Instagram style */}
                            {network === SocialNetwork.INSTAGRAM && text && (
                                <div className="px-3 py-2 text-sm">
                                    <span className="font-semibold mr-2">votre_compte</span>
                                    <span className="text-slate-800 whitespace-pre-wrap">{text}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Home Indicator */}
                    <div className="h-6 w-full bg-white flex items-center justify-center pb-2">
                        <div className="w-32 h-1 bg-slate-900 rounded-full"></div>
                    </div>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};

export default PostModal;
