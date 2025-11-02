import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Navbar } from '@/components/Navbar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { MapPin, Calendar, TrendingUp, AlertTriangle, Users, Globe, BarChart3 } from 'lucide-react';

const Community = () => {
  const { t } = useTranslation();
  const [notices, setNotices] = useState<any[]>([]);

  useEffect(() => {
    loadNotices();
  }, []);

  const loadNotices = async () => {
    const { data } = await supabase
      .from('community_notices')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setNotices(data);
  };

  const communityStats = [
    {
      icon: Users,
      value: t('community.stats.activeUsers'),
      label: t('community.stats.activeUsersLabel'),
      color: 'from-primary to-accent',
    },
    {
      icon: AlertTriangle,
      value: t('community.stats.alerts'),
      label: t('community.stats.alertsLabel'),
      color: 'from-accent to-secondary',
    },
    {
      icon: Globe,
      value: t('community.stats.locations'),
      label: t('community.stats.locationsLabel'),
      color: 'from-secondary to-primary',
    },
    {
      icon: TrendingUp,
      value: t('community.stats.resolved'),
      label: t('community.stats.resolvedLabel'),
      color: 'from-primary via-accent to-secondary',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-40 left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <Navbar />
      
      <div className="container mx-auto px-4 py-16 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-fade-in-scale">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border-primary/20 mb-6">
            <TrendingUp className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium">{t('community.hero.badge')}</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent animate-gradient">
            {t('community.title')}
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {t('community.hero.subtitle')}
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {communityStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card 
                key={index}
                className="glass-card hover-lift hover-glow border-primary/20 animate-fade-in-scale"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6 text-center">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center mx-auto mb-4`}>
                    <Icon className="h-7 w-7 text-primary-foreground" />
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-primary mb-2">{stat.value}</div>
                  <div className="text-xs md:text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Description Section */}
        <Card className="glass-card mb-16 hover-lift">
          <CardContent className="p-12">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {t('community.description.title')}
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed text-center mb-6">
                {t('community.description.text1')}
              </p>
              <p className="text-base text-muted-foreground leading-relaxed text-center">
                {t('community.description.text2')}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Notices Grid */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {t('community.notices.title')}
            </h2>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <BarChart3 className="h-4 w-4" />
              <span>{t('community.notices.count', { count: notices.length })}</span>
            </div>
          </div>
          
          {notices.length === 0 ? (
            <Card className="glass-card border-primary/20">
              <CardContent className="p-12 text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">{t('community.empty.title')}</h3>
                <p className="text-muted-foreground">{t('community.empty.description')}</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {notices.map((notice, index) => (
                <Card 
                  key={notice.id} 
                  className="glass-card border-primary/20 hover-lift hover-glow animate-fade-in-scale group"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      {notice.is_trending && (
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30">
                          <TrendingUp className="h-4 w-4 text-primary" />
                          <span className="text-xs font-semibold text-primary">{t('community.trending')}</span>
                        </div>
                      )}
                      <div className={`w-3 h-3 rounded-full ${notice.severity === 'high' ? 'bg-destructive' : notice.severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'} animate-pulse`}></div>
                    </div>
                    
                    <h3 className="font-bold text-xl mb-3 group-hover:text-primary transition-colors">
                      {notice.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed line-clamp-3">
                      {notice.description}
                    </p>
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground pt-4 border-t border-primary/10">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5" />
                        <span className="font-medium">{notice.location}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{new Date(notice.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Benefits Section */}
        <Card className="glass-card mb-16 hover-lift">
          <CardContent className="p-12">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {t('community.benefits.title')}
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{t('community.benefits.connect.title')}</h3>
                  <p className="text-sm text-muted-foreground">{t('community.benefits.connect.desc')}</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent/20 to-secondary/20 flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle className="h-8 w-8 text-accent" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{t('community.benefits.alerts.title')}</h3>
                  <p className="text-sm text-muted-foreground">{t('community.benefits.alerts.desc')}</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-secondary/20 to-primary/20 flex items-center justify-center mx-auto mb-4">
                    <Globe className="h-8 w-8 text-secondary" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{t('community.benefits.share.title')}</h3>
                  <p className="text-sm text-muted-foreground">{t('community.benefits.share.desc')}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <Card className="glass-strong border-primary/30 hover-lift animate-pulse-glow">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {t('community.cta.title')}
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              {t('community.cta.description')}
            </p>
            <Button asChild className="bg-gradient-to-r from-primary to-accent hover:shadow-glow transition-all duration-300 hover:scale-105">
              <a href="/dashboard">{t('community.cta.button')}</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Community;
