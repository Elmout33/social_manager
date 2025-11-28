import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Post, SocialNetwork, PostStatus } from '../types';
import { SOCIAL_COLORS } from '../constants';

interface MetricsProps {
  posts: Post[];
}

const Metrics: React.FC<MetricsProps> = ({ posts }) => {
  // Compute metrics with case-insensitive matching for networks
  const data = Object.values(SocialNetwork).filter(n => n !== 'unknown').map(network => {
    return {
      name: network,
      count: posts.filter(p => (p.social_network || '').toLowerCase() === network.toLowerCase()).length,
      color: SOCIAL_COLORS[network as keyof typeof SOCIAL_COLORS] || '#94a3b8'
    };
  });

  const getBarColor = (network: string) => {
      switch(network.toLowerCase()) {
          case SocialNetwork.LINKEDIN: return '#0077b5';
          case SocialNetwork.TWITTER: return '#1DA1F2';
          case SocialNetwork.FACEBOOK: return '#4267B2';
          case SocialNetwork.INSTAGRAM: return '#E1306C';
          default: return '#94a3b8';
      }
  };

  // Mise à jour pour les nouveaux statuts demandés
  const statusData = [
      { 
        name: PostStatus.VALIDATED, 
        value: posts.filter(p => p.status === PostStatus.VALIDATED).length, 
        color: '#22c55e' 
      },
      { 
        name: PostStatus.TO_VERIFY, 
        value: posts.filter(p => p.status === PostStatus.TO_VERIFY).length, 
        color: '#f59e0b' 
      },
      { 
        name: PostStatus.REJECTED, 
        value: posts.filter(p => p.status === PostStatus.REJECTED).length, 
        color: '#ef4444' 
      },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Posts par Réseau</h3>
            <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                        <XAxis type="number" hide />
                        <YAxis type="category" dataKey="name" tick={{ fontSize: 12, textTransform: 'capitalize' }} width={80} />
                        <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                        <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={20}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={getBarColor(entry.name)} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
             <h3 className="text-lg font-semibold text-slate-800 mb-4">État des Publications</h3>
             <div className="flex items-end justify-around h-48 space-x-2">
                {statusData.map((stat) => (
                    <div key={stat.name} className="flex flex-col items-center flex-1">
                        <div className="relative w-full flex items-end justify-center h-32 bg-slate-50 rounded-lg overflow-hidden border border-slate-100">
                             <div 
                                style={{ height: `${Math.max(stat.value * 15, 5)}%`, backgroundColor: stat.color }} 
                                className="w-full mx-4 rounded-t-lg transition-all duration-500 opacity-90"
                             />
                        </div>
                        <div className="mt-3 text-center">
                            <span className="block text-2xl font-bold text-slate-800">{stat.value}</span>
                            <span className="text-xs text-slate-500 font-medium whitespace-nowrap">{stat.name}</span>
                        </div>
                    </div>
                ))}
             </div>
        </div>
    </div>
  );
};

export default Metrics;