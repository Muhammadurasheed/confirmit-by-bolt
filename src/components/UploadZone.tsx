import { useCallback, useState } from 'react';
import { Upload, Camera, FileImage, X } from 'lucide-react';

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
}

export default function UploadZone({ onFileSelect }: UploadZoneProps) {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  }, []);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (JPG, PNG)');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    onFileSelect(file);
  };

  const clearPreview = () => {
    setPreview(null);
  };

  return (
    <section id="upload-section" className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Try QuickScan Now
          </h2>
          <p className="text-xl text-gray-600">
            Upload a receipt to verify its authenticity in seconds
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-200">
          {!preview ? (
            <form
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className="relative"
            >
              <input
                id="file-upload"
                type="file"
                accept="image/*"
                onChange={handleChange}
                className="hidden"
              />

              <div
                className={`
                  border-3 border-dashed rounded-xl p-12 text-center transition-all
                  ${dragActive
                    ? 'border-emerald-500 bg-emerald-50'
                    : 'border-gray-300 bg-gray-50 hover:border-emerald-400 hover:bg-emerald-50'
                  }
                `}
              >
                <Upload className="mx-auto mb-4 text-emerald-600" size={64} />

                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Drop receipt here
                </h3>
                <p className="text-gray-600 mb-6">
                  or click to browse
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <label
                    htmlFor="file-upload"
                    className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-all cursor-pointer inline-flex items-center gap-2 justify-center"
                  >
                    <FileImage size={20} />
                    Choose File
                  </label>

                  <label
                    htmlFor="file-upload"
                    className="bg-white text-emerald-600 border-2 border-emerald-600 px-6 py-3 rounded-lg font-semibold hover:bg-emerald-50 transition-all cursor-pointer inline-flex items-center gap-2 justify-center"
                  >
                    <Camera size={20} />
                    Take Photo
                  </label>
                </div>

                <p className="text-sm text-gray-500 mt-6">
                  Accepts JPG, PNG, PDF (max 10MB)
                </p>
              </div>
            </form>
          ) : (
            <div className="relative">
              <button
                onClick={clearPreview}
                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-all z-10"
              >
                <X size={20} />
              </button>

              <img
                src={preview}
                alt="Receipt preview"
                className="w-full max-h-96 object-contain rounded-lg mb-4"
              />

              <p className="text-center text-gray-600">
                Receipt uploaded successfully. Analysis in progress...
              </p>
            </div>
          )}
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Your receipts are analyzed securely. We don't store personal information.
        </p>
      </div>
    </section>
  );
}
