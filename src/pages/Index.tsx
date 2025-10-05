import { useState } from 'react';
import Papa from 'papaparse';
import { StarField } from '@/components/StarField';
import { FileUploader } from '@/components/FileUploader';
import { DataPreview } from '@/components/DataPreview';
import { LoadingScreen } from '@/components/LoadingScreen';
import { ResultsDashboard } from '@/components/ResultsDashboard';
import { useToast } from '@/hooks/use-toast';
import { predictExoplanets } from '@/api/predictExoplanets';
import { generateSampleData } from '@/utils/sampleData';

type AppState = 'upload' | 'preview' | 'loading' | 'results';

interface Prediction {
  row_index: number;
  label: 'exoplanet' | 'not_exoplanet' | 'candidate';
  probability: number;
}

const Index = () => {
  const [state, setState] = useState<AppState>('upload');
  const [csvData, setCsvData] = useState<any[]>([]);
  const [fileName, setFileName] = useState('');
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [modelInfo, setModelInfo] = useState({ name: '', version: '' });
  const { toast } = useToast();

  const handleFileSelect = (file: File) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.data.length === 0) {
          toast({
            title: 'Empty file',
            description: 'The CSV file contains no data',
            variant: 'destructive',
          });
          return;
        }

        const columns = Object.keys(results.data[0] as object);
        if (columns.length !== 12) {
          toast({
            title: 'Invalid format',
            description: `Expected 12 columns, found ${columns.length}`,
            variant: 'destructive',
          });
          return;
        }

        setCsvData(results.data);
        setFileName(file.name);
        setState('preview');
      },
      error: (error) => {
        toast({
          title: 'Parse error',
          description: error.message,
          variant: 'destructive',
        });
      },
    });
  };

  const handleSampleData = () => {
    const sampleData = generateSampleData();
    setCsvData(sampleData);
    setFileName('sample-exoplanet-data.csv');
    setState('preview');
  };

  const handleAnalyze = async () => {
    setState('loading');

    try {
      // Convert data back to CSV file for API
      const csv = Papa.unparse(csvData);
      const blob = new Blob([csv], { type: 'text/csv' });
      const file = new File([blob], fileName, { type: 'text/csv' });

      const result = await predictExoplanets(file);
      setPredictions(result.predictions);
      setModelInfo(result.model);
      setState('results');
    } catch (error) {
      toast({
        title: 'Analysis failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
      setState('preview');
    }
  };

  const handleReset = () => {
    setState('upload');
    setCsvData([]);
    setFileName('');
    setPredictions([]);
  };

  return (
    <div className="min-h-screen bg-background dark relative overflow-hidden">
      <StarField />
      
      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-border/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <span className="text-2xl">🛸</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  ExoScout
                </h1>
                <p className="text-sm text-muted-foreground">AI-Powered Exoplanet Detection</p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-12">
          {state === 'upload' && (
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <div className="space-y-4">
                <h2 className="text-4xl font-bold">Discover New Worlds</h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Upload your exoplanet candidate dataset and let our AI classify potential discoveries
                </p>
              </div>
              <FileUploader onFileSelect={handleFileSelect} onSampleData={handleSampleData} />
            </div>
          )}

          {state === 'preview' && (
            <DataPreview
              data={csvData}
              fileName={fileName}
              onAnalyze={handleAnalyze}
              onBack={handleReset}
            />
          )}

          {state === 'loading' && <LoadingScreen />}

          {state === 'results' && (
            <ResultsDashboard
              predictions={predictions}
              modelName={modelInfo.name}
              modelVersion={modelInfo.version}
              originalData={csvData}
              onReset={handleReset}
            />
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-border/50 backdrop-blur-sm mt-20">
          <div className="container mx-auto px-4 py-6">
            <p className="text-center text-sm text-muted-foreground">
              🔒 Files are processed for predictions only. No data is stored.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
