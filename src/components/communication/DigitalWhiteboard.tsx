import React, { useRef, useState, useEffect } from 'react';
import { doc, onSnapshot, updateDoc, arrayUnion, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Eraser, Pen, StickyNote, Trash2, X } from 'lucide-react';

interface Point { x: number, y: number }
interface Line { id: string, points: Point[], color: string, brushRadius: number }
interface Sticky { id: string, text: string, x: number, y: number, color: string }

export function DigitalWhiteboard({ roomId, onClose }: { roomId: string, onClose: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lines, setLines] = useState<Line[]>([]);
  const [stickies, setStickies] = useState<Sticky[]>([]);
  const [currentLine, setCurrentLine] = useState<Point[]>([]);
  const [tool, setTool] = useState<'pen' | 'eraser' | 'sticky'>('pen');
  const [color, setColor] = useState('#3b82f6');
  
  useEffect(() => {
    if (!roomId) return;
    const ref = doc(db, 'whiteboards', roomId);
    // Ensure doc exists
    setDoc(ref, { createdAt: new Date().toISOString() }, { merge: true });
    
    const unsub = onSnapshot(ref, (snap) => {
      const data = snap.data();
      if (data) {
        setLines(data.lines || []);
        setStickies(data.stickies || []);
      }
    });
    return () => unsub();
  }, [roomId]);

  useEffect(() => {
    redraw();
  }, [lines, currentLine]);

  const redraw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const drawLine = (line: Point[], lcolor: string, radius: number) => {
      if (line.length < 2) return;
      ctx.beginPath();
      ctx.moveTo(line[0].x, line[0].y);
      for (let i = 1; i < line.length; i++) {
        ctx.lineTo(line[i].x, line[i].y);
      }
      ctx.strokeStyle = lcolor;
      ctx.lineWidth = radius;
      ctx.stroke();
    };

    lines.forEach(l => drawLine(l.points, l.color, l.brushRadius));
    if (currentLine.length > 0) {
      drawLine(currentLine, color, tool === 'eraser' ? 20 : 3);
    }
  };

  const getPos = (e: any) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const startDrawing = (e: any) => {
    if (tool === 'sticky') {
      const pos = getPos(e);
      const newSticky: Sticky = {
        id: Math.random().toString(36).substring(7),
        text: '',
        x: pos.x,
        y: pos.y,
        color: ['#fef08a', '#bbf7d0', '#bfdbfe', '#fbcfe8'][Math.floor(Math.random() * 4)]
      };
      const updatedStickies = [...stickies, newSticky];
      setStickies(updatedStickies);
      updateDoc(doc(db, 'whiteboards', roomId), { stickies: updatedStickies });
      return;
    }
    setIsDrawing(true);
    setCurrentLine([getPos(e)]);
  };

  const draw = (e: any) => {
    if (!isDrawing) return;
    setCurrentLine([...currentLine, getPos(e)]);
  };

  const endDrawing = async () => {
    if (!isDrawing || tool === 'sticky') return;
    setIsDrawing(false);
    
    const newLine: Line = {
      id: Math.random().toString(36).substring(7),
      points: currentLine,
      color: tool === 'eraser' ? '#ffffff' : color, // simple eraser is just white line
      brushRadius: tool === 'eraser' ? 20 : 3
    };
    
    setCurrentLine([]);
    
    const ref = doc(db, 'whiteboards', roomId);
    await updateDoc(ref, {
      lines: arrayUnion(newLine)
    });
  };
  
  const updateSticky = (id: string, text: string) => {
    const newS = stickies.map(s => s.id === id ? { ...s, text } : s);
    setStickies(newS);
    // Debounce this in a real app, doing it immediately for simplicity
    updateDoc(doc(db, 'whiteboards', roomId), { stickies: newS });
  };
  
  const deleteSticky = (id: string) => {
    const newS = stickies.filter(s => s.id !== id);
    setStickies(newS);
    updateDoc(doc(db, 'whiteboards', roomId), { stickies: newS });
  };
  
  const clearBoard = () => {
    if (confirm("Clear the entire board?")) {
      updateDoc(doc(db, 'whiteboards', roomId), { lines: [], stickies: [] });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/95 flex flex-col backdrop-blur-sm">
      <div className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-slate-900">
        <div className="flex items-center gap-4">
          <h2 className="text-white font-bold text-lg tracking-tight">Brainstorming Session</h2>
          <div className="h-6 w-px bg-white/10" />
          <div className="flex items-center gap-2 bg-slate-800 rounded-xl p-1">
            <button 
              onClick={() => setTool('pen')}
              className={`p-2 rounded-lg transition-colors ${tool === 'pen' ? 'bg-indigo-500 text-white' : 'text-slate-400 hover:text-white'}`}
            ><Pen size={18} /></button>
            <button 
              onClick={() => setTool('eraser')}
              className={`p-2 rounded-lg transition-colors ${tool === 'eraser' ? 'bg-indigo-500 text-white' : 'text-slate-400 hover:text-white'}`}
            ><Eraser size={18} /></button>
            <button 
              onClick={() => setTool('sticky')}
              className={`p-2 rounded-lg transition-colors ${tool === 'sticky' ? 'bg-indigo-500 text-white' : 'text-slate-400 hover:text-white'}`}
            ><StickyNote size={18} /></button>
          </div>
          
          <div className="flex items-center gap-2 ml-4">
            {['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#000000'].map(c => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={`w-6 h-6 rounded-full border-2 ${color === c ? 'border-white' : 'border-transparent'}`}
                style={{ backgroundColor: c === '#000000' ? '#ffffff' : c }}
              />
            ))}
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={clearBoard}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-slate-300 rounded-full hover:text-white hover:bg-slate-700 transition-colors text-sm font-bold"
          >
            <Trash2 size={16} />
            Clear
          </button>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-xl">
            <X size={20} />
          </button>
        </div>
      </div>
      
      <div className="flex-1 relative bg-slate-50 overflow-hidden cursor-crosshair">
        <canvas
          ref={canvasRef}
          width={2000}
          height={1500}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={endDrawing}
          onMouseLeave={endDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={endDrawing}
          className="absolute inset-0 bg-white"
        />
        
        {stickies.map(sticky => (
          <div 
            key={sticky.id}
            className="absolute shadow-xl p-3 w-48 h-48 group"
            style={{ left: sticky.x, top: sticky.y, backgroundColor: sticky.color }}
          >
            <button 
              onClick={() => deleteSticky(sticky.id)}
              className="absolute -top-2 -right-2 bg-slate-900 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            ><X size={12} /></button>
            <textarea
              value={sticky.text}
              onChange={(e) => updateSticky(sticky.id, e.target.value)}
              placeholder="Type note..."
              className="w-full h-full bg-transparent border-none outline-none resize-none text-slate-900 text-sm font-medium placeholder:text-slate-900/50"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
