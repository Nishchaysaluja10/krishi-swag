import { useTranslation } from 'react-i18next';
import { Navbar } from '@/components/Navbar';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Zap, Globe, Users, TrendingUp, Award, Heart, Target, CheckCircle } from 'lucide-react';

const About = () => {
  const { t } = useTranslation();
  
  const features = [
    {
      icon: Shield,
      title: t('about.features.accuracy.title'),
      description: t('about.features.accuracy.desc'),
      color: 'from-primary to-accent',
    },
    {
      icon: Zap,
      title: t('about.features.speed.title'),
      description: t('about.features.speed.desc'),
      color: 'from-accent to-secondary',
    },
    {
      icon: Globe,
      title: t('about.features.accessibility.title'),
      description: t('about.features.accessibility.desc'),
      color: 'from-secondary to-primary',
    },
    {
      icon: Users,
      title: t('about.features.community.title'),
      description: t('about.features.community.desc'),
      color: 'from-primary via-accent to-secondary',
    },
  ];

  const values = [
    {
      icon: Target,
      title: t('about.values.innovation.title'),
      description: t('about.values.innovation.desc'),
    },
    {
      icon: Heart,
      title: t('about.values.empowerment.title'),
      description: t('about.values.empowerment.desc'),
    },
    {
      icon: Award,
      title: t('about.values.excellence.title'),
      description: t('about.values.excellence.desc'),
    },
    {
      icon: TrendingUp,
      title: t('about.values.sustainability.title'),
      description: t('about.values.sustainability.desc'),
    },
  ];

  const stats = [
    { value: t('about.stats.users'), label: t('about.stats.usersLabel') },
    { value: t('about.stats.detections'), label: t('about.stats.detectionsLabel') },
    { value: t('about.stats.accuracy'), label: t('about.stats.accuracyLabel') },
    { value: t('about.stats.countries'), label: t('about.stats.countriesLabel') },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <Navbar />
      
      <div className="container mx-auto px-4 py-16 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-20 animate-fade-in-scale">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent animate-gradient">
            {t('about.hero.title')}
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {t('about.hero.subtitle')}
          </p>
        </div>

        {/* Mission Section */}
        <Card className="glass-card mb-16 hover-lift animate-slide-in-up">
          <CardContent className="p-12">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {t('about.mission.title')}
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                {t('about.mission.description')}
              </p>
              <p className="text-base text-muted-foreground leading-relaxed">
                {t('about.mission.vision')}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, index) => (
            <Card 
              key={index} 
              className="glass-card hover-lift hover-glow animate-fade-in-scale border-primary/20"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6 text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features Section */}
        <div className="mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {t('about.features.title')}
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card 
                  key={index}
                  className="glass-card hover-lift border-primary/20 animate-fade-in-scale group"
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
                  <CardContent className="p-8">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="h-8 w-8 text-primary-foreground" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {t('about.values.title')}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card 
                  key={index}
                  className="glass-card hover-lift border-accent/20 animate-slide-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-6 text-center">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{value.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Technology Section */}
        <Card className="glass-card mb-16 hover-lift">
          <CardContent className="p-12">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {t('about.technology.title')}
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    {t('about.technology.ai.title')}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    {t('about.technology.ai.desc')}
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-accent" />
                    {t('about.technology.cloud.title')}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    {t('about.technology.cloud.desc')}
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-secondary" />
                    {t('about.technology.mobile.title')}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {t('about.technology.mobile.desc')}
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    {t('about.technology.data.title')}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {t('about.technology.data.desc')}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <Card className="glass-strong border-primary/30 hover-lift animate-pulse-glow">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {t('about.cta.title')}
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              {t('about.cta.description')}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="/"
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold hover:shadow-glow transition-all duration-300 hover:scale-105"
              >
                {t('about.cta.getStarted')}
              </a>
              <a
                href="/how-it-works"
                className="px-8 py-3 rounded-xl border-2 border-primary text-primary font-semibold hover:bg-primary/10 transition-all duration-300 hover:scale-105"
              >
                {t('about.cta.learnMore')}
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default About;
