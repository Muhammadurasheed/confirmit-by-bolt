import { AlertTriangle, CheckCircle } from 'lucide-react';

export default function ProblemStatement() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            The Problem Is Real
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Anyone with Photoshop can create a fake receipt in 10 minutes. Our AI detects it in 8 seconds.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="text-red-600" size={32} />
              <h3 className="text-2xl font-bold text-red-900">Fake Receipt</h3>
            </div>
            <div className="bg-white rounded-lg p-6 mb-4 shadow-sm">
              <div className="text-sm font-mono text-gray-700 space-y-2">
                <div className="flex justify-between">
                  <span>Opay</span>
                  <span className="text-red-600 font-bold">EDITED</span>
                </div>
                <div className="h-px bg-gray-200"></div>
                <div className="flex justify-between">
                  <span>Amount:</span>
                  <span className="font-bold">₦85,000</span>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Ref:</span>
                  <span>OPAY12345678</span>
                </div>
              </div>
            </div>
            <ul className="space-y-2 text-sm text-red-900">
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold">×</span>
                <span>Font inconsistency detected</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold">×</span>
                <span>Image compression artifacts</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold">×</span>
                <span>Metadata missing</span>
              </li>
            </ul>
          </div>

          <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="text-emerald-600" size={32} />
              <h3 className="text-2xl font-bold text-emerald-900">Real Receipt</h3>
            </div>
            <div className="bg-white rounded-lg p-6 mb-4 shadow-sm">
              <div className="text-sm font-mono text-gray-700 space-y-2">
                <div className="flex justify-between">
                  <span>Opay</span>
                  <span className="text-emerald-600 font-bold">VERIFIED</span>
                </div>
                <div className="h-px bg-gray-200"></div>
                <div className="flex justify-between">
                  <span>Amount:</span>
                  <span className="font-bold">₦85,000</span>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Ref:</span>
                  <span>OPAY12345678</span>
                </div>
              </div>
            </div>
            <ul className="space-y-2 text-sm text-emerald-900">
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>All fonts match standard</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>No editing artifacts found</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Original metadata intact</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
