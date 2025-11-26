import { Upload, Scan, CheckCircle } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      icon: Upload,
      title: 'Upload Receipt',
      description: 'Drag-drop your receipt or snap a photo with your camera',
    },
    {
      icon: Scan,
      title: 'AI Analyzes in 8 Seconds',
      description: 'Our AI runs forensic checks on fonts, metadata, and patterns',
    },
    {
      icon: CheckCircle,
      title: 'Get Trust Score',
      description: 'Receive a 0-100 score with clear verdict and recommendations',
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Three simple steps to protect yourself from fraud
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                  <step.icon className="text-emerald-600" size={32} />
                </div>

                <div className="absolute -top-4 -left-4 bg-emerald-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg">
                  {index + 1}
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
