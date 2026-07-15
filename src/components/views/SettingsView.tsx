import React from 'react';
import { Settings } from '../../hooks/useSettings';
import { Save, Shield, Cpu, Layout, Bell, FileCode } from 'lucide-react';

interface SettingsViewProps {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
  addToast: (type: any, message: string) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ settings, updateSettings, addToast }) => {
  const handleSave = () => {
    addToast('success', 'Settings persisted to local storage');
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center bg-slate-900/40 border border-slate-800/50 rounded-[2rem] p-8">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight">System Configuration</h2>
          <p className="text-sm text-slate-500 font-medium mt-1">Manage your Venture OS environment and AI agent parameters.</p>
        </div>
        <button 
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 transition-all"
        >
          <Save size={18} /> Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* GENERAL SETTINGS */}
        <SettingsCard title="General" icon={<Layout className="text-indigo-400" />}>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Default Branding</label>
              <select 
                value={settings.startup.defaultBranding}
                onChange={(e) => updateSettings({ startup: { ...settings.startup, defaultBranding: e.target.value as any } })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500/50"
              >
                <option value="tech-bold">Tech Bold</option>
                <option value="corporate-clean">Corporate Clean</option>
                <option value="playful-modern">Playful Modern</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Complexity Level</label>
              <select 
                value={settings.startup.defaultComplexity}
                onChange={(e) => updateSettings({ startup: { ...settings.startup, defaultComplexity: e.target.value as any } })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500/50"
              >
                <option value="low">Low (Fast)</option>
                <option value="medium">Medium (Balanced)</option>
                <option value="high">High (Comprehensive)</option>
              </select>
            </div>
          </div>
        </SettingsCard>

        {/* AI SETTINGS */}
        <SettingsCard title="AI Intelligence" icon={<Cpu className="text-amber-500" />}>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Default Provider</label>
              <input 
                type="text"
                value={settings.ai.provider}
                onChange={(e) => updateSettings({ ai: { ...settings.ai, provider: e.target.value } })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500/50"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Temperature</label>
                <input 
                  type="number"
                  step="0.1"
                  min="0"
                  max="1"
                  value={settings.ai.temperature}
                  onChange={(e) => updateSettings({ ai: { ...settings.ai, temperature: parseFloat(e.target.value) } })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500/50"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Max Tokens</label>
                <input 
                  type="number"
                  value={settings.ai.maxTokens}
                  onChange={(e) => updateSettings({ ai: { ...settings.ai, maxTokens: parseInt(e.target.value) } })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500/50"
                />
              </div>
            </div>
          </div>
        </SettingsCard>

        {/* APPEARANCE */}
        <SettingsCard title="Appearance" icon={<Shield className="text-blue-400" />}>
           <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Theme Preference</label>
              <div className="grid grid-cols-3 gap-3">
                {['dark', 'light', 'system'].map((t) => (
                  <button
                    key={t}
                    onClick={() => updateSettings({ appearance: { ...settings.appearance, theme: t as any } })}
                    className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                      settings.appearance.theme === t 
                        ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/20' 
                        : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-xl">
               <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">Interface Animations</span>
               <input 
                 type="checkbox"
                 checked={settings.appearance.animations}
                 onChange={(e) => updateSettings({ appearance: { ...settings.appearance, animations: e.target.checked } })}
                 className="w-4 h-4 rounded border-slate-800 bg-slate-900 text-indigo-600 focus:ring-indigo-500"
               />
            </div>
          </div>
        </SettingsCard>

        {/* NOTIFICATIONS */}
        <SettingsCard title="Notifications" icon={<Bell className="text-pink-400" />}>
           <div className="space-y-4">
            {[
              { key: 'success', label: 'Success Messages' },
              { key: 'errors', label: 'Error Alerts' },
              { key: 'backgroundTasks', label: 'Agent Task Updates' }
            ].map(({ key, label }) => (
              <div key={key} className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-xl">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">{label}</span>
                <input 
                  type="checkbox"
                  checked={(settings.notifications as any)[key]}
                  onChange={(e) => updateSettings({ notifications: { ...settings.notifications, [key]: e.target.checked } })}
                  className="w-4 h-4 rounded border-slate-800 bg-slate-900 text-indigo-600 focus:ring-indigo-500"
                />
              </div>
            ))}
          </div>
        </SettingsCard>
      </div>
    </div>
  );
};

const SettingsCard = ({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) => (
  <div className="bg-slate-900/40 border border-slate-800/50 rounded-[2rem] p-10 space-y-8">
    <div className="flex items-center gap-4">
      <div className="p-3 bg-slate-800/50 rounded-2xl border border-slate-700/50 text-white">
        {icon}
      </div>
      <h3 className="text-2xl font-black text-white tracking-tight">{title}</h3>
    </div>
    {children}
  </div>
);
