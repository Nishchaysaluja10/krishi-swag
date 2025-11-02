import { useTranslation } from 'react-i18next';
import { Navbar } from '@/components/Navbar';
import { Card, CardContent } from '@/components/ui/card';
import { Camera, Search, FileCheck, Upload, Sparkles, BarChart3, Clock, Shield, Zap, Users } from 'lucide-react';

const HowItWorks = () => {
  const { t } = useTranslation();

  const steps = [
    {
      number: 1,
      icon: Camera,
      title: t('howItWorks.steps.capture.title'),
      description: t('howItWorks.steps.capture.desc'),
      details: t('howItWorks.steps.capture.details'),
      color: 'from-primary to-accent',
    },
    {
      number: 2,
      icon: Upload,
      title: t('howItWorks.steps.upload.title'),
      description: t('howItWorks.steps.upload.desc'),
      details: t('howItWorks.steps.upload.details'),
      color: 'from-accent to-secondary',
    },
    {
      number: 3,
      icon: Search,
      title: t('howItWorks.steps.analyze.title'),
      description: t('howItWorks.steps.analyze.desc'),
      details: t('howItWorks.steps.analyze.details'),
      color: 'from-secondary to-primary',
    },
    {
      number: 4,
      icon: FileCheck,
      title: t('howItWorks.steps.results.title'),
      description: t('howItWorks.steps.results.desc'),
      details: t('howItWorks.steps.results.details'),
      color: 'from-primary via-accent to-secondary',
    },
  ];

  const benefits = [
    {
      icon: Clock,
      title: t('howItWorks.benefits.speed.title'),
      description: t('howItWorks.benefits.speed.desc'),
    },
    {
      icon: Shield,
      title: t('howItWorks.benefits.accuracy.title'),
      description: t('howItWorks.benefits.accuracy.desc'),
    },
    {
      icon: Zap,
      title: t('howItWorks.benefits.easy.title'),
      description: t('howItWorks.benefits.easy.desc'),
    },
    {
      icon: BarChart3,
      title: t('howItWorks.benefits.tracking.title'),
      description: t('howItWorks.benefits.tracking.desc'),
    },
  ];

  const tips = [
    t('howItWorks.tips.tip1'),
    t('howItWorks.tips.tip2'),
    t('howItWorks.tips.tip3'),
    t('howItWorks.tips.tip4'),
    t('howItWorks.tips.tip5'),
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-40 left-10 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }}></div>
      </div>

      <Navbar />
      
      <div className="container mx-auto px-4 py-16 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-20 animate-fade-in-scale">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border-primary/20 mb-6">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium">{t('howItWorks.hero.badge')}</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent animate-gradient">
            {t('howItWorks.hero.title')}
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {t('howItWorks.hero.subtitle')}
          </p>
        </div>

        {/* Steps Section */}
        <div className="mb-20">
          <div className="space-y-12">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <Card 
                  key={index}
                  className="glass-card hover-lift border-primary/20 animate-slide-in-up"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <CardContent className="p-8 md:p-12">
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                      <div className="flex-shrink-0">
                        <div className="relative">
                          <div className={`w-24 h-24 rounded-3xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-glow`}>
                            <Icon className="h-12 w-12 text-primary-foreground" />
                          </div>
                          <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                            {step.number}
                          </div>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                          {step.title}
                        </h3>
                        <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
                          {step.description}
                        </p>
                        <p className="text-base text-muted-foreground leading-relaxed">
                          {step.details}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {t('howItWorks.benefits.title')}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <Card 
                  key={index}
                  className="glass-card hover-lift hover-glow border-accent/20 animate-fade-in-scale"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{benefit.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Tips Section */}
        <Card className="glass-card mb-16 hover-lift">
          <CardContent className="p-12">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {t('howItWorks.tips.title')}
              </h2>
              <div className="space-y-4">
                {tips.map((tip, index) => (
                  <div 
                    key={index}
                    className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/10 hover:border-primary/30 transition-all"
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold">
                      {index + 1}
                    </div>
                    <p className="text-base text-foreground leading-relaxed flex-1">{tip}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* FAQ Section */}
        <div className="mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {t('howItWorks.faq.title')}
          </h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            <Card className="glass-card hover-lift border-primary/20">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-3">{t('howItWorks.faq.q1.question')}</h3>
                <p className="text-muted-foreground leading-relaxed">{t('howItWorks.faq.q1.answer')}</p>
              </CardContent>
            </Card>
            <Card className="glass-card hover-lift border-primary/20">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-3">{t('howItWorks.faq.q2.question')}</h3>
                <p className="text-muted-foreground leading-relaxed">{t('howItWorks.faq.q2.answer')}</p>
              </CardContent>
            </Card>
            <Card className="glass-card hover-lift border-primary/20">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-3">{t('howItWorks.faq.q3.question')}</h3>
                <p className="text-muted-foreground leading-relaxed">{t('howItWorks.faq.q3.answer')}</p>
              </CardContent>
            </Card>
            <Card className="glass-card hover-lift border-primary/20">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-3">{t('howItWorks.faq.q4.question')}</h3>
                <p className="text-muted-foreground leading-relaxed">{t('howItWorks.faq.q4.answer')}</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <Card className="glass-strong border-primary/30 hover-lift animate-pulse-glow">
          <CardContent className="p-12 text-center">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-6">
              <Users className="h-10 w-10 text-primary-foreground" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {t('howItWorks.cta.title')}
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              {t('howItWorks.cta.description')}
            </p>
            <a
              href="/"
              className="inline-block px-8 py-4 rounded-xl bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold hover:shadow-glow transition-all duration-300 hover:scale-105"
            >
              {t('howItWorks.cta.button')}
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HowItWorks;
