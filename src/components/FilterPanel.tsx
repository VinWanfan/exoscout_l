import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Filter } from 'lucide-react';

interface FilterPanelProps {
  selectedLabel: string;
  onLabelChange: (label: string) => void;
  certaintyCutoff: number;
  onCertaintyCutoffChange: (value: number) => void;
}

export const FilterPanel = ({
  selectedLabel,
  onLabelChange,
  certaintyCutoff,
  onCertaintyCutoffChange,
}: FilterPanelProps) => {
  const labels = [
    { value: 'all', label: 'All Results' },
    { value: 'exoplanet', label: '🪐 Exoplanet' },
    { value: 'candidate', label: '⚠️ Candidate' },
    { value: 'not_exoplanet', label: '❌ Not Exoplanet' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Filter className="w-4 h-4" />
          Filters
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <label className="text-sm font-medium">Filter by Label</label>
          <div className="flex flex-wrap gap-2">
            {labels.map((label) => (
              <Button
                key={label.value}
                variant={selectedLabel === label.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => onLabelChange(label.value)}
              >
                {label.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Certainty Threshold</label>
            <span className="text-sm text-muted-foreground">{certaintyCutoff}%+</span>
          </div>
          <Slider
            value={[certaintyCutoff]}
            onValueChange={([value]) => onCertaintyCutoffChange(value)}
            min={0}
            max={100}
            step={5}
            className="w-full"
          />
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            onLabelChange('all');
            onCertaintyCutoffChange(0);
          }}
          className="w-full"
        >
          Reset Filters
        </Button>
      </CardContent>
    </Card>
  );
};
