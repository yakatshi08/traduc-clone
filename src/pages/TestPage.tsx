import React from 'react';

const TestPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-white">Page de Test</h1>
      <div className="bg-gray-800 rounded-lg p-6">
        <p className="text-green-400 text-xl">
          ✅ Si vous voyez ce message, l'import des pages fonctionne !
        </p>
      </div>
    </div>
  );
};

export default TestPage;