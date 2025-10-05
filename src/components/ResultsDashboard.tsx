import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, RotateCcw } from 'lucide-react';
import { ResultsTable } from './ResultsTable';
import { FilterPanel } from './FilterPanel';
import { Badge } from '@/components/ui/badge';

interface Prediction {
  row_index: number;
  label: 'exoplanet' | 'not_exoplanet' | 'candidate';
  probability: number;
  id?: string;
}

interface ResultsDashboardProps {
  predictions: Prediction[];
  modelName: string;
  modelVersion: string;
  originalData: any[];
  onReset: () => void;
}

export const ResultsDashboard = ({
  predictions,
  modelName,
  modelVersion,
  originalData,
  onReset,
}: ResultsDashboardProps) => {
  const [filterLabel, setFilterLabel] = useState('all');
  const [certaintyCutoff, setCertaintyCutoff] = useState(0);

  const exoplanetCount = predictions.filter(p => p.label === 'exoplanet').length;
  const candidateCount = predictions.filter(p => p.label === 'candidate').length;
  const exoplanetPercentage = ((exoplanetCount / predictions.length) * 100).toFixed(1);

  const handleDownload = () => {
    const csvData = predictions.map((pred, idx) => ({
      ...originalData[idx],
      predicted_label: pred.label,
      certainty: (pred.probability * 100).toFixed(2),
    }));

    const headers = Object.keys(csvData[0]);
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => headers.map(h => row[h]).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `exoscout-results-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Analyzed</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">{predictions.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Exoplanets Detected</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-500">{exoplanetCount}</p>
            <p className="text-sm text-muted-foreground mt-1">{exoplanetPercentage}% of total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Candidates</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-yellow-500">{candidateCount}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Model</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="secondary" className="text-sm">
              {modelName} v{modelVersion}
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-80">
          <FilterPanel
            selectedLabel={filterLabel}
            onLabelChange={setFilterLabel}
            certaintyCutoff={certaintyCutoff}
            onCertaintyCutoffChange={setCertaintyCutoff}
          />
        </div>

        <div className="flex-1 space-y-4">
          <div className="flex flex-wrap gap-3 justify-between items-center">
            <h2 className="text-2xl font-bold">Analysis Results</h2>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onReset} className="gap-2">
                <RotateCcw className="w-4 h-4" />
                New Analysis
              </Button>
              <Button onClick={handleDownload} className="gap-2">
                <Download className="w-4 h-4" />
                Download CSV
              </Button>
            </div>
          </div>

          <ResultsTable
            predictions={predictions}
            filterLabel={filterLabel}
            certaintyCutoff={certaintyCutoff}
          />
        </div>
      </div>
    </div>
  );
};
