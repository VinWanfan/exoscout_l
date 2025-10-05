import { useState, useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Prediction {
  row_index: number;
  label: 'exoplanet' | 'not_exoplanet' | 'candidate';
  probability: number;
  id?: string;
}

interface ResultsTableProps {
  predictions: Prediction[];
  filterLabel: string;
  certaintyCutoff: number;
}

export const ResultsTable = ({ predictions, filterLabel, certaintyCutoff }: ResultsTableProps) => {
  const [sortBy, setSortBy] = useState<'row' | 'certainty'>('row');
  const [sortDesc, setSortDesc] = useState(false);

  const filteredData = useMemo(() => {
    let filtered = predictions.filter(p => {
      const certainty = p.probability * 100;
      const matchesLabel = filterLabel === 'all' || p.label === filterLabel;
      const matchesCertainty = certainty >= certaintyCutoff;
      return matchesLabel && matchesCertainty;
    });

    // Sort
    filtered.sort((a, b) => {
      const aVal = sortBy === 'row' ? a.row_index : a.probability;
      const bVal = sortBy === 'row' ? b.row_index : b.probability;
      return sortDesc ? bVal - aVal : aVal - bVal;
    });

    return filtered;
  }, [predictions, filterLabel, certaintyCutoff, sortBy, sortDesc]);

  const handleSort = (column: 'row' | 'certainty') => {
    if (sortBy === column) {
      setSortDesc(!sortDesc);
    } else {
      setSortBy(column);
      setSortDesc(false);
    }
  };

  const getLabelBadge = (label: string) => {
    const variants = {
      exoplanet: 'default',
      not_exoplanet: 'destructive',
      candidate: 'secondary',
    } as const;

    const labels = {
      exoplanet: '🪐 Exoplanet',
      not_exoplanet: '❌ Not Exoplanet',
      candidate: '⚠️ Candidate',
    } as const;

    return (
      <Badge variant={variants[label as keyof typeof variants]}>
        {labels[label as keyof typeof labels]}
      </Badge>
    );
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
        <Table>
          <TableHeader className="sticky top-0 bg-card z-10">
            <TableRow>
              <TableHead className="w-24">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('row')}
                  className="gap-1 font-semibold"
                >
                  Row
                  <ArrowUpDown className="w-3 h-3" />
                </Button>
              </TableHead>
              <TableHead>Predicted Label</TableHead>
              <TableHead className="w-64">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('certainty')}
                  className="gap-1 font-semibold"
                >
                  Certainty
                  <ArrowUpDown className="w-3 h-3" />
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                  No results match your filters
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((pred) => {
                const certainty = pred.probability * 100;
                return (
                  <TableRow key={pred.row_index}>
                    <TableCell className="font-medium">#{pred.row_index + 1}</TableCell>
                    <TableCell>{getLabelBadge(pred.label)}</TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{certainty.toFixed(1)}%</span>
                        </div>
                        <Progress value={certainty} className="h-2" />
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
