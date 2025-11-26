import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

interface AnalysisProgressProps {
  isAnalyzing: boolean;
}

export default function AnalysisProgress({ isAnalyzing }: AnalysisProgressProps) {
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');

  const stages = [
    { progress: 10, message: 'Uploading receipt...' },
    { progress: 30, message: 'Extracting text with AI...' },
    { progress: 60, message: 'Running forensic checks...' },
    { progress: 80, message: 'Analyzing patterns...' },
    { progress: 95, message: 'Generating verdict...' },
  ];

  useEffect(() => {
    if (!isAnalyzing) {
      setProgress(0);
      return;
    }

    let currentStage = 0;

    const interval = setInterval(() => {
      if (currentStage < stages.length) {
        setProgress(stages[currentStage].progress);
        setStatusMessage(stages[currentStage].message);
        currentStage++;
      } else {
        clearInterval(interval);
      }
    }, 1600);

    return () => clearInterval(interval);
  }, [isAnalyzing]);

  if (!isAnalyzing) return null;

  const remainingTime = Math.max(1, Math.ceil((100 - progress) / 12.5));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
        <div className="text-center mb-8">
          <Loader2 className="mx-auto text-emerald-600 animate-spin mb-4" size={48} />
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Analyzing Receipt
          </h3>
          <p className="text-gray-600">
            {statusMessage}
          </p>
        </div>

        <div className="relative w-full h-3 bg-gray-200 rounded-full overflow-hidden mb-4">
          <div
            className="absolute left-0 top-0 h-full bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <div className="flex justify-between text-sm text-gray-600">
          <span>{progress}%</span>
          <span>{remainingTime} seconds remaining</span>
        </div>
      </div>
    </div>
  );
}
