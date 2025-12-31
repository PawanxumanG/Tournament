
import React, { useState } from 'react';
import { AppData, Tournament } from '../types';
import { ADMIN_PASSCODE } from '../constants';
import { Lock, Save, Plus, Trash2, Copy, Check, LogOut, Image as ImageIcon, Settings, List } from 'lucide-react';

interface Props {
  initialData: AppData;
  onUpdate: (data: AppData) => void;
  onClose: () => void;
}

export const AdminPanel: React.FC<Props> = ({ initialData, onUpdate, onClose }) => {
  const [passcode, setPasscode] = useState('');
  const [isAuth, setIsAuth] = useState(false);
  const [data, setData] = useState<AppData>(initialData);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'tournaments' | 'config' | 'export'>('tournaments');

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === ADMIN_PASSCODE) {
      setIsAuth(true);
    } else {
      alert('Wrong passcode!');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
              <button 
                type="button"
                onClick={onClose}
                className="flex-1 py-3 text-gray-400 font-bold"
              >
                Back
              </button>
              <button 
                type="submit"
                className="flex-[2] bg-[#ff4d00] py-3 rounded-xl font-russo"
              >
                Unlock
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-[#0a0a0a] flex flex-col h-full">
      {/* Admin Header */}
      <div className="p-4 bg-white/5 border-b border-white/10 flex justify-between items-center shrink-0">
        <div>
          <h2 className="font-russo text-[#ff4d00]">Admin Console</h2>
          <p className="text-[10px] text-gray-500 uppercase">Manage Hub v1.0</p>
        </div>
        <div className="flex gap-2">
           <button onClick={() => onUpdate(data)} className="p-2 bg-green-500/20 text-green-500 rounded-lg">
            <Save className="w-5 h-5" />
          </button>
          <button onClick={() => setIsAuth(false)} className="p-2 bg-red-500/20 text-red-500 rounded-lg">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10 shrink-0">
        {[
          { id: 'tournaments', label: 'Matches', icon: List },
          { id: 'config', label: 'Settings', icon: Settings },
          { id: 'export', label: 'Export', icon: Copy }
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

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 pb-20">
        {activeTab === 'tournaments' && (
          <div className="space-y-4">
            <button 
              onClick={addTournament}
              className="w-full py-4 border-2 border-dashed border-white/10 rounded-2xl flex items-center justify-center gap-2 text-gray-400 hover:text-white hover:border-[#ff4d00] transition-all"
            >
              <Plus className="w-5 h-5" /> Add New Match
            </button>
            {data.tournaments.map(t => (
              <div key={t.id} className="glass p-4 rounded-2xl border border-white/5">
                <div className="flex justify-between items-start mb-4">
                  <input
                    className="bg-transparent font-russo text-lg w-full focus:text-[#ff4d00]"
                    value={t.title}
                    onChange={e => updateTournament(t.id, { title: e.target.value })}
                  />
                  <button onClick={() => deleteTournament(t.id)} className="p-2 text-red-400">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="space-y-1">
                    <label className="text-[8px] uppercase text-gray-500">Entry (₹)</label>
                    <input 
                      type="number"
                      className="w-full bg-white/5 rounded-lg py-2 px-3 text-sm"
                      value={t.entryFee}
                      onChange={e => updateTournament(t.id, { entryFee: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[8px] uppercase text-gray-500">Prize (₹)</label>
                    <input 
                      type="number"
                      className="w-full bg-white/5 rounded-lg py-2 px-3 text-sm"
                      value={t.prizePool}
                      onChange={e => updateTournament(t.id, { prizePool: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[8px] uppercase text-gray-500">Slots Joined</label>
                    <input 
                      type="number"
                      className="w-full bg-white/5 rounded-lg py-2 px-3 text-sm"
                      value={t.joinedSlots}
                      onChange={e => updateTournament(t.id, { joinedSlots: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[8px] uppercase text-gray-500">Total Slots</label>
                    <input 
                      type="number"
                      className="w-full bg-white/5 rounded-lg py-2 px-3 text-sm"
                      value={t.totalSlots}
                      onChange={e => updateTournament(t.id, { totalSlots: Number(e.target.value) })}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'config' && (
          <div className="space-y-6">
            <div className="glass p-5 rounded-2xl border border-white/5">
              <h3 className="font-russo text-[#ff4d00] text-sm mb-4">Core Config</h3>
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-gray-500">Admin UPI ID</label>
                  <input
                    className="w-full bg-white/5 rounded-xl py-3 px-4 text-sm"
                    value={data.config.upiId}
                    onChange={e => setData({...data, config: {...data.config, upiId: e.target.value}})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-gray-500">Admin WhatsApp</label>
                  <input
                    className="w-full bg-white/5 rounded-xl py-3 px-4 text-sm"
                    value={data.config.whatsapp}
                    onChange={e => setData({...data, config: {...data.config, whatsapp: e.target.value}})}
                  />
                </div>
              </div>
            </div>

            <div className="glass p-5 rounded-2xl border border-white/5">
              <h3 className="font-russo text-[#ff4d00] text-sm mb-4">Banners</h3>
              <div className="space-y-3">
                {data.config.banners.map((banner, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input
                      className="flex-1 bg-white/5 rounded-lg py-2 px-3 text-[10px]"
                      value={banner}
                      onChange={e => {
                        const newBanners = [...data.config.banners];
                        newBanners[idx] = e.target.value;
                        setData({...data, config: {...data.config, banners: newBanners}});
                      }}
                    />
                    <button 
                      onClick={() => setData({...data, config: {...data.config, banners: data.config.banners.filter((_, i) => i !== idx)}})}
                      className="p-2 text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button 
                  onClick={() => setData({...data, config: {...data.config, banners: [...data.config.banners, '']}})}
                  className="w-full py-2 bg-white/5 rounded-lg text-xs font-bold"
                >
                  Add Banner URL
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'export' && (
          <div className="space-y-6">
            <div className="glass p-5 rounded-2xl border border-white/5">
              <h3 className="font-russo text-[#ff4d00] mb-2">Sync with GitHub</h3>
              <p className="text-xs text-gray-400 mb-6 leading-relaxed">
                Copy this JSON code and paste it into your <strong>tournaments.json</strong> file on GitHub to update the app for all users.
              </p>
              
              <div className="relative">
                <textarea
                  readOnly
                  className="w-full h-64 bg-black/50 border border-white/10 rounded-xl p-4 text-[10px] font-mono text-blue-400"
                  value={JSON.stringify(data, null, 2)}
                />
                <button 
                  onClick={handleCopy}
                  className="absolute top-2 right-2 p-3 bg-[#ff4d00] rounded-xl shadow-lg flex items-center gap-2 font-russo text-xs"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied!' : 'Copy JSON'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
