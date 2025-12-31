
import React, { useState, useEffect } from 'react';
import { AppData, Tournament } from '../types.ts';
import { ADMIN_PASSCODE } from '../constants.ts';
import { GitHubConfig, getGitHubConfig, saveGitHubConfig, pushToGitHub } from '../services/githubService.ts';
import { 
  Lock, Save, Plus, Trash2, Copy, Check, LogOut, 
  Settings, List, Globe, RefreshCw, AlertCircle, Github 
} from 'lucide-react';

interface Props {
  initialData: AppData;
  onUpdate: (data: AppData) => void;
  onClose: () => void;
}

export const AdminPanel: React.FC<Props> = ({ initialData, onUpdate, onClose }) => {
  const [passcode, setPasscode] = useState('');
  const [isAuth, setIsAuth] = useState(false);
  const [data, setData] = useState<AppData>(initialData);
  const [activeTab, setActiveTab] = useState<'tournaments' | 'config' | 'sync'>('tournaments');
  
  // GitHub Sync States
  const [ghConfig, setGhConfig] = useState<GitHubConfig>({
    token: '',
    owner: '',
    repo: '',
    path: 'tournaments.json',
    branch: 'main'
  });
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<{ type: 'success' | 'error' | null; msg: string }>({ type: null, msg: '' });

  useEffect(() => {
    const saved = getGitHubConfig();
    if (saved) setGhConfig(saved);
  }, []);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === ADMIN_PASSCODE) {
      setIsAuth(true);
    } else {
      alert('Wrong passcode!');
    }
  };

  const handleSaveGHConfig = () => {
    saveGitHubConfig(ghConfig);
    setSyncStatus({ type: 'success', msg: 'GitHub settings saved locally.' });
    setTimeout(() => setSyncStatus({ type: null, msg: '' }), 3000);
  };

  const handlePublish = async () => {
    if (!ghConfig.token || !ghConfig.owner || !ghConfig.repo) {
      setSyncStatus({ type: 'error', msg: 'Please configure GitHub settings first.' });
      return;
    }

    setIsSyncing(true);
    setSyncStatus({ type: null, msg: '' });
    
    const result = await pushToGitHub(data);
    
    if (result.success) {
      setSyncStatus({ type: 'success', msg: result.message });
      onUpdate(data);
    } else {
      setSyncStatus({ type: 'error', msg: result.message });
    }
    setIsSyncing(false);
  };

  const updateTournament = (id: string, updates: Partial<Tournament>) => {
    setData(prev => ({
      ...prev,
      tournaments: prev.tournaments.map(t => t.id === id ? { ...t, ...updates } : t)
    }));
  };

  const deleteTournament = (id: string) => {
    if (confirm('Delete this match?')) {
      setData(prev => ({
        ...prev,
        tournaments: prev.tournaments.filter(t => t.id !== id)
      }));
    }
  };

  const addTournament = () => {
    const newT: Tournament = {
      id: `t${Date.now()}`,
      title: 'New Match',
      type: 'Solo',
      entryFee: 0,
      prizePool: 0,
      date: new Date().toISOString().split('T')[0],
      time: '18:00',
      totalSlots: 48,
      joinedSlots: 0,
      map: 'Bermuda',
      rules: 'Standard rules apply.'
    };
    setData(prev => ({ ...prev, tournaments: [newT, ...prev.tournaments] }));
  };

  if (!isAuth) {
    return (
      <div className="fixed inset-0 z-[100] bg-[#0a0a0a] flex items-center justify-center p-6">
        <div className="w-full max-w-sm glass p-8 rounded-3xl text-center">
          <Lock className="w-12 h-12 text-[#ff4d00] mx-auto mb-4" />
          <h2 className="font-russo text-xl mb-6">Admin Access</h2>
          <form onSubmit={handleAuth} className="space-y-4">
            <input
              type="password"
              placeholder="Enter Admin PIN"
              className="w-full bg-white/5 border border-white/10 py-4 px-4 rounded-xl text-center font-russo text-2xl tracking-[1em]"
              value={passcode}
              onChange={e => setPasscode(e.target.value)}
              autoFocus
            />
            <div className="flex gap-3">
              <button type="button" onClick={onClose} className="flex-1 py-3 text-gray-400 font-bold">Back</button>
              <button type="submit" className="flex-[2] bg-[#ff4d00] py-3 rounded-xl font-russo">Unlock</button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-[#0a0a0a] flex flex-col h-full">
      <div className="p-4 bg-white/5 border-b border-white/10 flex justify-between items-center shrink-0">
        <div>
          <h2 className="font-russo text-[#ff4d00]">Admin Console</h2>
          <p className="text-[10px] text-gray-500 uppercase">Real-Time GitHub Sync Active</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handlePublish} 
            disabled={isSyncing}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-russo text-xs transition-all ${isSyncing ? 'bg-gray-800 text-gray-500' : 'bg-green-600 text-white hover:bg-green-500 shadow-lg shadow-green-600/20'}`}
          >
            {isSyncing ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Globe className="w-3 h-3" />}
            {isSyncing ? 'Publishing...' : 'Publish Live'}
          </button>
          <button onClick={() => setIsAuth(false)} className="p-2 bg-red-500/20 text-red-500 rounded-lg">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex border-b border-white/10 shrink-0">
        {[
          { id: 'tournaments', label: 'Matches', icon: List },
          { id: 'config', label: 'App Config', icon: Settings },
          { id: 'sync', label: 'GitHub Sync', icon: Github }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 flex flex-col items-center py-3 gap-1 border-b-2 transition-colors ${
              activeTab === tab.id ? 'border-[#ff4d00] text-[#ff4d00]' : 'border-transparent text-gray-500'
            }`}
          >
            <tab.icon className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4 pb-20">
        {syncStatus.msg && (
          <div className={`mb-4 p-3 rounded-xl border flex items-center gap-3 animate-in slide-in-from-top-2 ${
            syncStatus.type === 'success' ? 'bg-green-500/10 border-green-500/30 text-green-500' : 'bg-red-500/10 border-red-500/30 text-red-500'
          }`}>
            {syncStatus.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span className="text-xs font-bold">{syncStatus.msg}</span>
          </div>
        )}

        {activeTab === 'tournaments' && (
          <div className="space-y-4">
            <button onClick={addTournament} className="w-full py-4 border-2 border-dashed border-white/10 rounded-2xl flex items-center justify-center gap-2 text-gray-400 hover:text-white hover:border-[#ff4d00] transition-all">
              <Plus className="w-5 h-5" /> Add New Match
            </button>
            {data.tournaments.map(t => (
              <div key={t.id} className="glass p-4 rounded-2xl border border-white/5">
                <div className="flex justify-between items-start mb-4">
                  <input className="bg-transparent font-russo text-lg w-full focus:text-[#ff4d00]" value={t.title} onChange={e => updateTournament(t.id, { title: e.target.value })} />
                  <button onClick={() => deleteTournament(t.id)} className="p-2 text-red-400"><Trash2 className="w-4 h-4" /></button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[8px] uppercase text-gray-500">Entry (₹)</label>
                    <input type="number" className="w-full bg-white/5 rounded-lg py-2 px-3 text-sm" value={t.entryFee} onChange={e => updateTournament(t.id, { entryFee: Number(e.target.value) })} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[8px] uppercase text-gray-500">Prize (₹)</label>
                    <input type="number" className="w-full bg-white/5 rounded-lg py-2 px-3 text-sm" value={t.prizePool} onChange={e => updateTournament(t.id, { prizePool: Number(e.target.value) })} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[8px] uppercase text-gray-500">Joined</label>
                    <input type="number" className="w-full bg-white/5 rounded-lg py-2 px-3 text-sm" value={t.joinedSlots} onChange={e => updateTournament(t.id, { joinedSlots: Number(e.target.value) })} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[8px] uppercase text-gray-500">Total</label>
                    <input type="number" className="w-full bg-white/5 rounded-lg py-2 px-3 text-sm" value={t.totalSlots} onChange={e => updateTournament(t.id, { totalSlots: Number(e.target.value) })} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'config' && (
          <div className="space-y-6">
            <div className="glass p-5 rounded-2xl border border-white/5">
              <h3 className="font-russo text-[#ff4d00] text-sm mb-4">Payment & Contact</h3>
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-gray-500">Admin UPI ID</label>
                  <input className="w-full bg-white/5 rounded-xl py-3 px-4 text-sm" value={data.config.upiId} onChange={e => setData({...data, config: {...data.config, upiId: e.target.value}})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-gray-500">Admin WhatsApp</label>
                  <input className="w-full bg-white/5 rounded-xl py-3 px-4 text-sm" value={data.config.whatsapp} onChange={e => setData({...data, config: {...data.config, whatsapp: e.target.value}})} />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'sync' && (
          <div className="space-y-6">
            <div className="glass p-5 rounded-2xl border border-white/5">
              <div className="flex items-center gap-2 mb-4">
                <Github className="w-5 h-5 text-[#ff4d00]" />
                <h3 className="font-russo text-[#ff4d00] text-sm">GitHub Credentials</h3>
              </div>
              <p className="text-[10px] text-gray-400 mb-6 leading-relaxed">
                Configure your repository details to enable "Publish Live". Get a Personal Access Token from GitHub Settings > Developer Settings.
              </p>
              
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-gray-500">GitHub Access Token (PAT)</label>
                  <input 
                    type="password"
                    className="w-full bg-white/5 rounded-xl py-3 px-4 text-sm" 
                    placeholder="ghp_xxxxxxxxxxxx"
                    value={ghConfig.token} 
                    onChange={e => setGhConfig({...ghConfig, token: e.target.value})} 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase text-gray-500">Repo Owner</label>
                    <input className="w-full bg-white/5 rounded-xl py-3 px-4 text-sm" placeholder="username" value={ghConfig.owner} onChange={e => setGhConfig({...ghConfig, owner: e.target.value})} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase text-gray-500">Repo Name</label>
                    <input className="w-full bg-white/5 rounded-xl py-3 px-4 text-sm" placeholder="tourney-hub" value={ghConfig.repo} onChange={e => setGhConfig({...ghConfig, repo: e.target.value})} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase text-gray-500">File Path</label>
                    <input className="w-full bg-white/5 rounded-xl py-3 px-4 text-sm" value={ghConfig.path} onChange={e => setGhConfig({...ghConfig, path: e.target.value})} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase text-gray-500">Branch</label>
                    <input className="w-full bg-white/5 rounded-xl py-3 px-4 text-sm" value={ghConfig.branch} onChange={e => setGhConfig({...ghConfig, branch: e.target.value})} />
                  </div>
                </div>
                <button 
                  onClick={handleSaveGHConfig}
                  className="w-full py-3 bg-white/5 border border-white/10 rounded-xl font-bold text-xs hover:bg-white/10 transition-colors"
                >
                  Save Sync Settings
                </button>
              </div>
            </div>
            
            <div className="glass p-5 rounded-2xl border border-white/5">
              <h3 className="font-russo text-gray-400 text-xs mb-3">Manual Backup</h3>
              <textarea
                readOnly
                className="w-full h-32 bg-black/30 border border-white/10 rounded-xl p-3 text-[10px] font-mono text-blue-400"
                value={JSON.stringify(data, null, 2)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
