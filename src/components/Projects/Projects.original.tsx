import React from 'react';

const Projects = ({ onNavigate }: any) => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-white mb-4">Page Projets (Test)</h1>
      <button 
        onClick={() => {
          console.log('Button clicked!');
          if (onNavigate) {
            onNavigate('new-project');
          } else {
            console.error('onNavigate is undefined!');
          }
        }}
        className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
      >
        ➕ Nouveau Projet (Test)
      </button>
      <div className="mt-8 p-4 bg-slate-800 rounded-lg">
        <p className="text-white">✅ Si vous voyez ce message, React fonctionne !</p>
        <p className="text-gray-400 mt-2">onNavigate est : {onNavigate ? 'défini ✓' : 'undefined ✗'}</p>
      </div>
    </div>
  );
};

export default Projects;