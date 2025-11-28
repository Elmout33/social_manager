
import React from 'react';
import { Post, PostStatus } from '../types';
import { SOCIAL_COLORS } from '../constants';

interface PostTableProps {
  posts: Post[];
  onSelectPost: (post: Post) => void;
}

const PostTable: React.FC<PostTableProps> = ({ posts, onSelectPost }) => {
  
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    try {
      return new Intl.DateTimeFormat('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(new Date(dateString));
    } catch {
      return 'Date invalide';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case PostStatus.PUBLISHED: return 'bg-green-100 text-green-700 border-green-200'; // Publié
      case PostStatus.TO_PUBLISH: return 'bg-blue-100 text-blue-700 border-blue-200';   // A publier
      case PostStatus.REJECTED: return 'bg-red-100 text-red-700 border-red-200';        // Rejeté
      case PostStatus.TO_VALIDATE: return 'bg-amber-100 text-amber-700 border-amber-200'; // A valider
      default: return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="bg-white shadow-sm border border-slate-200 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-600">
          <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-semibold">Date prévue</th>
              <th className="px-6 py-4 font-semibold">Réseau</th>
              <th className="px-6 py-4 font-semibold">Contenu (Extrait)</th>
              <th className="px-6 py-4 font-semibold">Statut</th>
              <th className="px-6 py-4 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {posts.map((post) => {
              const normalizedNetwork = (post.social_network || 'unknown').toLowerCase();
              const socialColor = SOCIAL_COLORS[normalizedNetwork as keyof typeof SOCIAL_COLORS] || SOCIAL_COLORS.unknown;

              return (
                <tr 
                  key={post.id} 
                  onClick={() => onSelectPost(post)}
                  className="bg-white hover:bg-indigo-50/30 transition-colors cursor-pointer group"
                >
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-900">
                    {formatDate(post.publication_date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-bold text-white uppercase tracking-wider ${socialColor}`}>
                      {post.social_network || 'Inconnu'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="max-w-md truncate text-slate-500">
                      {post.text || <span className="italic text-slate-400">Pas de texte</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(post.status as string)}`}>
                      {post.status || 'Inconnu'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-indigo-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    Voir
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {posts.length === 0 && (
        <div className="p-8 text-center text-slate-400 italic">
          Aucun post à afficher.
        </div>
      )}
    </div>
  );
};

export default PostTable;
