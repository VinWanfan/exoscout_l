import { useCallback, useState } from 'react';
import { Upload, FileSpreadsheet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  onSampleData: () => void;
}

export const FileUploader = ({ onFileSelect, onSampleData }: FileUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();

  const validateFile = (file: File): boolean => {
    const validTypes = ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    const validExtensions = ['.csv', '.xls', '.xlsx'];
    
    const hasValidType = validTypes.includes(file.type);
    const hasValidExtension = validExtensions.some(ext => file.name.toLowerCase().endsWith(ext));
    
    if (!hasValidType && !hasValidExtension) {
      toast({
        title: "Invalid file type",
        description: "Please upload a CSV or Excel file",
        variant: "destructive",
      });
      return false;
    }
    
    if (file.size > 20 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Maximum file size is 20MB",
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && validateFile(file)) {
      onFileSelect(file);
    }
  }, [onFileSelect, toast]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && validateFile(file)) {
      onFileSelect(file);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-lg p-12 text-center transition-all
          ${isDragging 
            ? 'border-primary bg-primary/10 scale-105' 
            : 'border-border hover:border-primary/50 hover:bg-muted/20'
          }
        `}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="p-4 rounded-full bg-primary/10">
            <Upload className="w-8 h-8 text-primary" />
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-2">Upload Dataset</h3>
            <p className="text-muted-foreground mb-4">
              Drag and drop your CSV file here, or click to browse
            </p>
          </div>

          <input
            type="file"
            accept=".csv,.xls,.xlsx"
            onChange={handleFileInput}
            className="hidden"
            id="file-input"
          />
          
          <Button asChild size="lg" className="gap-2">
            <label htmlFor="file-input" className="cursor-pointer">
              <FileSpreadsheet className="w-4 h-4" />
              Select File
            </label>
          </Button>
        </div>
      </div>

      <div className="text-center">
        <Button 
          variant="outline" 
          onClick={onSampleData}
          className="gap-2"
        >
          Try Sample Data
        </Button>
      </div>
    </div>
  );
};
