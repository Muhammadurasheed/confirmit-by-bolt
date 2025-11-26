import { useState } from 'react';
import { X, CheckCircle, Zap, Shield, Database, Code } from 'lucide-react';

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (email: string) => Promise<void>;
}

export default function WaitlistModal({ isOpen, onClose, onSubmit }: WaitlistModalProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onSubmit(email);
      setIsSuccess(true);
      setTimeout(() => {
        setEmail('');
        setIsSuccess(false);
        onClose();
      }, 3000);
    } catch (error) {
      alert('Failed to join waitlist. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const features = [
    { icon: Shield, text: 'Account verification before payment' },
    { icon: CheckCircle, text: 'Business verification & Trust ID NFTs' },
    { icon: Database, text: 'Fraud report database' },
    { icon: Code, text: 'API for developers' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden">
        <div className="relative bg-gradient-to-br from-emerald-500 to-teal-600 p-8 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all"
          >
            <X size={24} />
          </button>

          <div className="flex items-center gap-3 mb-4">
            <Zap size={32} />
            <h2 className="text-3xl font-bold">
              Want the Full ConfirmIT Platform?
            </h2>
          </div>

          <p className="text-emerald-50 text-lg">
            Join 500+ businesses waiting for advanced fraud protection features
          </p>
        </div>

        {!isSuccess ? (
          <div className="p-8">
            <div className="mb-8">
              <h3 className="font-bold text-gray-900 mb-4 text-xl">Coming Soon:</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="bg-emerald-100 rounded-full p-2 mt-0.5">
                      <feature.icon className="text-emerald-600" size={20} />
                    </div>
                    <span className="text-gray-700">{feature.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none text-lg"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-emerald-600 text-white px-6 py-4 rounded-lg font-semibold hover:bg-emerald-700 transition-all disabled:bg-gray-400 text-lg"
              >
                {isSubmitting ? 'Joining...' : 'Join Waitlist'}
              </button>

              <p className="text-sm text-gray-500 text-center mt-4">
                We'll notify you when we launch. No spam, ever.
              </p>
            </form>
          </div>
        ) : (
          <div className="p-8 text-center">
            <CheckCircle className="mx-auto text-emerald-600 mb-4" size={64} />
            <h3 className="text-3xl font-bold text-gray-900 mb-2">
              You're on the list!
            </h3>
            <p className="text-gray-600 mb-6">
              Check your email for confirmation. We'll keep you updated on our progress.
            </p>
            <div className="flex gap-4 justify-center">
              <button className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-all">
                Share on Twitter
              </button>
              <button className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-all">
                Share on WhatsApp
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
