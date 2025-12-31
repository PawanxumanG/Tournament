
import React, { useState, useRef } from 'react';
import { Tournament, UserProfile, AppConfig } from '../types.ts';
import { X, ChevronRight, MessageCircle, Upload, AlertCircle } from 'lucide-react';

interface Props {
  tournament: Tournament;
  userProfile: UserProfile;
  config: AppConfig;
  onClose: () => void;
  onComplete: () => void;
}

export const RegistrationModal: React.FC<Props> = ({ tournament, userProfile, config, onClose, onComplete }) => {
  const [step, setStep] = useState(1);
  const [editedProfile, setEditedProfile] = useState(userProfile);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const upiLink = `upi://pay?pa=${config.upiId}&pn=FF_Hub&am=${tournament.entryFee}&cu=INR`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiLink)}`;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setPreviewUrl(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleWhatsApp = () => {
    const text = `*NEW REGISTRATION*\n\n` +
      `Player: ${editedProfile.name}\n` +
      `IGN: ${editedProfile.ign}\n` +
      `UID: ${editedProfile.uid}\n` +
      `Match: ${tournament.title}\n` +
      `Fee Paid: ₹${tournament.entryFee}\n\n` +
      `I have paid the entry fee and attached the screenshot. Please confirm my slot.`;
    
    const url = `https://wa.me/${config.whatsapp}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative glass w-full max-w-md rounded-3xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black/40">
          <div>
            <h3 className="font-russo text-lg">Registration</h3>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest">Step {step} of 3</p>
          </div>
          <button onClick={onClose} className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors"><X className="w-5 h-5"/></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <div>
                <h4 className="font-russo text-[#ff4d00] mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#ff4d00] rounded-full animate-pulse" />
                  Match Rules
                </h4>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {tournament.rules}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
                  <p className="text-[10px] text-gray-400 uppercase font-bold">Prize Pool</p>
                  <p className="font-russo text-xl text-green-500">₹{tournament.prizePool}</p>
                </div>
                <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
                  <p className="text-[10px] text-gray-400 uppercase font-bold">Entry Fee</p>
                  <p className="font-russo text-xl text-[#ff4d00]">₹{tournament.entryFee}</p>
                </div>
              </div>
              <button 
                onClick={() => setStep(2)}
                className="w-full bg-[#ff4d00] py-4 rounded-xl font-russo flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-[#ff4d00]/20"
              >
                Confirm Details <ChevronRight className="w-5 h-5"/>
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
              <h4 className="font-russo text-[#ff4d00] flex items-center gap-2">
                 <span className="w-2 h-2 bg-[#ff4d00] rounded-full" />
                 Player Confirmation
              </h4>
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-gray-500 font-bold px-1">Full Name</label>
                  <input 
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:border-[#ff4d00] transition-colors"
                    value={editedProfile.name}
                    onChange={e => setEditedProfile({...editedProfile, name: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase text-gray-500 font-bold px-1">IGN</label>
                    <input 
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:border-[#ff4d00] transition-colors"
                      value={editedProfile.ign}
                      onChange={e => setEditedProfile({...editedProfile, ign: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase text-gray-500 font-bold px-1">UID</label>
                    <input 
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:border-[#ff4d00] transition-colors"
                      value={editedProfile.uid}
                      onChange={e => setEditedProfile({...editedProfile, uid: e.target.value})}
                    />
                  </div>
                </div>
              </div>
              <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl flex gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-500 shrink-0" />
                <p className="text-xs text-yellow-500/80 italic">
                  Wrong IGN/UID leads to disqualification without refund.
                </p>
              </div>
              <button 
                onClick={() => setStep(3)}
                className="w-full bg-[#ff4d00] py-4 rounded-xl font-russo flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition-all"
              >
                Proceed to Pay <ChevronRight className="w-5 h-5"/>
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 text-center animate-in fade-in slide-in-from-right-4">
              <div>
                <h4 className="font-russo text-[#ff4d00] mb-1">Scan & Pay</h4>
                <p className="text-sm text-gray-400">Amount: <span className="text-white font-bold">₹{tournament.entryFee}</span></p>
              </div>
              
              <div className="flex justify-center">
                <div className="bg-white p-4 rounded-2xl shadow-xl shadow-[#ff4d00]/10 border-4 border-[#ff4d00]/20">
                  <img src={qrUrl} alt="UPI QR" className="w-48 h-48" />
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-xs text-gray-400 uppercase font-bold tracking-widest">Payment Proof</p>
                
                {!previewUrl ? (
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full border-2 border-dashed border-white/20 rounded-2xl p-6 flex flex-col items-center gap-2 hover:border-[#ff4d00] hover:bg-white/5 transition-all"
                  >
                    <Upload className="w-8 h-8 text-gray-500" />
                    <span className="text-sm font-bold text-gray-400">Upload Payment Screenshot</span>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      accept="image/*" 
                      onChange={handleFileUpload}
                    />
                  </button>
                ) : (
                  <div className="relative rounded-2xl overflow-hidden border border-white/10 aspect-video bg-black">
                    <img src={previewUrl} className="w-full h-full object-contain" alt="Payment Proof" />
                    <button 
                      onClick={() => setPreviewUrl(null)}
                      className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-full hover:bg-red-500 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              <button 
                onClick={handleWhatsApp}
                disabled={!previewUrl}
                className={`w-full py-4 rounded-xl font-russo flex items-center justify-center gap-2 transition-all ${
                  !previewUrl 
                  ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
                  : 'bg-[#25D366] text-white hover:brightness-110 active:scale-95 shadow-lg shadow-green-500/20'
                }`}
              >
                <MessageCircle className="w-5 h-5"/> Confirm on WhatsApp
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
