
import React, { useState } from 'react';
import { UserProfile } from '../types';
import { User, Shield, Gamepad2, Phone, CreditCard } from 'lucide-react';

interface Props {
  onComplete: (profile: UserProfile) => void;
}

export const Onboarding: React.FC<Props> = ({ onComplete }) => {
  const [form, setForm] = useState<UserProfile>({
    name: '',
    ign: '',
    uid: '',
    level: '',
    whatsapp: '',
    upiId: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.name && form.ign && form.uid && form.whatsapp) {
      onComplete(form);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0a0a0a] flex flex-col p-6 overflow-y-auto">
      <div className="mb-8 mt-4">
        <h1 className="text-3xl text-[#ff4d00] font-russo mb-2">Welcome Player</h1>
        <p className="text-gray-400">Complete your profile to start competing.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 pb-10">
        <div className="space-y-1">
          <label className="text-xs uppercase text-gray-500 font-medium px-1">Full Name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              required
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 focus:border-[#ff4d00] transition-colors"
              placeholder="Ex: Pawan Kumar"
              value={form.name}
              onChange={e => setForm({...form, name: e.target.value})}
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs uppercase text-gray-500 font-medium px-1">In-Game Name (IGN)</label>
          <div className="relative">
            <Gamepad2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              required
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 focus:border-[#ff4d00] transition-colors"
              placeholder="Ex: SKY_LORD_99"
              value={form.ign}
              onChange={e => setForm({...form, ign: e.target.value})}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs uppercase text-gray-500 font-medium px-1">Free Fire UID</label>
            <div className="relative">
              <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 focus:border-[#ff4d00] transition-colors"
                placeholder="10 digit ID"
                value={form.uid}
                onChange={e => setForm({...form, uid: e.target.value})}
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs uppercase text-gray-500 font-medium px-1">Player Level</label>
            <input
              required
              type="number"
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:border-[#ff4d00] transition-colors"
              placeholder="Level"
              value={form.level}
              onChange={e => setForm({...form, level: e.target.value})}
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs uppercase text-gray-500 font-medium px-1">WhatsApp Mobile</label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              required
              type="tel"
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 focus:border-[#ff4d00] transition-colors"
              placeholder="10 digit number"
              value={form.whatsapp}
              onChange={e => setForm({...form, whatsapp: e.target.value})}
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs uppercase text-gray-500 font-medium px-1">Your UPI ID (Optional)</label>
          <div className="relative">
            <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 focus:border-[#ff4d00] transition-colors"
              placeholder="yourname@upi"
              value={form.upiId}
              onChange={e => setForm({...form, upiId: e.target.value})}
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-[#ff4d00] text-white py-4 rounded-xl font-russo mt-4 hover:brightness-110 active:scale-[0.98] transition-all shadow-lg shadow-[#ff4d00]/20"
        >
          Create Profile
        </button>
      </form>
    </div>
  );
};
