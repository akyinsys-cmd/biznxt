import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  Send, 
  FileEdit,
  ClipboardList
} from 'lucide-react';
import { db, auth } from '../../lib/firebase';
import { collection, addDoc, serverTimestamp, doc, updateDoc } from 'firebase/firestore';
import { triggerHapticFeedback } from '../../lib/vibration';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path
  };
  console.warn('Unable to sync feedback at this time.');
  throw new Error(JSON.stringify(errInfo));
}

interface ResearchFeedbackDialogProps {
  isOpen: boolean;
  onClose: () => void;
  ticketId: string;
  ticketNumber: string;
  qaLeadName: string;
  onSubmitSuccess: (statusChanged: boolean, nextStatus?: string) => void;
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

export default function ResearchFeedbackDialog({
  isOpen,
  onClose,
  ticketId,
  ticketNumber,
  qaLeadName,
  onSubmitSuccess,
  showToast
}: ResearchFeedbackDialogProps) {
  const [revisionNotes, setRevisionNotes] = useState('');
  const [changeRequests, setChangeRequests] = useState('');
  const [statusAction, setStatusAction] = useState('pending_revision');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    triggerHapticFeedback('light');
    
    if (!revisionNotes.trim()) {
      triggerHapticFeedback('warning');
      showToast('Revision notes cannot be empty.', 'error');
      return;
    }
    if (!changeRequests.trim()) {
      triggerHapticFeedback('warning');
      showToast('Please specify at least one change request.', 'error');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // 1. Store in revision_history sub-collection
      const qaCollectionPath = `research_tickets/${ticketId}/revision_history`;
      const qaData = {
        ticketId,
        ticketNumber,
        qaLeadId: auth.currentUser?.uid || 'anonymous',
        qaLeadName: qaLeadName || auth.currentUser?.displayName || 'QA Lead',
        revisionNotes: revisionNotes.trim(),
        changeRequests: changeRequests.trim(),
        status: statusAction,
        createdAt: serverTimestamp()
      };

      try {
        await addDoc(collection(db, qaCollectionPath), qaData);
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, qaCollectionPath);
      }

      // 2. Transition ticket status if revision status is selected
      let nextStatus = 'assigned'; // Default back to assigned for corrections
      let shouldUpdateStatus = false;

      if (statusAction === 'pending_revision') {
        nextStatus = 'research_started'; // Push back to Research Started for revisions
        shouldUpdateStatus = true;
      } else if (statusAction === 'major_overhaul') {
        nextStatus = 'assigned'; // Fully assign back to executive desk
        shouldUpdateStatus = true;
      }

      if (shouldUpdateStatus) {
        const ticketRef = doc(db, 'research_tickets', ticketId);
        try {
          await updateDoc(ticketRef, {
            status: nextStatus,
            updatedAt: serverTimestamp()
          });
        } catch (err) {
          handleFirestoreError(err, OperationType.WRITE, `research_tickets/${ticketId}`);
        }
      }

      // 3. Create a notification for the executive/client
      const notifPath = 'notifications';
      try {
        await addDoc(collection(db, notifPath), {
          userId: auth.currentUser?.uid || 'system',
          title: `QA Revision Requested for ${ticketNumber}`,
          message: `Dossier feedback submitted by ${qaLeadName || 'QA Lead'}. Revisions needed: ${revisionNotes.substring(0, 80)}...`,
          type: 'warning',
          read: false,
          createdAt: serverTimestamp()
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, notifPath);
      }

      triggerHapticFeedback('success');
      showToast('QA Feedback saved and ticket status updated successfully!', 'success');
      setRevisionNotes('');
      setChangeRequests('');
      onSubmitSuccess(shouldUpdateStatus, nextStatus);
      onClose();
    } catch (error: any) {
      console.error(error);
      showToast('An error occurred while submitting feedback.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity"
      id="research-feedback-dialog-overlay"
    >
      <div 
        className="bg-white rounded-3xl shadow-xl border border-slate-200 max-w-lg w-full overflow-hidden animate-fadeIn"
        id="research-feedback-dialog-content"
      >
        {/* Header */}
        <div className="bg-slate-950 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-pink-400" />
            <div>
              <h3 className="font-bold text-sm font-display">QA Revision Review Desk</h3>
              <p className="text-[10px] text-slate-400 font-mono">Ticket: {ticketNumber}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-white/10 rounded-2xl transition-colors text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 flex gap-3 text-xs text-amber-800">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold block">Reviewing as QA Auditor</span>
              <p className="leading-relaxed">
                Provide crystal clear and actionable critique on research quality, sources, and alignment with regulatory standards. Submitting this feedback logs notes under <strong>{qaLeadName}</strong> and pushes revisions to the specialist desk.
              </p>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">Revision Notes / Critiques</label>
            <textarea
              required
              rows={3}
              value={revisionNotes}
              onChange={(e) => setRevisionNotes(e.target.value)}
              placeholder="Critique specific findings (e.g. GST rates for metal crafts need updating, market size calculation seems inflated...)"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs focus:outline-none focus:ring-1 focus:ring-pink-500 resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">Actionable Change Requests</label>
            <textarea
              required
              rows={3}
              value={changeRequests}
              onChange={(e) => setChangeRequests(e.target.value)}
              placeholder="List exact steps to fix (e.g. 1. Re-calculate Capex table, 2. Verify and cite central sources...)"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs focus:outline-none focus:ring-1 focus:ring-pink-500 resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">Workflow Action State</label>
            <div className="grid grid-cols-2 gap-3">
              <label className={`border rounded-2xl p-3 flex flex-col justify-between cursor-pointer transition-all ${
                statusAction === 'pending_revision' 
                  ? 'border-pink-500 bg-pink-50/20 text-pink-900' 
                  : 'border-slate-200 hover:bg-slate-50 text-slate-600'
              }`}>
                <input 
                  type="radio" 
                  name="statusAction" 
                  value="pending_revision"
                  checked={statusAction === 'pending_revision'}
                  onChange={() => setStatusAction('pending_revision')}
                  className="sr-only"
                />
                <div className="flex items-center gap-1.5 font-bold text-xs">
                  <FileEdit className="w-3.5 h-3.5 shrink-0" />
                  <span>Request Revisions</span>
                </div>
                <span className="text-[10px] text-slate-500 mt-1">Pushes ticket back to 'Research Started' status.</span>
              </label>

              <label className={`border rounded-2xl p-3 flex flex-col justify-between cursor-pointer transition-all ${
                statusAction === 'major_overhaul' 
                  ? 'border-red-500 bg-red-50/20 text-red-900' 
                  : 'border-slate-200 hover:bg-slate-50 text-slate-600'
              }`}>
                <input 
                  type="radio" 
                  name="statusAction" 
                  value="major_overhaul"
                  checked={statusAction === 'major_overhaul'}
                  onChange={() => setStatusAction('major_overhaul')}
                  className="sr-only"
                />
                <div className="flex items-center gap-1.5 font-bold text-xs">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>Major Overhaul</span>
                </div>
                <span className="text-[10px] text-slate-500 mt-1">Full reassignment required. Reset to 'Assigned' status.</span>
              </label>
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-full text-xs font-semibold text-slate-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-pink-600 hover:bg-pink-700 disabled:bg-slate-300 text-white font-bold rounded-full text-xs flex items-center gap-1.5"
            >
              {isSubmitting ? (
                <span>Submitting...</span>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Commit QA Feedback</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
