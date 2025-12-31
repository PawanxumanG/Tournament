
import React, { useState, useEffect } from 'react';
import { AppData, Tournament } from '../types.ts';
import { ADMIN_PASSCODE } from '../constants.ts';
import { GitHubConfig, getGitHubConfig, saveGitHubConfig, pushToGitHub } from '../services/githubService.ts';
import { 
  Lock, Save, Plus, Trash2, Copy, Check, LogOut, 
  Settings, List, Globe, RefreshCw, AlertCircle, Github, Info
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
    setSyncStatus({ type: 'success', msg: 'Sync settings saved locally.' });
    setTimeout(() => setSyncStatus({ type: null, msg: '' }), 3000);
  };

  const handlePublish = async () => {
    if (!ghConfig.token || !ghConfig.owner || !ghConfig.repo) {
      setActiveTab('sync');
      setSyncStatus({ type: 'error', msg: 'Configure GitHub settings first.' });
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
              placeholder="Enter PIN"
              className="w-full bg-white/5 border border-white/10 py-4 px-4 rounded-xl text-center font-russo text-2xl tracking-[0.5em]"
              value={passcode}
              onChange={e => setPasscode(e.target.value)}
              autoFocus
            />
            <div className="flex gap-3">
              <button type="button" onClick={onClose} className="flex-1 py-3 text-gray-400 font-bold uppercase text-xs">Back</button>
              <button type="submit" className="flex-[2] bg-[#ff4d00] py-3 rounded-xl font-russo text-sm">Unlock</button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-[#0a0a0a] flex flex-col h-full animate-in fade-in zoom-in-95 duration-200">
      <div className="p-4 bg-white/5 border-b border-white/10 flex justify-between items-center shrink-0">
        <div>
          <h2 className="font-russo text-[#ff4d00] text-sm">Admin Console</h2>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest">Live Hub Management</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handlePublish} 
            disabled={isSyncing}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-russo text-[10px] transition-all ${isSyncing ? 'bg-gray-800 text-gray-500' : 'bg-green-600 text-white hover:bg-green-500 shadow-lg shadow-green-600/20 active:scale-95'}`}
          >
            {isSyncing ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Globe className="w-3 h-3" />}
            {isSyncing ? 'SYNCING...' : 'PUBLISH LIVE'}
          </button>
          <button onClick={() => setIsAuth(false)} className="p-2 bg-white/5 text-gray-500 rounded-lg hover:text-white">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex border-b border-white/10 shrink-0 bg-black/20">
        {[
          { id: 'tournaments', label: 'Matches', icon: List },
          { id: 'config', label: 'Settings', icon: Settings },
          { id: 'sync', label: 'GitHub Sync', icon: Github }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 flex flex-col items-center py-3 gap-1 border-b-2 transition-all ${
              activeTab === tab.id ? 'border-[#ff4d00] text-[#ff4d00] bg-[#ff4d00]/5' : 'border-transparent text-gray-500'
            }`}
          >
            <tab.icon className={`w-5 h-5 transition-transform ${activeTab === tab.id ? 'scale-110' : ''}`} />
            <span className="text-[9px] font-bold uppercase tracking-tighter">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4 pb-24">
        {syncStatus.msg && (
          <div className={`mb-4 p-4 rounded-xl border flex items-center gap-3 animate-in slide-in-from-top-2 ${
            syncStatus.type === 'success' ? 'bg-green-500/10 border-green-500/30 text-green-500' : 'bg-red-500/10 border-red-500/30 text-red-500'
          }`}>
            {syncStatus.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span className="text-xs font-bold">{syncStatus.msg}</span>
          </div>
        )}

        {activeTab === 'tournaments' && (
          <div className="space-y-4">
            <button onClick={addTournament} className="w-full py-5 border-2 border-dashed border-white/10 rounded-2xl flex items-center justify-center gap-2 text-gray-400 hover:text-white hover:border-[#ff4d00] transition-all bg-white/5">
              <Plus className="w-5 h-5" />
              <span className="font-russo text-xs">Create New Tournament</span>
            </button>
            {data.tournaments.map(t => (
              <div key={t.id} className="glass p-5 rounded-2xl border border-white/5 space-y-4">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1 space-y-1">
                    <label className="text-[8px] uppercase text-gray-500 font-bold">Match Title</label>
                    <input className="w-full bg-white/5 rounded-lg py-2 px-3 text-sm font-russo focus:text-[#ff4d00]" value={t.title} onChange={e => updateTournament(t.id, { title: e.target.value })} />
                  </div>
                  <button onClick={() => deleteTournament(t.id)} className="p-2 text-gray-600 hover:text-red-500 transition-colors mt-4">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[8px] uppercase text-gray-500 font-bold">Entry Fee (₹)</label>
                    <input type="number" className="w-full bg-white/5 rounded-lg py-2 px-3 text-sm" value={t.entryFee} onChange={e => updateTournament(t.id, { entryFee: Number(e.target.value) })} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[8px] uppercase text-gray-500 font-bold">Prize Pool (₹)</label>
                    <input type="number" className="w-full bg-white/5 rounded-lg py-2 px-3 text-sm" value={t.prizePool} onChange={e => updateTournament(t.id, { prizePool: Number(e.target.value) })} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[8px] uppercase text-gray-500 font-bold">Slots Occupied</label>
                    <input type="number" className="w-full bg-white/5 rounded-lg py-2 px-3 text-sm" value={t.joinedSlots} onChange={e => updateTournament(t.id, { joinedSlots: Number(e.target.value) })} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[8px] uppercase text-gray-500 font-bold">Total Slots</label>
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
              <h3 className="font-russo text-[#ff4d00] text-xs mb-4">Core Platform Info</h3>
              <div className="space-y-5">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-gray-500 font-bold">Admin UPI ID (For Payments)</label>
                  <input className="w-full bg-white/5 rounded-xl py-3 px-4 text-sm focus:border-[#ff4d00]" value={data.config.upiId} onChange={e => setData({...data, config: {...data.config, upiId: e.target.value}})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-gray-500 font-bold">WhatsApp Number (For Support)</label>
                  <input className="w-full bg-white/5 rounded-xl py-3 px-4 text-sm focus:border-[#ff4d00]" value={data.config.whatsapp} onChange={e => setData({...data, config: {...data.config, whatsapp: e.target.value}})} />
                </div>
              </div>
            </div>
            
             <div className="glass p-5 rounded-2xl border border-white/5">
              <h3 className="font-russo text-gray-400 text-[10px] mb-4">Promotional Banners (URLs)</h3>
              <div className="space-y-3">
                {data.config.banners.map((banner, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input className="flex-1 bg-white/5 rounded-lg py-2 px-3 text-[10px]" value={banner} onChange={e => {
                        const newBanners = [...data.config.banners];
                        newBanners[idx] = e.target.value;
                        setData({...data, config: {...data.config, banners: newBanners}});
                    }} />
                    <button onClick={() => setData({...data, config: {...data.config, banners: data.config.banners.filter((_, i) => i !== idx)}})} className="p-2 text-red-500"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
                <button onClick={() => setData({...data, config: {...data.config, banners: [...data.config.banners, '']}})} className="w-full py-2 bg-white/10 rounded-lg text-[10px] font-bold uppercase">Add Image URL</button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'sync' && (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
            <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-2xl flex gap-3">
               <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
               <p className="text-[10px] text-blue-300/80 leading-relaxed">
                 To sync changes, upload <strong>tournaments.json</strong> to your GitHub repo. Click "Publish Live" to update it instantly.
               </p>
            </div>

            <div className="glass p-6 rounded-2xl border border-white/10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/10">
                  <Github className="w-6 h-6 text-[#ff4d00]" />
                </div>
                <h3 className="font-russo text-white text-sm uppercase">GitHub Sync Access</h3>
              </div>
              
              <div className="space-y-5">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-gray-500 font-bold">Personal Access Token (Classic PAT)</label>
                  <input type="password" placeholder="ghp_xxxxxxxxxxxx" className="w-full bg-white/5 rounded-xl py-3 px-4 text-sm font-mono focus:border-[#ff4d00]" value={ghConfig.token} onChange={e => setGhConfig({...ghConfig, token: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase text-gray-500 font-bold">Repo Owner</label>
                    <input className="w-full bg-white/5 rounded-xl py-3 px-4 text-sm" placeholder="username" value={ghConfig.owner} onChange={e => setGhConfig({...ghConfig, owner: e.target.value})} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase text-gray-500 font-bold">Repo Name</label>
                    <input className="w-full bg-white/5 rounded-xl py-3 px-4 text-sm" placeholder="my-esports-hub" value={ghConfig.repo} onChange={e => setGhConfig({...ghConfig, repo: e.target.value})} />
                  </div>
                </div>
                <button 
                  onClick={handleSaveGHConfig}
                  className="w-full py-4 bg-[#ff4d00]/10 border border-[#ff4d00]/30 text-[#ff4d00] rounded-xl font-russo text-[10px] tracking-wider hover:bg-[#ff4d00] hover:text-white transition-all"
                >
                  SAVE SYNC CREDENTIALS
                </button>
              </div>
            </div>

            <div className="glass p-5 rounded-2xl border border-white/5">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-russo text-gray-500 text-[10px]">JSON Output Preview</h3>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
                    setSyncStatus({ type: 'success', msg: 'JSON copied to clipboard!' });
                  }}
                  className="text-[9px] font-bold text-[#ff4d00] hover:underline uppercase"
                >
                  Copy All
                </button>
              </div>
              <textarea
                readOnly
                className="w-full h-40 bg-black/30 border border-white/5 rounded-xl p-3 text-[10px] font-mono text-blue-400"
                value={JSON.stringify(data, null, 2)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
