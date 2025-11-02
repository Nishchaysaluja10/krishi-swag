import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/Navbar';
import { ImageUpload } from '@/components/ImageUpload';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, MessageCircle, Send, TrendingUp, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import type { User } from '@supabase/supabase-js';

const Dashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [detections, setDetections] = useState<any[]>([]);
  const [notices, setNotices] = useState<any[]>([]);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatting, setIsChatting] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate('/auth');
      } else {
        setUser(session.user);
        setLoading(false);
        loadDetections(session.user.id);
        loadNotices();
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate('/auth');
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const loadDetections = async (userId: string) => {
    const { data } = await supabase
      .from('disease_detections')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5);
    if (data) setDetections(data);
  };

  const loadNotices = async () => {
    const { data } = await supabase
      .from('community_notices')
      .select('*')
      .eq('is_trending', true)
      .order('created_at', { ascending: false })
      .limit(3);
    if (data) setNotices(data);
  };

  const handleDetect = async () => {
    if (!selectedFile || !user) return;

    setIsAnalyzing(true);
    try {
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('crop-images')
        .upload(filePath, selectedFile);

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from('crop-images').getPublicUrl(filePath);

      const { data: functionData, error: functionError } = await supabase.functions.invoke(
        'detect-disease',
        {
          body: { imageUrl: publicUrl },
        }
      );

      if (functionError) throw functionError;

      const { error: insertError } = await supabase.from('disease_detections').insert({
        user_id: user.id,
        image_url: publicUrl,
        disease_name: functionData.disease_name,
        confidence: functionData.confidence,
        severity: functionData.severity,
        recommendations: functionData.recommendations,
      });

      if (insertError) throw insertError;

      toast.success(t('detection.uploadSuccess'));
      loadDetections(user.id);
      setSelectedFile(null);
    } catch (error: any) {
      toast.error(error.message || t('detection.uploadError'));
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleChat = async () => {
    if (!chatInput.trim() || isChatting) return;

    const userMessage = { role: 'user', content: chatInput };
    setChatMessages((prev) => [...prev, userMessage]);
    setChatInput('');
    setIsChatting(true);

    try {
      const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;
      const resp = await fetch(CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: [...chatMessages, userMessage] }),
      });

      if (!resp.ok || !resp.body) throw new Error('Failed to start stream');

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = '';
      let assistantContent = '';
      let streamDone = false;

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf('\n')) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (line.startsWith(':') || line.trim() === '') continue;
          if (!line.startsWith('data: ')) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') {
            streamDone = true;
            break;
          }

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantContent += content;
              setChatMessages((prev) => {
                const last = prev[prev.length - 1];
                if (last?.role === 'assistant') {
                  return prev.map((m, i) =>
                    i === prev.length - 1 ? { ...m, content: assistantContent } : m
                  );
                }
                return [...prev, { role: 'assistant', content: assistantContent }];
              });
            }
          } catch {
            textBuffer = line + '\n' + textBuffer;
            break;
          }
        }
      }
    } catch (error) {
      toast.error('Chat error');
    } finally {
      setIsChatting(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-gradient-to-b from-background to-muted/20" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          {t('dashboard.title')}
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Upload Section */}
            <Card className="border-primary/20 shadow-glow">
              <CardHeader>
                <CardTitle>{t('dashboard.uploadTitle')}</CardTitle>
              </CardHeader>
              <CardContent>
                <ImageUpload onImageSelect={setSelectedFile} isAnalyzing={isAnalyzing} />
                {selectedFile && !isAnalyzing && (
                  <Button
                    onClick={handleDetect}
                    size="lg"
                    className="w-full mt-6 bg-gradient-to-r from-primary to-accent"
                  >
                    <Search className="mr-2 h-5 w-5" />
                    {t('hero.detectButton')}
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Recent Detections */}
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle>{t('dashboard.recentTitle')}</CardTitle>
              </CardHeader>
              <CardContent>
                {detections.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    {t('dashboard.noDetections')}
                  </p>
                ) : (
                  <div className="space-y-4">
                    {detections.map((detection) => (
                      <div
                        key={detection.id}
                        className="flex gap-4 p-4 rounded-lg bg-gradient-to-br from-accent/5 to-primary/5 border border-primary/10"
                      >
                        <img
                          src={detection.image_url}
                          alt="Detection"
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold">{detection.disease_name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {t('detection.confidence')}: {(detection.confidence * 100).toFixed(0)}% |{' '}
                            {t('detection.severity')}: {detection.severity}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            {/* Community Notices */}
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  {t('dashboard.communityTitle')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {notices.map((notice) => (
                    <div
                      key={notice.id}
                      className="p-4 rounded-lg bg-gradient-to-br from-secondary/10 to-accent/10 border border-secondary/20"
                    >
                      <h4 className="font-semibold text-sm mb-1">{notice.title}</h4>
                      <p className="text-xs text-muted-foreground mb-2">{notice.description}</p>
                      <div className="flex items-center gap-2 text-xs">
                        <MapPin className="h-3 w-3" />
                        <span>{notice.location}</span>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full" asChild>
                    <a href="/community">{t('dashboard.showMore')}</a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Chatbot */}
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-primary" />
                  {t('dashboard.chatbot')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="h-64 overflow-y-auto space-y-3 p-4 rounded-lg bg-muted/30">
                    {chatMessages.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center">
                        Ask me anything about crop diseases!
                      </p>
                    ) : (
                      chatMessages.map((msg, idx) => (
                        <div
                          key={idx}
                          className={`p-3 rounded-lg text-sm ${
                            msg.role === 'user'
                              ? 'bg-primary text-primary-foreground ml-8'
                              : 'bg-card mr-8'
                          }`}
                        >
                          {msg.content}
                        </div>
                      ))
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleChat()}
                      placeholder="Type your question..."
                      disabled={isChatting}
                    />
                    <Button onClick={handleChat} disabled={isChatting} size="icon">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
