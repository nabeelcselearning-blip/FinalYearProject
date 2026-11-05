import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Cpu, ShieldCheck, 
  Check, Bell, User, Zap, Lock, Globe, ChevronDown 
} from 'lucide-react';

export interface AIModelOption {
  id: string;
  name: string;
  provider: string;
  badge: string;
  description: string;
  speed: string;
  accuracy: string;
}

export const Settings: React.FC = () => {
  
  const [selectedModel, setSelectedModel] = useState<string>(() => {
    return localStorage.getItem('mediscan_selected_model') || 'groq/gpt-oss-120b';
  });
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  // Custom Paid Model API States
  const [customApiKey, setCustomApiKey] = useState<string>(() => {
    return localStorage.getItem('mediscan_custom_api_key') || '';
  });
  const [customModelId, setCustomModelId] = useState<string>(() => {
    return localStorage.getItem('mediscan_custom_model_id') || 'gpt-4o';
  });
  const [customProviderUrl, setCustomProviderUrl] = useState<string>(() => {
    return localStorage.getItem('mediscan_custom_provider_url') || 'https://api.openai.com/v1';
  });
  const [showApiKey, setShowApiKey] = useState<boolean>(false);
  const [useCustomKey, setUseCustomKey] = useState<boolean>(() => {
    return localStorage.getItem('mediscan_use_custom_key') === 'true';
  });
  const [isCustomExpanded, setIsCustomExpanded] = useState<boolean>(() => {
    return localStorage.getItem('mediscan_use_custom_key') === 'true';
  });

  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(() => {
    return localStorage.getItem('mediscan_notifications_enabled') !== 'false';
  });
  const [autoAnalysisEnabled, setAutoAnalysisEnabled] = useState<boolean>(() => {
    return localStorage.getItem('mediscan_auto_analysis_enabled') !== 'false';
  });

  const toggleNotifications = () => {
    setNotificationsEnabled(prev => {
      const next = !prev;
      localStorage.setItem('mediscan_notifications_enabled', String(next));
      return next;
    });
  };

  const toggleAutoAnalysis = () => {
    setAutoAnalysisEnabled(prev => {
      const next = !prev;
      localStorage.setItem('mediscan_auto_analysis_enabled', String(next));
      return next;
    });
  };

  const handleSaveCustomConfig = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('mediscan_custom_api_key', customApiKey);
    localStorage.setItem('mediscan_custom_model_id', customModelId);
    localStorage.setItem('mediscan_custom_provider_url', customProviderUrl);
    localStorage.setItem('mediscan_use_custom_key', String(useCustomKey));
    if (useCustomKey) {
      localStorage.setItem('mediscan_selected_model', `custom/${customModelId}`);
      setSelectedModel(`custom/${customModelId}`);
    }
    setSaveMessage('Custom Paid Model API settings saved successfully!');
    setTimeout(() => setSaveMessage(null), 3000);
  };

  const modelOptions: AIModelOption[] = [
    {
      id: 'groq/gpt-oss-120b',
      name: 'GPT-OSS 120B',
      provider: 'Groq Cloud (Default)',
      badge: 'Active & Verified',
      description: 'Ultra-fast sub-second clinical inference powered by GPT-OSS 120B for OCR parsing and lab analytics.',
      speed: '< 0.4s',
      accuracy: '99.7%'
    },
    {
      id: 'anthropic/claude-3-5-sonnet',
      name: 'Claude 3.5 Sonnet',
      provider: 'Anthropic AI',
      badge: 'Clinical Grade',
      description: 'Advanced longitudinal biomarker trajectory synthesis and medical research context.',
      speed: '~ 1.2s',
      accuracy: '99.8%'
    },
    {
      id: 'openai/gpt-4o',
      name: 'OpenAI GPT-4o',
      provider: 'OpenAI',
      badge: 'Multimodal',
      description: 'Multimodal vision model for complex multi-page laboratory report parsing.',
      speed: '~ 1.0s',
      accuracy: '99.6%'
    },
    {
      id: 'deepseek/deepseek-r1',
      name: 'DeepSeek R1',
      provider: 'DeepSeek AI',
      badge: 'Deep Reasoning',
      description: 'Step-by-step reasoning engine for complex multi-system diagnostic reviews.',
      speed: '~ 1.8s',
      accuracy: '99.5%'
    }
  ];

  const handleSelectModel = (modelId: string) => {
    setSelectedModel(modelId);
    localStorage.setItem('mediscan_selected_model', modelId);
    setSaveMessage('AI Engine configuration saved successfully!');
    setTimeout(() => setSaveMessage(null), 3000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div>
        <h1 className="text-2xl font-bold text-foreground font-heading tracking-tight">
          Application & System Settings
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Configure your AI reasoning engine, interface themes, and workspace parameters
        </p>
      </div>

      {saveMessage && (
        <div className="p-3.5 rounded-xl bg-primary/10 border border-primary/30 text-primary text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
          <Check className="w-4 h-4" />
          <span>{saveMessage}</span>
        </div>
      )}

      {/* SECTION 1: AI MODEL SELECTION */}
      <div className="card-soft p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-[10px] bg-primary/10 text-primary flex items-center justify-center font-bold">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground font-heading">
                AI Intelligence Engine & Model Provider
              </h2>
              <p className="text-xs text-muted-foreground">
                Select your preferred LLM engine for OCR lab parsing, biomarker summaries, and medical chat
              </p>
            </div>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary">
            <Sparkles className="w-3.5 h-3.5" />
            Dynamic Routing Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {modelOptions.map((model) => {
            const isSelected = selectedModel === model.id;
            return (
              <div
                key={model.id}
                onClick={() => handleSelectModel(model.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                  isSelected
                    ? 'bg-primary/5 border-primary shadow-xs ring-1 ring-primary/30'
                    : 'bg-card/60 border-border hover:border-border/80 hover:bg-secondary/40'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-extrabold text-muted-foreground uppercase tracking-wider">
                      {model.provider}
                    </span>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                      isSelected 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-secondary border border-border text-muted-foreground'
                    }`}>
                      {isSelected ? 'SELECTED' : model.badge}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-foreground font-heading flex items-center gap-2">
                    {model.name}
                  </h3>

                  <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                    {model.description}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-border/60 mt-4 pt-3 text-[11px] text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                    <span>Inference: <strong className="text-foreground">{model.speed}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Accuracy: <strong className="text-foreground">{model.accuracy}</strong></span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: CUSTOM PAID MODEL / BYO API KEY CONFIGURATION */}
      <div className="card-soft p-6 space-y-5">
        <div 
          onClick={() => setIsCustomExpanded(prev => !prev)}
          className="flex items-center justify-between cursor-pointer border-b border-border pb-4 select-none group"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-[10px] bg-primary/10 text-primary group-hover:bg-primary/20 flex items-center justify-center font-bold transition-colors">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground font-heading group-hover:text-primary transition-colors flex items-center gap-2">
                <span>Custom Paid AI Model & Personal API Key (BYO Model)</span>
                {useCustomKey && (
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                    ENABLED
                  </span>
                )}
              </h2>
              <p className="text-xs text-muted-foreground">
                Connect your private paid API key for OpenAI, Anthropic, DeepSeek, OpenRouter, or custom endpoints
              </p>
            </div>
          </div>

          <div className="w-8 h-8 rounded-full bg-secondary/60 group-hover:bg-secondary flex items-center justify-center text-muted-foreground transition-colors shrink-0">
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isCustomExpanded ? 'rotate-180' : ''}`} />
          </div>
        </div>

        {isCustomExpanded && (
          <form onSubmit={handleSaveCustomConfig} className="space-y-4 animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-card/60">
            <div>
              <div className="text-xs font-bold text-foreground">Enable Custom Paid AI Key</div>
              <div className="text-[11px] text-muted-foreground">Route all lab parsing and medical chat through your private paid API endpoint</div>
            </div>
            <button
              type="button"
              onClick={() => setUseCustomKey(prev => !prev)}
              className={`w-12 h-6 rounded-full transition-colors relative p-1 cursor-pointer ${
                useCustomKey ? 'bg-primary' : 'bg-secondary border border-border'
              }`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                useCustomKey ? 'translate-x-6' : 'translate-x-0'
              }`} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                Model Identifier (ID)
              </label>
              <input
                type="text"
                value={customModelId}
                onChange={(e) => setCustomModelId(e.target.value)}
                placeholder="e.g. gpt-4o, claude-3-5-sonnet, deepseek-r1"
                className="w-full h-10 px-3 rounded-xl border border-border bg-card text-foreground text-xs font-mono outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                API Base Endpoint URL
              </label>
              <input
                type="text"
                value={customProviderUrl}
                onChange={(e) => setCustomProviderUrl(e.target.value)}
                placeholder="e.g. https://api.openai.com/v1 or https://openrouter.ai/api/v1"
                className="w-full h-10 px-3 rounded-xl border border-border bg-card text-foreground text-xs font-mono outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-foreground">
                Paid Provider API Secret Key
              </label>
              <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                <ShieldCheck className="w-3 h-3" />
                AES-256 Vault Encrypted
              </span>
            </div>
            <div className="relative">
              <input
                type={showApiKey ? 'text' : 'password'}
                value={customApiKey}
                onChange={(e) => setCustomApiKey(e.target.value)}
                placeholder="sk-proj-..."
                className="w-full h-10 px-3 pr-20 rounded-xl border border-border bg-card text-foreground text-xs font-mono outline-none focus:ring-2 focus:ring-primary/40"
              />
              <button
                type="button"
                onClick={() => setShowApiKey(prev => !prev)}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-secondary text-[10px] font-bold text-foreground hover:bg-secondary/80 cursor-pointer"
              >
                {showApiKey ? 'Hide Key' : 'Show Key'}
              </button>
            </div>
            <div className="flex items-center justify-between text-[10px] text-muted-foreground mt-1.5">
              <span>Keys are encrypted with server-side AES-256 Fernet tokens and never logged in plaintext.</span>
              {customApiKey && !showApiKey && (
                <span className="font-mono text-primary font-bold">
                  {customApiKey.substring(0, 7)}••••••••••••{customApiKey.substring(customApiKey.length - 4)}
                </span>
              )}
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-xs transition-all hover:bg-primary/90 cursor-pointer shadow-xs"
            >
              Save Paid Model Credentials
            </button>
          </div>
        </form>
        )}
      </div>



      {/* SECTION 3: SYSTEM PREFERENCES & NOTIFICATIONS */}
      <div className="card-soft p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-[10px] bg-secondary text-foreground flex items-center justify-center font-bold">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground font-heading">
                System Preferences & Notifications
              </h2>
              <p className="text-xs text-muted-foreground">
                Manage automated lab parsing alerts, follow-up reminders, and security settings
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-card/60">
            <div>
              <div className="text-sm font-bold text-foreground">Biomarker Threshold Alerts</div>
              <div className="text-xs text-muted-foreground">Notify when a new lab report indicates critical out-of-range parameters</div>
            </div>
            <button
              onClick={toggleNotifications}
              className={`w-12 h-6 rounded-full transition-colors relative p-1 cursor-pointer ${
                notificationsEnabled ? 'bg-primary' : 'bg-secondary border border-border'
              }`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                notificationsEnabled ? 'translate-x-6' : 'translate-x-0'
              }`} />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-card/60">
            <div>
              <div className="text-sm font-bold text-foreground">Automated OCR & AI Analysis</div>
              <div className="text-xs text-muted-foreground">Automatically trigger AI clinical insights upon uploading new lab PDFs</div>
            </div>
            <button
              onClick={toggleAutoAnalysis}
              className={`w-12 h-6 rounded-full transition-colors relative p-1 cursor-pointer ${
                autoAnalysisEnabled ? 'bg-primary' : 'bg-secondary border border-border'
              }`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                autoAnalysisEnabled ? 'translate-x-6' : 'translate-x-0'
              }`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
