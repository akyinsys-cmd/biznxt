const fs = require('fs');
let content = fs.readFileSync('src/pages/documents/DocumentCenter.tsx', 'utf8');

const top = `import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { downloadAsPDF } from '../../utils/pdfExport';
import { Search, FileText, FileSignature, Clock, Plus, Filter, LayoutGrid, Download, Edit, Settings, FolderLock, CheckCircle2, Trash2, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, onSnapshot, orderBy, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../context/AuthContext';
import { DocumentTemplate, GeneratedDocument } from '../../types/document';
import { format } from 'date-fns';
import { ScanDocumentModal } from '../../components/documents/ScanDocumentModal';

export default function DocumentCenter() {
  const navigate = useNavigate();
  const { user, role } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'templates' | 'my-documents'>('templates');
  const [templates, setTemplates] = useState<DocumentTemplate[]>([]);
  const [myDocs, setMyDocs] = useState<GeneratedDocument[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const isAdmin = (role as string) === "super_admin";
  
  const [loading, setLoading] = useState(true);
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    // Fetch Templates
    const tq = query(collection(db, 'document_templates'), where('isActive', '==', true));
    const unsubT = onSnapshot(tq, (snap) => {
      setTemplates(snap.docs.map(d => ({ id: d.id, ...d.data() } as DocumentTemplate)));
      setLoading(false);
    }, () => setLoading(false));

    if (!user) {
      setLoading(false);
      return;
    }
    
    // Fetch My Documents
    const dq = query(collection(db, 'document_orders'), where('userId', '==', user.uid), orderBy('updatedAt', 'desc'));
    const unsubD = onSnapshot(dq, (snap) => {
      setMyDocs(snap.docs.map(d => ({ id: d.id, ...d.data() } as GeneratedDocument)));
    }, () => setLoading(false));

    return () => { unsubT(); unsubD(); };
  }, [user]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-2xl animate-spin" />
          `;

content = top + content;
fs.writeFileSync('src/pages/documents/DocumentCenter.tsx', content);
