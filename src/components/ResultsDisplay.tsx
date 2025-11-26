import { CheckCircle, AlertTriangle, XCircle, Download, RotateCcw, Flag } from 'lucide-react';

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

interface ResultsDisplayProps {
  result: AnalysisResult;
  onCheckAnother: () => void;
}

export default function ResultsDisplay({ result, onCheckAnother }: ResultsDisplayProps) {
  const getVerdictConfig = () => {
    switch (result.verdict) {
      case 'authentic':
        return {
          color: 'emerald',
          icon: CheckCircle,
          label: 'Authentic',
          bgColor: 'bg-emerald-50',
          borderColor: 'border-emerald-200',
          textColor: 'text-emerald-900',
          iconColor: 'text-emerald-600',
        };
      case 'suspicious':
        return {
          color: 'yellow',
          icon: AlertTriangle,
          label: 'Suspicious',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          textColor: 'text-yellow-900',
          iconColor: 'text-yellow-600',
        };
      case 'fraudulent':
        return {
          color: 'red',
          icon: XCircle,
          label: 'Fraudulent',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          textColor: 'text-red-900',
          iconColor: 'text-red-600',
        };
    }
  };

  const config = getVerdictConfig();
  const VerdictIcon = config.icon;

  const getScoreColor = () => {
    if (result.trustScore >= 61) return 'text-emerald-600';
    if (result.trustScore >= 31) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreGradient = () => {
    if (result.trustScore >= 61) return 'from-emerald-500 to-emerald-600';
    if (result.trustScore >= 31) return 'from-yellow-500 to-yellow-600';
    return 'from-red-500 to-red-600';
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Analysis Complete
          </h2>
          <p className="text-gray-600">
            Receipt ID: {result.receiptId}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex flex-col items-center mb-8">
            <div className="relative w-48 h-48 mb-6">
              <svg className="transform -rotate-90 w-48 h-48">
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="#e5e7eb"
                  strokeWidth="12"
                  fill="none"
                />
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  className={`stroke-current ${getScoreColor()}`}
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 88}`}
                  strokeDashoffset={`${2 * Math.PI * 88 * (1 - result.trustScore / 100)}`}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 1s ease-out' }}
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-5xl font-bold ${getScoreColor()}`}>
                  {result.trustScore}
                </span>
                <span className="text-gray-600 text-sm font-semibold">Trust Score</span>
              </div>
            </div>

            <div className={`${config.bgColor} border-2 ${config.borderColor} rounded-2xl px-8 py-4 flex items-center gap-3`}>
              <VerdictIcon className={config.iconColor} size={32} />
              <span className={`text-2xl font-bold ${config.textColor}`}>
                {config.label}
              </span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-bold text-gray-900 mb-4 text-lg">Extracted Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Merchant:</span>
                  <span className="font-semibold text-gray-900">{result.extracted.merchant}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-semibold text-gray-900">{result.extracted.amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-semibold text-gray-900">{result.extracted.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Reference:</span>
                  <span className="font-mono text-xs text-gray-900">{result.extracted.reference}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Method:</span>
                  <span className="font-semibold text-gray-900">{result.extracted.method}</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-bold text-gray-900 mb-4 text-lg">
                Issues Found {result.issues.length > 0 && `(${result.issues.length})`}
              </h3>
              {result.issues.length > 0 ? (
                <ul className="space-y-2 text-sm">
                  {result.issues.map((issue, index) => (
                    <li key={index} className="flex items-start gap-2 text-red-900">
                      <span className="text-red-600 font-bold mt-0.5">×</span>
                      <span>{issue}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-emerald-600 text-sm flex items-center gap-2">
                  <CheckCircle size={16} />
                  No issues detected
                </p>
              )}
            </div>
          </div>

          <div className={`${config.bgColor} border-2 ${config.borderColor} rounded-xl p-6 mb-8`}>
            <h3 className={`font-bold ${config.textColor} mb-2 text-lg`}>Recommendation</h3>
            <p className={config.textColor}>{result.recommendation}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-all flex items-center justify-center gap-2">
              <Download size={20} />
              Download Report
            </button>

            <button
              onClick={onCheckAnother}
              className="bg-white text-emerald-600 border-2 border-emerald-600 px-6 py-3 rounded-lg font-semibold hover:bg-emerald-50 transition-all flex items-center justify-center gap-2"
            >
              <RotateCcw size={20} />
              Check Another Receipt
            </button>

            <button className="bg-white text-gray-700 border-2 border-gray-300 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
              <Flag size={20} />
              Report This Receipt
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
