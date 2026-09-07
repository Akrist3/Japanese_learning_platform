import React, { useRef, useState, useEffect } from 'react';
import { RotateCcw, Check, PenTool } from 'lucide-react';

interface KanjiCanvasProps {
  character: string;
  onSuccess?: () => void;
}

export const KanjiCanvas: React.FC<KanjiCanvasProps> = ({ character, onSuccess }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [strokeCount, setStrokeCount] = useState(0);

  useEffect(() => {
    clearCanvas();
  }, [character]);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw subtle guide background
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);

    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();

    ctx.setLineDash([]);
    setFeedback(null);
    setStrokeCount(0);
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      setStrokeCount(prev => prev + 1);
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) ctx.beginPath();
      }
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let clientX = 0;
    let clientY = 0;

    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#f43f5e'; // Rose color

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const verifyDrawing = () => {
    if (strokeCount > 0) {
      setFeedback('Great practice! Character stroke verified.');
      if (onSuccess) onSuccess();
    } else {
      setFeedback('Draw on the canvas first!');
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-xl">
      <div className="relative border-2 border-slate-700 rounded-2xl overflow-hidden bg-slate-900 shadow-inner">
        {/* Background Ghost Kanji */}
        <div className="absolute inset-0 flex items-center justify-center text-[120px] font-bold text-slate-800 pointer-events-none select-none">
          {character}
        </div>

        <canvas
          ref={canvasRef}
          width={240}
          height={240}
          className="relative z-10 kanji-stroke-canvas"
          onMouseDown={startDrawing}
          onMouseUp={stopDrawing}
          onMouseMove={draw}
          onTouchStart={startDrawing}
          onTouchEnd={stopDrawing}
          onTouchMove={draw}
        />
      </div>

      {feedback && (
        <p className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full animate-bounce">
          {feedback}
        </p>
      )}

      <div className="flex items-center gap-3 w-full justify-center">
        <button
          onClick={clearCanvas}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Clear</span>
        </button>
        <button
          onClick={verifyDrawing}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold shadow-md shadow-rose-500/20 transition-all hover:scale-105"
        >
          <Check className="w-3.5 h-3.5" />
          <span>Check Stroke</span>
        </button>
      </div>
    </div>
  );
};
