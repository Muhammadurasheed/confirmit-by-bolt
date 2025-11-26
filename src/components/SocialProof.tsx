import { Star, Quote } from 'lucide-react';

export default function SocialProof() {
  return (
    <section className="py-20 bg-emerald-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Trusted by Nigerians
          </h2>
          <p className="text-xl text-gray-600">
            Real people protecting their businesses from fraud
          </p>
        </div>

        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8 relative">
          <Quote className="absolute top-6 left-6 text-emerald-200" size={48} />

          <div className="relative z-10">
            <div className="flex gap-1 mb-4 justify-center">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="text-yellow-400 fill-yellow-400" size={24} />
              ))}
            </div>

            <p className="text-xl text-gray-700 mb-6 text-center leading-relaxed">
              "I almost lost ₦85,000 to a fake Opay receipt. The customer showed me a 'payment confirmation' but something felt off. I used ConfirmIT QuickScan and within 8 seconds, it flagged the receipt as fraudulent. The fonts were edited and metadata was missing. This tool saved my business!"
            </p>

            <div className="text-center">
              <p className="font-bold text-gray-900 text-lg">Victor Okonkwo</p>
              <p className="text-gray-600">Electronics Retailer, Lagos</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-12 max-w-4xl mx-auto">
          <div className="bg-white rounded-xl p-6 text-center shadow-sm">
            <p className="text-3xl font-bold text-emerald-600 mb-2">250+</p>
            <p className="text-gray-600">Receipts Analyzed This Week</p>
          </div>

          <div className="bg-white rounded-xl p-6 text-center shadow-sm">
            <p className="text-3xl font-bold text-emerald-600 mb-2">₦2.5M</p>
            <p className="text-gray-600">Fraud Losses Prevented</p>
          </div>

          <div className="bg-white rounded-xl p-6 text-center shadow-sm">
            <p className="text-3xl font-bold text-emerald-600 mb-2">8 sec</p>
            <p className="text-gray-600">Average Analysis Time</p>
          </div>
        </div>
      </div>
    </section>
  );
}
