import React, { useState } from 'react';
import { Calculator, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslation } from 'react-i18next';

const ROICalculator: React.FC = () => {
  const { t } = useTranslation();
  const [employees, setEmployees] = useState<number>(5);
  const [hourlyRate, setHourlyRate] = useState<number>(30);
  const [hoursPerDay, setHoursPerDay] = useState<number>(4);

  const calculateSavings = () => {
    const monthlyEmployeeCost = employees * hourlyRate * hoursPerDay * 22; // 22 working days
    const aiCost = 197; // Pro plan price
    const monthlySavings = monthlyEmployeeCost - aiCost;
    const yearlySavings = monthlySavings * 12;
    const roi = ((monthlySavings * 12) / (aiCost * 12)) * 100;

    return {
      monthlyEmployeeCost,
      monthlySavings,
      yearlySavings,
      roi
    };
  };

  const savings = calculateSavings();

  return (
    <section className="py-20 px-4 bg-white">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-900 mb-6">
            {t('roiCalculator.title')}
          </h2>
          <p className="text-xl text-slate-600">
            {t('roiCalculator.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Calculator Input */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                {t('roiCalculator.inputs.title')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="employees">{t('roiCalculator.inputs.employees')}</Label>
                <Input
                  id="employees"
                  type="number"
                  value={employees}
                  onChange={(e) => setEmployees(Number(e.target.value))}
                  min="1"
                  max="50"
                />
              </div>
              
              <div>
                <Label htmlFor="hourlyRate">{t('roiCalculator.inputs.hourlyRate')}</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2">R$</span>
                  <Input
                    id="hourlyRate"
                    type="number"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(Number(e.target.value))}
                    className="pl-10"
                    min="10"
                    max="200"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="hoursPerDay">{t('roiCalculator.inputs.hoursPerDay')}</Label>
                <Input
                  id="hoursPerDay"
                  type="number"
                  value={hoursPerDay}
                  onChange={(e) => setHoursPerDay(Number(e.target.value))}
                  min="1"
                  max="8"
                />
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          <Card className="bg-gradient-to-br from-green-50 to-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700">
                <DollarSign className="w-5 h-5" />
                {t('roiCalculator.results.title')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-white rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">
                  {t('roiCalculator.results.currentCost')}
                </div>
                <div className="text-2xl font-bold text-red-600">
                  R$ {savings.monthlyEmployeeCost.toLocaleString()}/mês
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">
                  {t('roiCalculator.results.monthlySavings')}
                </div>
                <div className="text-2xl font-bold text-green-600">
                  R$ {savings.monthlySavings.toLocaleString()}/mês
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">
                  {t('roiCalculator.results.yearlySavings')}
                </div>
                <div className="text-3xl font-bold text-blue-600">
                  R$ {savings.yearlySavings.toLocaleString()}/ano
                </div>
              </div>
              
              <div className="bg-green-100 border border-green-200 rounded-lg p-4">
                <div className="text-sm text-green-800 mb-1">
                  {t('roiCalculator.results.roi')}
                </div>
                <div className="text-xl font-bold text-green-800">
                  {savings.roi.toFixed(0)}%
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-8">
          <p className="text-gray-600 mb-4">
            {t('roiCalculator.disclaimer')}
          </p>
        </div>
      </div>
    </section>
  );
};

export default ROICalculator;