import { useTranslation } from 'react-i18next';
import { Navbar } from '@/components/Navbar';
import { ImageUpload } from '@/components/ImageUpload';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Camera, Search, FileCheck, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import heroImage from '@/assets/hero-crop-field.jpg';

const Index = () => {
  const { t } = useTranslation();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleImageSelect = (file: File) => {
    setSelectedFile(file);
    setResult(null);
  };

  const handleDetect = async () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    try {
      // Upload to storage
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `public/${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('crop-images')
        .upload(filePath, selectedFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('crop-images')
        .getPublicUrl(filePath);

      // Detect disease
      const { data: functionData, error: functionError } = await supabase.functions.invoke(
        'detect-disease',
        {
          body: { imageUrl: publicUrl },
        }
      );

      if (functionError) throw functionError;

      setResult(functionData);
      toast.success(t('detection.uploadSuccess'));
    } catch (error: any) {
      console.error('Error:', error);
      toast.error(error.message || t('detection.uploadError'));
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute top-20 left-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <Navbar />

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-12 animate-fade-in-scale">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border-primary/20 mb-6 animate-slide-in-up">
              <Camera className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">{t('hero.badge')}</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent animate-gradient">
              {t('hero.title')}
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
              {t('hero.subtitle')}
            </p>
          </div>

          {/* Public Upload Section */}
          <div className="max-w-2xl mx-auto animate-fade-in-scale" style={{ animationDelay: '0.3s' }}>
            <Card className="glass-strong border-primary/30 shadow-glow hover-lift">
              <CardContent className="p-8 md:p-12">
                <ImageUpload onImageSelect={handleImageSelect} isAnalyzing={isAnalyzing} />
                {selectedFile && !isAnalyzing && (
                  <Button
                    onClick={handleDetect}
                    size="lg"
                    className="w-full mt-6 bg-gradient-to-r from-primary to-accent hover:shadow-glow transition-all duration-300 hover:scale-105"
                  >
                    <Search className="mr-2 h-5 w-5" />
                    {t('hero.detectButton')}
                  </Button>
                )}

                {result && (
                  <div className="mt-6 p-6 rounded-xl glass-card border-primary/20 animate-fade-in-scale hover-lift">
                    <div className="flex items-start gap-3 mb-4">
                      {result.severity === 'high' ? (
                        <AlertCircle className="h-6 w-6 text-destructive flex-shrink-0" />
                      ) : (
                        <FileCheck className="h-6 w-6 text-primary flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">{result.disease_name}</h3>
                        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">{t('detection.confidence')}:</span>
                            <span className="ml-2 font-medium">
                              {(result.confidence * 100).toFixed(0)}%
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">{t('detection.severity')}:</span>
                            <span className="ml-2 font-medium capitalize">{result.severity}</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-2">
                            {t('detection.recommendations')}:
                          </p>
                          <p className="text-sm leading-relaxed">{result.recommendations}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative z-10">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent animate-gradient">
            {t('features.title')}
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="glass-card border-primary/20 hover-lift hover-glow animate-fade-in-scale">
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-glow animate-float">
                  <Camera className="h-10 w-10 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{t('features.step1Title')}</h3>
                <p className="text-muted-foreground leading-relaxed">{t('features.step1Desc')}</p>
              </CardContent>
            </Card>

            <Card className="glass-card border-primary/20 hover-lift hover-glow animate-fade-in-scale" style={{ animationDelay: '0.1s' }}>
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-accent to-secondary flex items-center justify-center shadow-glow animate-float" style={{ animationDelay: '1s' }}>
                  <Search className="h-10 w-10 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{t('features.step2Title')}</h3>
                <p className="text-muted-foreground leading-relaxed">{t('features.step2Desc')}</p>
              </CardContent>
            </Card>

            <Card className="glass-card border-primary/20 hover-lift hover-glow animate-fade-in-scale" style={{ animationDelay: '0.2s' }}>
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-secondary to-primary flex items-center justify-center shadow-glow animate-float" style={{ animationDelay: '2s' }}>
                  <FileCheck className="h-10 w-10 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{t('features.step3Title')}</h3>
                <p className="text-muted-foreground leading-relaxed">{t('features.step3Desc')}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
