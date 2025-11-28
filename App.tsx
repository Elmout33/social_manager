
import React, { useEffect, useState, useMemo } from 'react';
import Layout from './components/Layout';
import PostTable from './components/PostTable';
import PostModal from './components/PostModal';
import { fetchPosts } from './services/supabaseClient';
import { Post, SocialNetwork, PostStatus } from './types';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './constants';

function App() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedNetwork, setSelectedNetwork] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  
  // État pour gérer la modale
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  // Check configuration on load
  const isConfigured = SUPABASE_URL && SUPABASE_ANON_KEY && !SUPABASE_URL.includes("votre-projet");

  const loadPosts = async () => {
    if (!isConfigured) return;
    
    setLoading(true);
    try {
      const data = await fetchPosts();
      setPosts(data);
      setError(null);
    } catch (err: any) {
      setError("Impossible de charger les posts. Vérifiez votre connexion Supabase et la console du navigateur.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePostUpdate = () => {
    loadPosts(); // Recharge les données
    setSelectedPost(null); // Ferme la modale
  };

  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      // Comparaison insensible à la casse
      const postNetwork = (post.social_network || '').toLowerCase();
      const matchNetwork = selectedNetwork === 'all' || postNetwork === selectedNetwork.toLowerCase();
      
      const postStatus = post.status || '';
      const matchStatus = selectedStatus === 'all' || postStatus === selectedStatus;
      
      return matchNetwork && matchStatus;
    });
  }, [posts, selectedNetwork, selectedStatus]);

  if (!isConfigured) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-slate-800 mb-4">Configuration Requise</h1>
          <p className="text-slate-600 mb-6">
            Pour utiliser cette application, vous devez configurer vos identifiants Supabase dans le fichier <code>constants.ts</code>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
            <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Social Manager</h1>
                <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold border border-indigo-200">v1.2</span>
            </div>
            <p className="text-slate-500 mt-1">Liste des publications à gérer.</p>
        </div>
        <div className="flex items-center gap-2">
             <button 
                onClick={loadPosts} 
                className="p-2 text-slate-500 hover:text-indigo-600 transition-colors bg-white rounded-lg border border-slate-200 shadow-sm"
                title="Rafraichir"
             >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
             </button>
        </div>
      </header>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 items-center justify-between mb-6 sticky top-0 z-10 backdrop-blur-xl bg-white/95">
        <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
            <button
                onClick={() => setSelectedNetwork('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap border ${selectedNetwork === 'all' ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
            >
                Tous
            </button>
            {[SocialNetwork.TWITTER, SocialNetwork.LINKEDIN, SocialNetwork.FACEBOOK, SocialNetwork.INSTAGRAM].map(net => (
                <button
                    key={net}
                    onClick={() => setSelectedNetwork(net)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize whitespace-nowrap border ${selectedNetwork === net ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                >
                    {net}
                </button>
            ))}
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
             <span className="text-sm text-slate-500 font-medium">Statut:</span>
             <select 
                value={selectedStatus} 
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-white border border-slate-300 text-slate-700 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full md:w-48 p-2.5"
             >
                <option value="all">Tous les statuts</option>
                <option value={PostStatus.TO_VALIDATE}>{PostStatus.TO_VALIDATE}</option>
                <option value={PostStatus.TO_PUBLISH}>{PostStatus.TO_PUBLISH}</option>
                <option value={PostStatus.PUBLISHED}>{PostStatus.PUBLISHED}</option>
                <option value={PostStatus.REJECTED}>{PostStatus.REJECTED}</option>
             </select>
        </div>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="space-y-4">
            {[1,2,3,4,5].map(i => (
                <div key={i} className="h-16 bg-white rounded-xl border border-slate-200 animate-pulse"></div>
            ))}
        </div>
      ) : error ? (
        <div className="text-center py-20 text-red-500 bg-red-50 rounded-xl border border-red-100 p-8">
            <p className="font-bold mb-2">Erreur</p>
            {error}
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="text-center py-20 text-slate-400 bg-white rounded-xl border border-dashed border-slate-300">
            <p className="text-lg">Aucun post ne correspond aux filtres sélectionnés.</p>
            <button onClick={() => { setSelectedNetwork('all'); setSelectedStatus('all'); }} className="mt-4 text-indigo-600 hover:underline font-medium">Réinitialiser les filtres</button>
        </div>
      ) : (
        <PostTable posts={filteredPosts} onSelectPost={setSelectedPost} />
      )}

      {/* Modal Popup */}
      {selectedPost && (
        <PostModal 
          post={selectedPost} 
          onClose={() => setSelectedPost(null)}
          onUpdate={handlePostUpdate}
        />
      )}
    </Layout>
  );
}

export default App;
