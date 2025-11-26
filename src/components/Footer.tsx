import { Mail, Shield } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Shield className="text-emerald-400" size={32} />
              <h3 className="text-2xl font-bold">ConfirmIT Lite</h3>
            </div>
            <p className="text-gray-400 leading-relaxed">
              AI-powered receipt verification protecting Nigerian businesses from fraud.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4">QuickScan</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Instant receipt verification</li>
              <li>Trust Score technology</li>
              <li>Fraud detection AI</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4">Contact</h4>
            <div className="flex items-center gap-2 text-gray-400 mb-4">
              <Mail size={20} className="text-emerald-400" />
              <a href="mailto:hello@confirmit.africa" className="hover:text-emerald-400 transition-colors">
                hello@confirmit.africa
              </a>
            </div>
            <p className="text-sm text-gray-500">
              Lagos, Nigeria
            </p>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
          <p className="mb-2">
            Built during Half Baked Hackathon 2025
          </p>
          <p className="text-sm">
            © 2025 ConfirmIT. Protecting Nigerian commerce from fraud.
          </p>
        </div>
      </div>
    </footer>
  );
}
