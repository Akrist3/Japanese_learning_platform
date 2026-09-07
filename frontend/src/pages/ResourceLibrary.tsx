import React, { useEffect, useState } from 'react';
import { Library, ExternalLink, ShieldCheck } from 'lucide-react';
import api from '../services/api';
import { ResourceItem } from '../types';

export const ResourceLibrary: React.FC = () => {
  const [resources, setResources] = useState<ResourceItem[]>([]);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const res = await api.get('/resources/list');
      setResources(res.data);
    } catch (err) {
      console.error('Failed to load resources', err);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-1">
        <h1 className="text-3xl font-black text-white flex items-center gap-2">
          <Library className="w-7 h-7 text-indigo-400" />
          <span>Curated Open Japanese Resource Library</span>
        </h1>
        <p className="text-slate-400 text-sm">Every external reference is legitimate, open-licensed, accessible, and properly attributed.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {resources.map((item) => (
          <div key={item.id} className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4 shadow-lg flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <span className="text-[10px] uppercase font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/30 px-2.5 py-0.5 rounded-md">
                  {item.resource_type} • JLPT {item.jlpt_level}
                </span>
                <span className="text-[10px] font-semibold text-slate-500 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{item.license}</span>
                </span>
              </div>

              <h3 className="text-lg font-bold text-white">{item.name}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{item.description}</p>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-xs">
              <span className="text-slate-500 font-semibold">Source: {item.source}</span>

              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-rose-400 font-bold hover:underline"
              >
                <span>Visit Resource</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
