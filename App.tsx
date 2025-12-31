
import React, { useState, useEffect, useRef } from 'react';
import { AppData, UserProfile, Tournament, JoinedHistory } from './types';
import { fetchAppData } from './services/dataService';
import { Onboarding } from './components/Onboarding';
import { TournamentCard } from './components/TournamentCard';
import { RegistrationModal } from './components/RegistrationModal';
import { AdminPanel } from './components/AdminPanel';
import { LayoutGrid, History, Shield, Trophy, ChevronRight } from 'lucide-react';

export default function App() {
  const [data, setData] = useState<AppData | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [history, setHistory] = useState<JoinedHistory[]>([]);
  const [activeTab, setActiveTab] = useState<'home' | 'history' | 'admin'>('home');
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [showAdmin, setShowAdmin] = useState(false);
  const [currentBanner, setCurrentBanner] = useState(0);

  // Load Initial State
  useEffect(() => {
    const loadData = async () => {
      const appData = await fetchAppData();
      setData(appData);

      const savedProfile = localStorage.getItem('UserProfile');
      if (savedProfile) setUserProfile(JSON.parse(savedProfile));

      const savedHistory = localStorage.getItem('JoinedHistory');
      if (savedHistory) setHistory(JSON.parse(savedHistory));
    };
    loadData();
  }, []);

  // Banner Auto-Slide
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

  const handleAdminUpdate = (newData: AppData) => {
    setData(newData);
    // Note: This only updates local state. 
    // Users must export JSON and update GitHub for persistent change.
  };

  if (!data) {
    return (
      <div className="fixed inset-0 bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#ff4d00] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-russo text-gray-500 tracking-widest uppercase">Initializing Hub...</p>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return <Onboarding onComplete={handleOnboarding} />;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-24 text-white">
      {/* App Header */}
      <header className="sticky top-0 z-40 bg-[#0a0a0a]/80 backdrop-blur-md px-5 py-4 flex justify-between items-center border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#ff4d00] rounded-xl flex items-center justify-center shadow-lg shadow-[#ff4d00]/20">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-russo tracking-tight leading-none">FF HUB</h1>
            <p className="text-[10px] text-gray-500 uppercase font-bold">Elite Esports</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs font-bold text-gray-400 leading-none mb-1">{userProfile.ign}</p>
          <div className="flex items-center gap-1.5 justify-end">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
            <p className="text-[10px] text-green-500 font-bold uppercase">Online</p>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="px-5 pt-6">
        {activeTab === 'home' && (
          <div className="space-y-6">
            {/* Banner Slider */}
            <div className="relative h-44 rounded-2xl overflow-hidden glass border border-white/5 shadow-2xl">
              {data.config.banners.map((url, idx) => (
                <div 
                  key={idx}
                  className={`absolute inset-0 transition-opacity duration-1000 ${currentBanner === idx ? 'opacity-100' : 'opacity-0'}`}
                >
                  <img src={url} alt="Banner" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                  <div className="absolute bottom-4 left-5">
                    <h2 className="text-xl font-russo text-white leading-tight">PREMIUM<br/>TOURNAMENTS</h2>
                  </div>
                </div>
              ))}
              <div className="absolute bottom-4 right-5 flex gap-1.5">
                {data.config.banners.map((_, idx) => (
                  <div key={idx} className={`w-1.5 h-1.5 rounded-full ${currentBanner === idx ? 'bg-[#ff4d00]' : 'bg-white/30'}`} />
                ))}
              </div>
            </div>

            {/* Tournaments Grid */}
            <div className="space-y-4">
              <div className="flex justify-between items-end mb-2">
                <h2 className="font-russo text-lg text-white">Live Matches</h2>
                <span className="text-[10px] uppercase font-bold text-[#ff4d00]">Refresh for new slots</span>
              </div>
              {data.tournaments.map(tournament => (
                <TournamentCard 
                  key={tournament.id} 
                  tournament={tournament} 
                  onJoin={setSelectedTournament} 
                />
              ))}
              {data.tournaments.length === 0 && (
                <div className="glass p-10 rounded-3xl text-center">
                  <p className="text-gray-500 uppercase font-bold text-sm">No Live Tournaments Found</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-6">
             <div className="flex justify-between items-end mb-2">
                <h2 className="font-russo text-lg text-white">Joined Matches</h2>
                <span className="text-[10px] uppercase font-bold text-gray-500">History</span>
            </div>
            {history.length > 0 ? (
              <div className="space-y-4">
                {history.map((entry, idx) => (
                  <div key={idx} className="glass p-5 rounded-2xl border border-white/5 flex justify-between items-center">
                    <div>
                      <h4 className="font-russo text-white">{entry.tournamentTitle}</h4>
                      <p className="text-xs text-gray-500">{entry.date}</p>
                    </div>
                    <div className="text-right">
                      <span className={`text-[10px] px-2 py-1 rounded-md font-bold uppercase ${
                        entry.status === 'Confirmed' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'
                      }`}>
                        {entry.status}
                      </span>
                      <p className="text-xs font-bold mt-1">₹{entry.entryFee}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="glass py-12 px-8 rounded-3xl text-center space-y-4">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto">
                  <History className="w-8 h-8 text-gray-600" />
                </div>
                <p className="text-gray-500 uppercase font-bold text-sm">You haven't joined any matches yet.</p>
                <button 
                  onClick={() => setActiveTab('home')}
                  className="bg-white/10 text-white px-6 py-3 rounded-xl font-russo text-xs"
                >
                  Explore Tournaments
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-xl border-t border-white/5 px-6 py-3 pb-8">
        <div className="max-w-md mx-auto flex justify-between items-center">
          <button 
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'home' ? 'text-[#ff4d00] scale-110' : 'text-gray-500'}`}
          >
            <LayoutGrid className="w-6 h-6" />
            <span className="text-[10px] font-bold uppercase">Tourney</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('history')}
            className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'history' ? 'text-[#ff4d00] scale-110' : 'text-gray-500'}`}
          >
            <History className="w-6 h-6" />
            <span className="text-[10px] font-bold uppercase">Joined</span>
          </button>

          <button 
            onClick={() => setShowAdmin(true)}
            className="flex flex-col items-center gap-1 text-gray-500 hover:text-white"
          >
            <Shield className="w-6 h-6" />
            <span className="text-[10px] font-bold uppercase">Admin</span>
          </button>
        </div>
      </nav>

      {/* Modals */}
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
          onUpdate={handleAdminUpdate}
          onClose={() => setShowAdmin(false)}
        />
      )}
    </div>
  );
}
