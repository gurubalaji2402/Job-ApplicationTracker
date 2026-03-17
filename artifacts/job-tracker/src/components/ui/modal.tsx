import { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function Modal({ isOpen, onClose, title, description, children, className }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm animate-backdrop-enter"
        onClick={onClose}
      />
      <div className={cn(
        "relative w-full max-w-lg bg-card rounded-2xl shadow-2xl border border-border overflow-hidden flex flex-col max-h-[90vh] animate-modal-enter",
        className
      )}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/50 bg-slate-50/50">
          <div>
            <h2 className="text-xl font-bold text-foreground font-display">{title}</h2>
            {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
