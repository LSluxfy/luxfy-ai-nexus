import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, X, AlertTriangle } from 'lucide-react';

interface BulkActionsPanelProps {
  selectedCount: number;
  onMarkAllPaid: () => void;
  onClearSelection: () => void;
  isLoading: boolean;
}

export const BulkActionsPanel: React.FC<BulkActionsPanelProps> = ({
  selectedCount,
  onMarkAllPaid,
  onClearSelection,
  isLoading,
}) => {
  return (
    <Card className="mb-6 border-primary/20 bg-primary/5">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-primary" />
              <span className="font-medium">
                {selectedCount} faturas selecionadas
              </span>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onClearSelection}
              disabled={isLoading}
            >
              <X className="h-4 w-4 mr-2" />
              Limpar Seleção
            </Button>
            
            <Button
              size="sm"
              onClick={onMarkAllPaid}
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              {isLoading ? 'Processando...' : 'Marcar Todas como Pagas'}
            </Button>
          </div>
        </div>
        
        <div className="mt-3 text-sm text-muted-foreground">
          Esta ação marcará todas as faturas selecionadas como pagas usando o valor original de cada fatura.
        </div>
      </CardContent>
    </Card>
  );
};