import { useRef, useState } from 'react';
import HeroSection from './components/HeroSection';
import ProblemStatement from './components/ProblemStatement';
import HowItWorks from './components/HowItWorks';
import UploadZone from './components/UploadZone';
import AnalysisProgress from './components/AnalysisProgress';
import ResultsDisplay from './components/ResultsDisplay';
import SocialProof from './components/SocialProof';
import WaitlistModal from './components/WaitlistModal';
import Footer from './components/Footer';

interface AnalysisResult {
  receiptId: string;
  trustScore: number;
  verdict: 'authentic' | 'suspicious' | 'fraudulent';
  extracted: {
    merchant: string;
    amount: string;
    date: string;
    reference: string;
    method: string;
  };
  issues: string[];
  recommendation: string;
  analyzedAt: string;
}

function App() {
  const uploadRef = useRef<HTMLDivElement>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);

  const scrollToUpload = () => {
    uploadRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFileSelect = async (file: File) => {
    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      const formData = new FormData();
      formData.append('receipt', file);

      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-receipt`;
      const headers = {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers,
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const result = await response.json();

      setTimeout(async () => {
        const { saveReceiptAnalysis } = await import('./lib/api');
        await saveReceiptAnalysis({
          receiptId: result.receiptId,
          trustScore: result.trustScore,
          verdict: result.verdict,
          extracted: result.extracted,
          issues: result.issues,
          recommendation: result.recommendation,
        });

        setIsAnalyzing(false);
        setAnalysisResult(result);
      }, 8000);
    } catch (error) {
      console.error('Analysis error:', error);
      setIsAnalyzing(false);
    }
  };

  const handleCheckAnother = () => {
    setAnalysisResult(null);
    scrollToUpload();
  };

  const handleWaitlistSubmit = async (email: string) => {
    const { joinWaitlist } = await import('./lib/api');
    await joinWaitlist(email, 'landing_page');
  };

  return (
    <div className="min-h-screen bg-white">
      <HeroSection
        onScrollToUpload={scrollToUpload}
        onOpenWaitlist={() => setIsWaitlistOpen(true)}
      />

      <ProblemStatement />

      <HowItWorks />

      <div ref={uploadRef}>
        <UploadZone onFileSelect={handleFileSelect} />
      </div>

      <AnalysisProgress isAnalyzing={isAnalyzing} />

      {analysisResult && (
        <ResultsDisplay
          result={analysisResult}
          onCheckAnother={handleCheckAnother}
        />
      )}

      <SocialProof />

      <Footer />

      <WaitlistModal
        isOpen={isWaitlistOpen}
        onClose={() => setIsWaitlistOpen(false)}
        onSubmit={handleWaitlistSubmit}
      />
    </div>
  );
}

export default App;
