import React, { useState, useEffect } from 'react';
import { 
  Users, Mail, Award, BookOpen, GraduationCap, 
  Search, ChevronLeft, ChevronRight, CheckCircle 
} from 'lucide-react';
import { editorService } from '../services/editor.service';
import { useDBStore } from '../store/dbStore';
import { EditorProfile } from '../types';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Card, CardContent } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';

export const EditorialBoard = () => {
  const { db } = useDBStore();
  const [editors, setEditors] = useState<EditorProfile[]>([]);
  const [search, setSearch] = useState('');
  const [specialty, setSpecialty] = useState('');

  useEffect(() => {
    const fetchEditors = async () => {
      let list = await editorService.getEditors(search);
      if (specialty) {
        list = list.filter((e: EditorProfile) => e.specialties.includes(specialty));
      }
      setEditors(list);
    };
    fetchEditors();
  }, [search, specialty]);

  // Aggregate all unique specialties for the filter dropdown
  const allSpecialties = Array.from(
    new Set(db.editors.flatMap((e: EditorProfile) => e.specialties))
  ).sort();

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 flex flex-col gap-8 font-sans">
      
      {/* Title Header */}
      <div>
        <h1 className="font-serif text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">International Editorial Board</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Our international board of 100 distinguished editors shaping the peer-review pathways of science</p>
      </div>

      {/* Filter and search controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 dark:bg-slate-900/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
        <div className="md:col-span-2">
          <Input
            placeholder="Search editors by name, affiliation, or title..."
            value={search}
            onChange={(e: any) => setSearch(e.target.value)}
          />
        </div>
        <Select
          options={['', ...allSpecialties]}
          value={specialty}
          onChange={(e: any) => setSpecialty(e.target.value)}
        />
      </div>

      {/* Editors Grid list */}
      {editors.length === 0 ? (
        <div className="p-20 text-center flex flex-col items-center gap-3 border border-dashed border-slate-200 rounded-2xl bg-white dark:bg-slate-950 dark:border-slate-800">
          <Users className="h-12 w-12 text-slate-300" />
          <p className="text-sm font-bold text-slate-800 dark:text-white">No Editors Found</p>
          <p className="text-xs text-slate-400 max-w-xs">No board members matched your active search queries or specialty domains.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {editors.map((editor: EditorProfile) => {
            return (
              <Card key={editor.id} variant="default" className="hover:-translate-y-1 hover:shadow-md duration-200 flex flex-col justify-between">
                <CardContent className="p-6 flex gap-4">
                  <img
                    src={editor.avatar}
                    alt={editor.name}
                    className="h-14 w-14 rounded-full border border-slate-200 shadow-sm flex-shrink-0"
                  />
                  <div className="flex-grow min-w-0">
                    <h3 className="font-serif text-base font-bold text-slate-900 dark:text-white truncate">
                      {editor.name}
                    </h3>
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1 leading-normal">
                      {editor.affiliation}
                    </p>
                    
                    <div className="flex items-center gap-1.5 mt-2">
                      <Badge variant={editor.role === 'Editor-in-Chief' ? 'secondary' : 'primary'} className="text-[9px] uppercase tracking-wider font-bold">
                        {editor.role}
                      </Badge>
                      <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                        Journals: {editor.assignedJournals.length}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1 mt-3">
                      {editor.specialties.map((spec: string) => (
                        <Badge key={spec} variant="neutral" className="text-[9px] py-0">{spec}</Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
                
                <div className="px-6 py-3.5 bg-slate-50 dark:bg-slate-900/20 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1"><BookOpen className="h-3.5 w-3.5 text-slate-400" /> Active Peer reviews chair</span>
                  <span className="font-bold text-[#8B0000]">{editor.email}</span>
                </div>
              </Card>
            );
          })}
        </div>
      )}

    </div>
  );
};
