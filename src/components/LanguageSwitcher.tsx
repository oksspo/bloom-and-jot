
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Languages } from 'lucide-react';
import { useLocale } from '@/hooks/useLocale';

const LanguageSwitcher = () => {
  const { locale, setLocale } = useLocale();

  const toggleLanguage = () => {
    setLocale(locale === 'en' ? 'de' : 'en');
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="flex items-center gap-2"
    >
      <Languages className="h-4 w-4" />
      <Badge variant="secondary" className="bg-blue-100 text-blue-700">
        {locale.toUpperCase()}
      </Badge>
    </Button>
  );
};

export default LanguageSwitcher;
