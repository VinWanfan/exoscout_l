import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, FileSpreadsheet } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface DataPreviewProps {
  data: any[];
  fileName: string;
  onAnalyze: () => void;
  onBack: () => void;
}

export const DataPreview = ({ data, fileName, onAnalyze, onBack }: DataPreviewProps) => {
  const previewRows = data.slice(0, 5);
  const columns = Object.keys(data[0] || {});
  const fileSize = (new Blob([JSON.stringify(data)]).size / 1024).toFixed(2);

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">File Name</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-primary" />
              <p className="font-semibold truncate">{fileName}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Rows</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-primary">{data.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Columns</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-primary">{columns.length}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Data Preview</CardTitle>
          <CardDescription>First 5 rows of your dataset</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  {columns.map((col) => (
                    <TableHead key={col}>{col}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {previewRows.map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="font-medium">{idx + 1}</TableCell>
                    {columns.map((col) => (
                      <TableCell key={col}>{row[col]}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4 justify-center">
        <Button variant="outline" onClick={onBack}>
          Upload Different File
        </Button>
        <Button size="lg" onClick={onAnalyze} className="gap-2">
          Analyze with AI
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
