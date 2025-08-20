// src/pages/CollaborationPage.tsx

import React, { useState } from 'react';
import { Users, Share2, MessageSquare, Video, Calendar, File, Plus, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export default function CollaborationPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'team' | 'projects' | 'messages'>('team');

  const teamMembers = [
    { id: 1, name: 'Marie Dupont', role: 'Chef de projet', avatar: '👩', status: 'online', email: 'marie@example.com' },
    { id: 2, name: 'Jean Martin', role: 'Développeur', avatar: '👨', status: 'online', email: 'jean@example.com' },
    { id: 3, name: 'Sophie Bernard', role: 'Designer', avatar: '👩‍🎨', status: 'busy', email: 'sophie@example.com' },
    { id: 4, name: 'Pierre Leroy', role: 'Traducteur', avatar: '👨‍💼', status: 'offline', email: 'pierre@example.com' },
  ];

  const sharedProjects = [
    { id: 1, name: 'Documentation Technique', members: 4, files: 23, lastUpdate: '2h ago' },
    { id: 2, name: 'Marketing International', members: 6, files: 45, lastUpdate: '1d ago' },
    { id: 3, name: 'Formation Interne', members: 3, files: 12, lastUpdate: '3d ago' },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
          Collaboration
        </h1>
        <p className="text-gray-400">Travaillez en équipe sur vos projets de transcription et traduction</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-gray-700">
        <button
          onClick={() => setActiveTab('team')}
          className={`pb-3 px-4 transition-all ${
            activeTab === 'team'
              ? 'border-b-2 border-indigo-500 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Users className="w-5 h-5 inline mr-2" />
          Équipe
        </button>
        <button
          onClick={() => setActiveTab('projects')}
          className={`pb-3 px-4 transition-all ${
            activeTab === 'projects'
              ? 'border-b-2 border-indigo-500 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Share2 className="w-5 h-5 inline mr-2" />
          Projets partagés
        </button>
        <button
          onClick={() => setActiveTab('messages')}
          className={`pb-3 px-4 transition-all ${
            activeTab === 'messages'
              ? 'border-b-2 border-indigo-500 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <MessageSquare className="w-5 h-5 inline mr-2" />
          Messages
        </button>
      </div>

      {/* Contenu */}
      {activeTab === 'team' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            className="bg-gray-800 border-2 border-dashed border-gray-600 rounded-lg p-6 hover:border-indigo-500 transition-all"
          >
            <Plus className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-400">Inviter un membre</p>
          </motion.button>

          {teamMembers.map(member => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{member.avatar}</div>
                  <div>
                    <h3 className="font-semibold">{member.name}</h3>
                    <p className="text-sm text-gray-400">{member.role}</p>
                  </div>
                </div>
                <div className={`w-2 h-2 rounded-full ${
                  member.status === 'online' ? 'bg-green-500' :
                  member.status === 'busy' ? 'bg-amber-500' :
                  'bg-gray-500'
                }`} />
              </div>
              
              <p className="text-sm text-gray-500 mb-4">{member.email}</p>
              
              <div className="flex gap-2">
                <button className="flex-1 p-2 bg-gray-700 hover:bg-gray-600 rounded text-sm">
                  <MessageSquare className="w-4 h-4 inline mr-1" />
                  Message
                </button>
                <button className="flex-1 p-2 bg-indigo-600 hover:bg-indigo-700 rounded text-sm">
                  <Video className="w-4 h-4 inline mr-1" />
                  Appel
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {activeTab === 'projects' && (
        <div className="space-y-4">
          {sharedProjects.map(project => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-all"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-2">{project.name}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {project.members} membres
                    </span>
                    <span className="flex items-center gap-1">
                      <File className="w-4 h-4" />
                      {project.files} fichiers
                    </span>
                    <span>Mis à jour {project.lastUpdate}</span>
                  </div>
                </div>
                <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg">
                  Ouvrir
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {activeTab === 'messages' && (
        <div className="bg-gray-800 rounded-lg p-8 text-center">
          <MessageSquare className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Messagerie en développement</h3>
          <p className="text-gray-400">La fonctionnalité de messagerie sera bientôt disponible</p>
        </div>
      )}
    </div>
  );
}