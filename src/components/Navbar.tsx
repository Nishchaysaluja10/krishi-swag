import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { LanguageSelector } from './LanguageSelector';
import { Leaf, LogOut } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';

export const Navbar = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <nav className="glass border-b/50 sticky top-0 z-50 animate-slide-in-up">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary to-accent group-hover:shadow-glow transition-all duration-300 hover:scale-110 hover:rotate-6">
              <Leaf className="h-6 w-6 text-primary-foreground animate-float" />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent animate-gradient">
              CropGuard AI
            </span>
          </Link>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-2">
              <Link 
                to="/" 
                className="px-4 py-2 rounded-lg text-sm font-medium hover:text-primary transition-all duration-300 hover:bg-primary/10 hover:scale-105"
              >
                {t('nav.home')}
              </Link>
              <Link 
                to="/about" 
                className="px-4 py-2 rounded-lg text-sm font-medium hover:text-primary transition-all duration-300 hover:bg-primary/10 hover:scale-105"
              >
                {t('nav.about')}
              </Link>
              <Link 
                to="/how-it-works" 
                className="px-4 py-2 rounded-lg text-sm font-medium hover:text-primary transition-all duration-300 hover:bg-primary/10 hover:scale-105"
              >
                {t('nav.howItWorks')}
              </Link>
              <Link 
                to="/community" 
                className="px-4 py-2 rounded-lg text-sm font-medium hover:text-primary transition-all duration-300 hover:bg-primary/10 hover:scale-105"
              >
                {t('nav.community')}
              </Link>
            </div>

            <LanguageSelector />

            {user ? (
              <>
                <Button asChild variant="outline" size="sm">
                  <Link to="/dashboard">{t('nav.dashboard')}</Link>
                </Button>
                <Button onClick={handleLogout} variant="ghost" size="sm">
                  <LogOut className="h-4 w-4 mr-2" />
                  {t('nav.logout')}
                </Button>
              </>
            ) : (
              <Button asChild size="sm">
                <Link to="/auth">{t('nav.login')}</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
