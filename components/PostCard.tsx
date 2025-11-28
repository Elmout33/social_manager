import React, { useState, useCallback, useMemo } from 'react';
import { Post, PostStatus } from '../types';
import { getImageUrl, updatePost } from '../services/supabaseClient';
import { SOCIAL_COLORS } from '../constants';

interface PostCardProps {
  post: Post;
  onPostUpdated: () => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onPostUpdated }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(post.text);
  const [editedStatus, setEditedStatus] = useState(post.status);
  
  // Conversion de la date UTC (ISO) en format compatible datetime-local (YYYY-MM-DDThh:mm)
  const [editedDate, setEditedDate] = useState(() => {
    if (!post.publication_date) return '';
    try {
        return new Date(post.publication_date).toISOString().slice(0, 16);
    } catch {
        return '';
    }
  });
  
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    try {
      // Conversion de la date locale en ISO pour Supabase
      const dateToSave = editedDate ? new Date(editedDate).toISOString() : null;

      await updatePost(post.id, {
        text: editedText,
        status: editedStatus,
        publication_date: dateToSave
      });
      setIsEditing(false);
      onPostUpdated();
    } catch (error) {
      alert("Erreur lors de la sauvegarde.");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  }, [post.id, editedText, editedStatus, editedDate, onPostUpdated]);

  const handleCancel = () => {
    setEditedText(post.text);
    setEditedStatus(post.status);
    setEditedDate(post.publication_date ? new Date(post.publication_date).toISOString().slice(0, 16) : '');
    setIsEditing(false);
  };

  // Normalisation pour correspondre aux clés de couleur
  const normalizedNetwork = (post.social_network || 'unknown').toLowerCase();
  const socialColor = SOCIAL_COLORS[normalizedNetwork as keyof typeof SOCIAL_COLORS] || SOCIAL_COLORS.unknown;
  
  const imageUrl = getImageUrl(post.image);

  // Formatage pour l'affichage (lecture seule)
  const formattedDate = useMemo(() => {
    if (!post.publication_date) return 'Date non définie';
    try {
        const date = new Date(post.publication_date);
        return isNaN(date.getTime()) 
            ? 'Date invalide' 
            : new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long', timeStyle: 'short' }).format(date);
    } catch (e) {
        return 'Erreur date';
    }
  }, [post.publication_date]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col transition-all hover:shadow-md h-full">
      {/* Header with Network and Status */}
      <div className={`h-2 ${socialColor}`} />
      <div className="p-4 flex justify-between items-start border-b border-slate-100 bg-slate-50/50 min-h-[60px]">
        <div className="flex flex-col space-y-1">
            <span className={`self-start px-2 py-1 text-xs font-bold text-white rounded uppercase tracking-wider ${socialColor}`}>
                {post.social_network || 'Inconnu'}
            </span>
            {!isEditing && (
                <span className="text-xs text-slate-500 font-medium">
                    {formattedDate}
                </span>
            )}
        </div>
        <div>
            {isEditing ? (
                <div className="flex flex-col gap-2 items-end">
                     <select 
                        value={editedStatus}
                        onChange={(e) => setEditedStatus(e.target.value)}
                        className="text-xs border border-slate-300 rounded px-2 py-1.5 bg-white focus:ring-2 focus:ring-indigo-500 shadow-sm"
                    >
                        <option value={PostStatus.TO_VERIFY}>{PostStatus.TO_VERIFY}</option>
                        <option value={PostStatus.REJECTED}>{PostStatus.REJECTED}</option>
                        <option value={PostStatus.VALIDATED}>{PostStatus.VALIDATED}</option>
                    </select>
                    <input 
                        type="datetime-local"
                        value={editedDate}
                        onChange={(e) => setEditedDate(e.target.value)}
                        className="text-xs border border-slate-300 rounded px-2 py-1 bg-white focus:ring-2 focus:ring-indigo-500 shadow-sm"
                    />
                </div>
            ) : (
                <span className={`px-2 py-1 text-xs font-semibold rounded-full border 
                    ${post.status === PostStatus.VALIDATED ? 'bg-green-100 text-green-700 border-green-200' : 
                      post.status === PostStatus.REJECTED ? 'bg-red-100 text-red-700 border-red-200' : 
                      'bg-amber-100 text-amber-700 border-amber-200'}`}>
                    {post.status || 'Inconnu'}
                </span>
            )}
        </div>
      </div>

      {/* Content Body */}
      <div className="flex-1 p-4 flex flex-col space-y-4">
        {/* Text Content */}
        <div className="w-full">
            {isEditing ? (
                <textarea
                    value={editedText}
                    onChange={(e) => setEditedText(e.target.value)}
                    className="w-full p-3 text-sm border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[140px] shadow-sm"
                    placeholder="Saisissez le texte du post..."
                />
            ) : (
                <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                    {post.text || "Aucun texte défini."}
                </p>
            )}
        </div>

        {/* Image Preview */}
        {post.image && (
             <div className="relative group rounded-lg overflow-hidden border border-slate-100 bg-slate-100 aspect-video flex items-center justify-center">
                <img 
                    src={imageUrl} 
                    alt="Visuel du post" 
                    title={`Source: ${imageUrl}`} // Aide au débogage au survol
                    className="w-full h-full object-cover"
                />
            </div>
        )}
        {!post.image && (
            <div className="text-xs text-slate-400 italic text-center p-4 border border-dashed border-slate-200 rounded">
                Pas d'image associée
            </div>
        )}
        
        {/* Source Link */}
        {post.article_blog_url && (
             <div className="text-xs text-slate-400 truncate flex items-center gap-1">
                <span>Article:</span>
                <a href={post.article_blog_url} target="_blank" rel="noreferrer" className="text-indigo-500 hover:underline font-medium">{post.article_blog_url}</a>
             </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end space-x-3">
        {isEditing ? (
            <>
                <button 
                    onClick={handleCancel}
                    className="px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-md transition-colors"
                    disabled={isSaving}
                >
                    Annuler
                </button>
                <button 
                    onClick={handleSave}
                    className="px-3 py-1.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors shadow-sm flex items-center"
                    disabled={isSaving}
                >
                    {isSaving ? '...' : 'Enregistrer'}
                </button>
            </>
        ) : (
            <button 
                onClick={() => setIsEditing(true)}
                className="w-full px-3 py-2 text-sm font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-md transition-colors flex justify-center items-center gap-2"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                </svg>
                Éditer / Valider
            </button>
        )}
      </div>
    </div>
  );
};

export default PostCard;