import { ArrowDown } from 'lucide-react';

interface HeroSectionProps {
  onScrollToUpload: () => void;
  onOpenWaitlist: () => void;
}

export default function HeroSection({ onScrollToUpload, onOpenWaitlist }: HeroSectionProps) {
  return (
    <section className="relative bg-gradient-to-br from-emerald-50 via-white to-teal-50 pt-20 pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Verify Receipt Authenticity
            <br />
            <span className="text-emerald-600">in 8 Seconds</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            AI-powered fraud detection for Nigerian payments. Protect yourself from ₦5 billion in annual fraud losses.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <button
              onClick={onScrollToUpload}
              className="bg-emerald-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-emerald-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              Try QuickScan Free
              <ArrowDown size={20} />
            </button>

            <button
              onClick={onOpenWaitlist}
              className="bg-white text-emerald-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-all border-2 border-emerald-600"
            >
              Join Waitlist for Full Version
            </button>
          </div>

          <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-600">
            <div>
              <span className="font-bold text-2xl text-emerald-600">250+</span>
              <p>Nigerians tested QuickScan</p>
            </div>
            <div>
              <span className="font-bold text-2xl text-emerald-600">₦2.5M</span>
              <p>Fraud losses prevented</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
