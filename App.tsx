import React, { useState, useEffect } from 'react';
import { AppData, UserProfile, Tournament, JoinedHistory } from './types.ts';
import { fetchAppData } from './services/dataService.ts';
import { Onboarding } from './components/Onboarding.tsx';
import { TournamentCard } from './components/TournamentCard.tsx';
import { RegistrationModal } from './components/RegistrationModal.tsx';
import { AdminPanel } from './components/AdminPanel.tsx';
import { LayoutGrid, History, Shield, Trophy, User } from 'lucide-react';

export default function App() {
  const [data, setData] = useState<AppData | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [history, setHistory] = useState<JoinedHistory[]>([]);
  const [activeTab, setActiveTab] = useState<'home' | 'history' | 'profile'>('home');
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [showAdmin, setShowAdmin] = useState(false);
  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      try {
        const appData = await fetchAppData();
        setData(appData);

        const savedProfile = localStorage.getItem('UserProfile');
        if (savedProfile) {
          try {
            setUserProfile(JSON.parse(savedProfile));
          } catch (e) {
            localStorage.removeItem('UserProfile');
          }
        }

        const savedHistory = localStorage.getItem('JoinedHistory');
        if (savedHistory) {
          try {
            setHistory(JSON.parse(savedHistory));
          } catch (e) {
            localStorage.removeItem('JoinedHistory');
          }
        }
      } catch (err) {
        console.error("Critical app load error:", err);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (data?.config.banners.length) {
      const timer = setInterval(() => {
        setCurrentBanner(prev => (prev + 1) % data.config.banners.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [data]);

  const handleOnboarding = (profile: UserProfile) => {
    setUserProfile(profile);
    localStorage.setItem('UserProfile', JSON.stringify(profile));
  };

  const handleJoinComplete = () => {
    if (!selectedTournament) return;

    const newEntry: JoinedHistory = {
      tournamentId: selectedTournament.id,
      tournamentTitle: selectedTournament.title,
      date: selectedTournament.date,
      entryFee: selectedTournament.entryFee,
      status: 'Pending',
      joinedAt: Date.now()
    };

    const updatedHistory = [newEntry, ...history];
    setHistory(updatedHistory);
    localStorage.setItem('JoinedHistory', JSON.stringify(updatedHistory));
    setSelectedTournament(null);
    setActiveTab('history');
  };

  if (!data) {
    return (
      <div className="fixed inset-0 bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-[#ff4d00]/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-[#ff4d00] border-t-transparent rounded-full animate-spin"></div>
            <Trophy className="absolute inset-0 m-auto w-6 h-6 text-[#ff4d00]" />
          </div>
          <p className="font-russo text-white tracking-widest uppercase animate-pulse">Syncing Hub...</p>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return <Onboarding onComplete={handleOnboarding} />;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-24 text-white overflow-x-hidden">
      <header className="sticky top-0 z-40 bg-black/60 backdrop-blur-xl px-5 py-4 flex justify-between items-center border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#ff4d00] to-[#ff8000] rounded-xl flex items-center justify-center shadow-lg shadow-[#ff4d00]/30 transform -rotate-3 hover:rotate-0 transition-transform cursor-pointer" onClick={() => setActiveTab('home')}>
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-russo tracking-tight leading-none text-white">FF HUB</h1>
            <p className="text-[10px] text-[#ff4d00] uppercase font-bold tracking-tighter">Premier Series</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-gray-400 leading-none mb-1">{userProfile.ign}</p>
            <p className="text-[10px] text-green-500 font-bold uppercase">LVL {userProfile.level}</p>
          </div>
          <button 
            onClick={() => setActiveTab('profile')}
            className={`w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center ${activeTab === 'profile' ? 'border-[#ff4d00] bg-[#ff4d00]/10' : 'border-white/10 bg-white/5'}`}
          >
            <User className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="px-5 pt-6 max-w-lg mx-auto">
        {activeTab === 'home' && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="relative h-48 rounded-2xl overflow-hidden glass border border-white/10 shadow-2xl group">
              {data.config.banners.map((url, idx) => (
                <div 
                  key={idx}
                  className={`absolute inset-0 transition-all duration-1000 transform ${currentBanner === idx ? 'opacity-100 scale-100' : 'opacity-0 scale-110'}`}
                >
                  <img src={url} alt="Banner" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
                  <div className="absolute bottom-5 left-5">
                    <span className="text-[10px] font-bold text-[#ff4d00] bg-[#ff4d00]/10 px-2 py-0.5 rounded border border-[#ff4d00]/30 uppercase mb-2 inline-block">Pro Series</span>
                    <h2 className="text-2xl font-russo text-white leading-tight">MASTER THE<br/>BATTLEGROUND</h2>
                  </div>
                </div>
              ))}
              <div className="absolute bottom-5 right-5 flex gap-1.5">
                {data.config.banners.map((_, idx) => (
                  <div key={idx} className={`w-1.5 h-1.5 rounded-full transition-all ${currentBanner === idx ? 'bg-[#ff4d00] w-4' : 'bg-white/30'}`} />
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center mb-2">
                <h2 className="font-russo text-lg text-white flex items-center gap-2">
                  Live Matches
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
                </h2>
                <button 
                  onClick={() => window.location.reload()}
                  className="text-[10px] uppercase font-bold text-[#ff4d00] hover:underline"
                >
                  Refresh Slots
                </button>
              </div>
              
              {data.tournaments.map(tournament => (
                <div key={tournament.id}>
                  <TournamentCard 
                    tournament={tournament} 
                    onJoin={setSelectedTournament} 
                  />
                </div>
              ))}
              
              {data.tournaments.length === 0 && (
                <div className="glass p-12 rounded-3xl text-center border-dashed border-2 border-white/5">
                  <p className="text-gray-500 uppercase font-russo text-sm">Waiting for new drops...</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-6 animate-in fade-in duration-500">
             <div className="flex justify-between items-end mb-2">
                <h2 className="font-russo text-lg text-white">Battle History</h2>
                <span className="text-[10px] uppercase font-bold text-gray-500">{history.length} Matches</span>
            </div>
            {history.length > 0 ? (
              <div className="space-y-4">
                {history.map((entry, idx) => (
                  <div key={idx} className="glass p-5 rounded-2xl border border-white/5 flex justify-between items-center group hover:bg-white/[0.07] transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-russo text-xl ${entry.status === 'Confirmed' ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'}`}>
                        {entry.status[0]}
                      </div>
                      <div>
                        <h4 className="font-russo text-white group-hover:text-[#ff4d00] transition-colors">{entry.tournamentTitle}</h4>
                        <p className="text-[10px] text-gray-500 uppercase tracking-tighter">{entry.date} • ₹{entry.entryFee}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-[10px] px-2 py-1 rounded-md font-bold uppercase tracking-widest ${
                        entry.status === 'Confirmed' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'
                      }`}>
                        {entry.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="glass py-20 px-8 rounded-3xl text-center space-y-4 border border-white/5">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                  <History className="w-8 h-8 text-gray-600" />
                </div>
                <h3 className="font-russo text-lg">No Battles Recorded</h3>
                <p className="text-gray-500 text-xs max-w-[200px] mx-auto">Your journey starts here. Join your first match and dominate the arena.</p>
                <button 
                  onClick={() => setActiveTab('home')}
                  className="bg-[#ff4d00] text-white px-8 py-3 rounded-xl font-russo text-xs shadow-lg shadow-[#ff4d00]/20 active:scale-95 transition-all"
                >
                  Join Match
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="space-y-6 animate-in fade-in duration-500">
             <div className="flex justify-between items-end mb-2">
                <h2 className="font-russo text-lg text-white">Player Profile</h2>
                <button 
                  onClick={() => setShowAdmin(true)}
                  className="p-2 bg-white/5 rounded-lg text-gray-500 hover:text-white"
                >
                  <Shield className="w-5 h-5" />
                </button>
            </div>
            
            <div className="glass p-8 rounded-3xl text-center border border-white/10 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-[#ff4d00]/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
               <div className="w-24 h-24 bg-gradient-to-br from-gray-800 to-black rounded-3xl mx-auto mb-4 flex items-center justify-center border-2 border-white/10 shadow-2xl">
                  <User className="w-12 h-12 text-[#ff4d00]" />
               </div>
               <h3 className="text-xl font-russo">{userProfile.ign}</h3>
               <p className="text-sm text-gray-500 font-bold uppercase tracking-widest mb-6">Level {userProfile.level} • Pro Elite</p>
               
               <div className="grid grid-cols-2 gap-4">
                 <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                    <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">UID</p>
                    <p className="font-russo text-white">{userProfile.uid}</p>
                 </div>
                 <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                    <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Total Wins</p>
                    <p className="font-russo text-green-500">0</p>
                 </div>
               </div>
               
               <button 
                onClick={() => {
                  if (confirm('Logging out will reset your profile. Continue?')) {
                    localStorage.removeItem('UserProfile');
                    window.location.reload();
                  }
                }}
                className="mt-8 text-xs text-red-500 font-bold uppercase hover:underline"
               >
                 Reset Profile
               </button>
            </div>
          </div>
        )}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-2xl border-t border-white/5 px-8 py-3 pb-8">
        <div className="max-w-md mx-auto flex justify-between items-center">
          {[
            { id: 'home', icon: LayoutGrid, label: 'Arena' },
            { id: 'history', icon: History, label: 'Vault' },
            { id: 'profile', icon: User, label: 'Profile' }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex flex-col items-center gap-1 transition-all group ${activeTab === tab.id ? 'text-[#ff4d00] scale-110' : 'text-gray-500'}`}
            >
              <div className={`p-1.5 rounded-lg transition-colors ${activeTab === tab.id ? 'bg-[#ff4d00]/10' : 'group-hover:bg-white/5'}`}>
                <tab.icon className="w-6 h-6" />
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-tighter ${activeTab === tab.id ? 'opacity-100' : 'opacity-40'}`}>
                {tab.label}
              </span>
            </button>
          ))}
        </div>
      </nav>

      {selectedTournament && (
        <RegistrationModal 
          tournament={selectedTournament}
          userProfile={userProfile}
          config={data.config}
          onClose={() => setSelectedTournament(null)}
          onComplete={handleJoinComplete}
        />
      )}

      {showAdmin && (
        <AdminPanel 
          initialData={data}
          onUpdate={setData}
          onClose={() => setShowAdmin(false)}
        />
      )}
    </div>
  );
}