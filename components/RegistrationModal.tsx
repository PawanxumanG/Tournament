
import React, { useState } from 'react';
import { Tournament, UserProfile, AppConfig } from '../types';
import { X, CheckCircle2, ChevronRight, MessageCircle } from 'lucide-react';

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

  const upiLink = `upi://pay?pa=${config.upiId}&pn=FF_Hub&am=${tournament.entryFee}&cu=INR`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiLink)}`;

  const handleWhatsApp = () => {
    const text = `*NEW REGISTRATION*\n\n` +
      `Player: ${editedProfile.name}\n` +
      `IGN: ${editedProfile.ign}\n` +
      `UID: ${editedProfile.uid}\n` +
      `Match: ${tournament.title}\n` +
      `Fee Paid: ₹${tournament.entryFee}\n\n` +
      `I have paid the entry fee via UPI. Please confirm my slot.`;
    
    const url = `https://wa.me/${config.whatsapp}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative glass w-full max-w-md rounded-3xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex justify-between items-center">
          <div>
            <h3 className="font-russo text-lg">Registration</h3>
            <p className="text-[10px] text-gray-400 uppercase">Step {step} of 3</p>
          </div>
          <button onClick={onClose} className="p-2 bg-white/5 rounded-full"><X className="w-5 h-5"/></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h4 className="font-russo text-[#ff4d00] mb-2">Match Rules</h4>
                <div className="bg-white/5 rounded-xl p-4 text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {tournament.rules}
                </div>
              </div>
              <div>
                <h4 className="font-russo text-[#ff4d00] mb-2">Details</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 p-3 rounded-xl">
                    <p className="text-[10px] text-gray-400 uppercase">Prize Pool</p>
                    <p className="font-russo">₹{tournament.prizePool}</p>
                  </div>
                  <div className="bg-white/5 p-3 rounded-xl">
                    <p className="text-[10px] text-gray-400 uppercase">Entry Fee</p>
                    <p className="font-russo">₹{tournament.entryFee}</p>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setStep(2)}
                className="w-full bg-[#ff4d00] py-4 rounded-xl font-russo flex items-center justify-center gap-2"
              >
                Confirm Details <ChevronRight className="w-5 h-5"/>
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h4 className="font-russo text-[#ff4d00]">Player Confirmation</h4>
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-gray-500 font-bold px-1">Full Name</label>
                  <input 
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:border-[#ff4d00]"
                    value={editedProfile.name}
                    onChange={e => setEditedProfile({...editedProfile, name: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-gray-500 font-bold px-1">IGN & UID</label>
                  <div className="grid grid-cols-2 gap-3">
                    <input 
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:border-[#ff4d00]"
                      value={editedProfile.ign}
                      onChange={e => setEditedProfile({...editedProfile, ign: e.target.value})}
                    />
                    <input 
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:border-[#ff4d00]"
                      value={editedProfile.uid}
                      onChange={e => setEditedProfile({...editedProfile, uid: e.target.value})}
                    />
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-500 italic p-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                Ensure your IGN and UID match exactly with your Free Fire profile.
              </p>
              <button 
                onClick={() => setStep(3)}
                className="w-full bg-[#ff4d00] py-4 rounded-xl font-russo flex items-center justify-center gap-2"
              >
                Proceed to Pay <ChevronRight className="w-5 h-5"/>
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 text-center">
              <div>
                <h4 className="font-russo text-[#ff4d00] mb-1">Scan to Pay</h4>
                <p className="text-sm text-gray-400">Amount: ₹{tournament.entryFee}</p>
              </div>
              
              <div className="flex justify-center">
                <div className="bg-white p-4 rounded-2xl shadow-xl shadow-[#ff4d00]/10">
                  <img src={qrUrl} alt="UPI QR" className="w-48 h-48" />
                </div>
              </div>

              <div className="space-y-3 bg-white/5 p-4 rounded-2xl border border-white/5">
                <div className="flex items-start gap-3 text-left">
                  <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-gray-300">Take a screenshot after payment completion.</p>
                </div>
                <div className="flex items-start gap-3 text-left">
                  <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-gray-300">Click the button below to send verification on WhatsApp.</p>
                </div>
              </div>

              <button 
                onClick={handleWhatsApp}
                className="w-full bg-[#25D366] py-4 rounded-xl font-russo flex items-center justify-center gap-2 hover:brightness-110"
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
