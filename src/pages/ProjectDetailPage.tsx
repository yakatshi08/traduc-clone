import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Download, File } from 'lucide-react';
import toast from 'react-hot-toast';

const ProjectDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [projectName, setProjectName] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/projects-test')
      .then(res => res.json())
      .then(data => {
        const project = data.data?.find(p => p.id === id);
        if (project) setProjectName(project.name);
      });

    fetch(`http://localhost:5000/api/upload-test/project/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setDocuments(data.data || []);
      });
  }, [id]);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(`http://localhost:5000/api/upload-test/single/${id}`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Upload réussi !');
        window.location.reload();
      }
    } catch (err) {
      toast.error('Erreur upload');
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <button
        onClick={() => navigate('/projects')}
        className="flex items-center gap-2 text-gray-400 hover:text-white mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour
      </button>
      
      <h1 className="text-3xl font-bold text-white mb-8">
        {projectName || 'Projet'} ({documents.length} fichiers)
      </h1>

      <div className="bg-slate-800 rounded-lg p-6 mb-6">
        <input
          type="file"
          onChange={handleUpload}
          className="block w-full text-white"
        />
      </div>

      <div className="bg-slate-800 rounded-lg p-6">
        {documents.map(doc => (
          <div key={doc.id} className="flex justify-between p-3 mb-2 bg-slate-700 rounded">
            <span className="text-white">{doc.name}</span>
            <span className="text-gray-400">{doc.size} bytes</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectDetailPage;