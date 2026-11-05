import React, { useState, useRef, useEffect } from 'react';
import { BrainIcon } from 'hugeicons-react';
import ReactMarkdown from 'react-markdown';
import { Send, Sparkles, User, Bot, AlertCircle, RefreshCw, ShieldCheck, Copy, Check, ChevronRight, FileText } from 'lucide-react';
import { ChatMessage, Report } from '../../types';
import { sendChatMessage } from '../../lib/api';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { toast } from 'sonner';

interface AiHealthAssistantProps {
  latestReport?: Report | null;
}

export const AiHealthAssistant: React.FC<AiHealthAssistantProps> = ({ latestReport }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'Hello! I am your **MediScan AI Clinical Intelligence Assistant**. How can I help you analyze your lab biomarkers, understand diagnostic reference ranges, or review dietary advice today?'
    }
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [isLabContextOpen, setIsLabContextOpen] = useState(true);

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isLoading]);

  const presetQuestions = [
    'Explain my latest cholesterol and lipid panel results',
    'What foods help optimize HbA1c and blood glucose?',
    'What causes elevated ALT or AST liver enzymes?',
    'Are there any interactions with my active medications?'
  ];

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || inputMsg;
    if (!query.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', content: query };
    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInputMsg('');
    setIsLoading(true);

    try {
      const res = await sendChatMessage(query);
      const assistantMessage: ChatMessage = { role: 'assistant', content: res.reply };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'I encountered an issue communicating with Groq AI services. Please verify your connection or custom API keys.'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    toast.success('Response copied to clipboard');
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Main Conversational Chat Box */}
      <div className={`${latestReport ? 'lg:col-span-8' : 'lg:col-span-12'} space-y-4`}>
        {/* Header Bar */}
        <Card className="p-4 border bg-card shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <BrainIcon className="w-7 h-7 text-primary shrink-0" />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-foreground">MediScan AI Intelligence</h2>
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Powered by Groq GPT-OSS 120B & Diagnostic KB</span>
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setMessages([messages[0]])}
            className="gap-1.5 text-xs h-8"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Clear Chat
          </Button>
        </Card>

        {/* Messages Container */}
        <Card className="border bg-card shadow-sm flex flex-col h-[580px]">
          <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-5 space-y-5 no-scrollbar">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 border ${
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-secondary text-primary border-border'
                  }`}
                >
                  {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div className={`group relative max-w-2xl p-4 rounded-2xl text-xs sm:text-sm leading-relaxed border ${
                  msg.role === 'user'
                    ? 'bg-primary text-primary-foreground font-medium rounded-tr-none border-primary'
                    : 'bg-card text-foreground rounded-tl-none border-border shadow-xs'
                }`}>
                  <div className="prose dark:prose-invert prose-xs max-w-none space-y-3 [&_p]:leading-relaxed [&_p]:mb-3 [&_ul]:space-y-2 [&_ul]:mb-3 [&_li]:leading-relaxed [&_h3]:text-sm [&_h3]:font-extrabold [&_h3]:mt-4 [&_h3]:mb-2.5 [&_h3]:text-foreground [&_blockquote]:my-3.5 [&_blockquote]:p-3 [&_blockquote]:rounded-xl [&_blockquote]:bg-secondary/40 [&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_strong]:text-foreground [&_strong]:font-extrabold">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>

                  {msg.role === 'assistant' && (
                    <button
                      onClick={() => handleCopy(msg.content, index)}
                      className="absolute right-2 bottom-2 p-1.5 rounded-lg bg-secondary/80 hover:bg-secondary text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Copy response"
                    >
                      {copiedIndex === index ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-3 animate-pulse pl-2">
                <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="text-xs text-muted-foreground font-medium">
                  AI Clinical Intelligence is formulating response...
                </span>
              </div>
            )}

          </div>

          {/* Quick Suggestions */}
          <div className="px-4 py-2.5 border-t border-b bg-secondary/20 flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="text-xs font-semibold text-muted-foreground shrink-0">Quick Ask:</span>
            {presetQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                disabled={isLoading}
                className="px-3 py-1 rounded-full text-xs font-medium bg-background border border-border text-foreground hover:border-primary/40 hover:text-primary whitespace-nowrap transition-colors shrink-0"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-3 bg-card">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                placeholder="Ask any question regarding your lab parameters, biomarker causes, or dietary advice..."
                className="flex-1 h-10 px-4 rounded-xl text-xs sm:text-sm border border-border bg-secondary/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
              <Button type="submit" disabled={!inputMsg.trim() || isLoading} variant="emerald" className="gap-1.5 text-xs h-10 px-5">
                <span>Send</span>
                <Send className="w-3.5 h-3.5" />
              </Button>
            </form>
          </div>
        </Card>
      </div>

      {/* Side Lab Context Drawer Panel */}
      {latestReport && (
        <div className="lg:col-span-4 space-y-4">
          <Card className="border bg-card shadow-sm">
            <CardHeader className="pb-3 border-b flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />
                <CardTitle className="text-sm font-bold">Active Lab Context</CardTitle>
              </div>
              <Badge variant="slate">{latestReport.laboratory_name}</Badge>
            </CardHeader>

            <CardContent className="p-4 space-y-3">
              <div className="p-3 rounded-lg border bg-secondary/20">
                <span className="text-[10px] text-muted-foreground uppercase font-bold block">Current Health Score</span>
                <span className="text-lg font-bold text-foreground">{latestReport.overall_health_score}/100 ({latestReport.health_risk_category} Risk)</span>
              </div>

              <div>
                <span className="text-xs font-bold text-foreground block mb-2">Flagged Biomarkers ({latestReport.abnormal_count}):</span>
                {latestReport.biomarkers?.filter(b => b.status !== 'normal').slice(0, 5).map((bm, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg border bg-card mb-2 text-xs flex items-center justify-between">
                    <div>
                      <span className="font-bold text-foreground block">{bm.canonical_name || bm.raw_name}</span>
                      <span className="text-muted-foreground">{bm.value} {bm.unit}</span>
                    </div>
                    <Badge variant={bm.status === 'critical' || bm.status === 'high' ? 'critical' : 'warning'}>
                      {bm.status}
                    </Badge>
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-950/40 text-[11px] text-amber-800 dark:text-amber-300 space-y-1">
                <p className="font-bold flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> Medical Disclaimer
                </p>
                <p>AI responses provide educational context only and should be reviewed with your primary healthcare provider.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
