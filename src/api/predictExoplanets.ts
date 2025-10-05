interface Prediction {
  row_index: number;
  label: 'exoplanet' | 'not_exoplanet' | 'candidate';
  probability: number;
  id?: string;
}

interface PredictionResponse {
  predictions: Prediction[];
  model: {
    name: string;
    version: string;
  };
}

// Placeholder API - will be replaced with real endpoint
export const predictExoplanets = async (file: File): Promise<PredictionResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  // TODO: Replace with actual API endpoint when provided
  const API_ENDPOINT = '/api/predict';

  try {
    // For now, simulate API call with mock data
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock response - will be replaced with actual API call
    // const response = await fetch(API_ENDPOINT, {
    //   method: 'POST',
    //   body: formData,
    // });
    // 
    // if (!response.ok) {
    //   throw new Error('Prediction failed');
    // }
    // 
    // return await response.json();

    // Mock data for development
    const mockPredictions: Prediction[] = Array.from({ length: 5 }, (_, i) => ({
      row_index: i,
      label: i % 3 === 0 ? 'exoplanet' : i % 3 === 1 ? 'candidate' : 'not_exoplanet',
      probability: Math.random() * 0.4 + 0.6, // 60-100%
    }));

    return {
      predictions: mockPredictions,
      model: {
        name: 'ExoModel',
        version: '1.0.0',
      },
    };
  } catch (error) {
    console.error('Prediction error:', error);
    throw new Error('Failed to analyze exoplanets. Please try again.');
  }
};
