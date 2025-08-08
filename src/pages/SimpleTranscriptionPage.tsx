import React from 'react';

const SimpleTranscriptionPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Transcription (Version Simple)</h1>
      <div className="bg-gray-800 rounded-lg p-6">
        <p className="text-green-400 mb-4">
          ✅ Si vous voyez ce message, le problème vient du contenu de TranscriptionPage
        </p>
        <div className="bg-gray-700 p-4 rounded">
          <h2 className="text-xl mb-3">Zone de test</h2>
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded">
            Test Button
          </button>
        </div>
      </div>
    </div>
  );
};

export default SimpleTranscriptionPage;