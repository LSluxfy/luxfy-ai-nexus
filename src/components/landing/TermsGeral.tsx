import { Shield } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';

export default function TermsGeral() {
  const { t } = useTranslation();

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto">
        <Card className="max-w-4xl mx-auto border-2 border-green-200 shadow-2xl">
          <CardContent className="p-12 text-center">
            <div className="bg-green-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8">
              <Shield className="w-12 h-12 text-green-600" />
            </div>
            
            <h2 className="text-4xl font-bold text-slate-900 mb-6">
              {t('terms.title')}
            </h2>
            
            <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
              {t('terms.description')}
            </p>
            
           
            <div className="bg-green-100 border border-green-200 rounded-lg p-6">
              <p className="text-green-800 font-semibold text-lg">
                {t('terms.lastUpdated')}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
