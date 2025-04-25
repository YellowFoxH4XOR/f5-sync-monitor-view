
import React, { useEffect, useRef } from "react";
import { DiffLine } from "@/types/models";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface DiffViewerProps {
  diffLines: DiffLine[];
}

const DiffViewer: React.FC<DiffViewerProps> = ({ diffLines }) => {
  const leftScrollRef = useRef<HTMLDivElement>(null);
  const rightScrollRef = useRef<HTMLDivElement>(null);
  
  // Sync scroll between the two panels
  useEffect(() => {
    const leftScroll = leftScrollRef.current;
    const rightScroll = rightScrollRef.current;
    
    if (!leftScroll || !rightScroll) return;
    
    const handleLeftScroll = () => {
      if (rightScroll) {
        rightScroll.scrollTop = leftScroll.scrollTop;
      }
    };
    
    const handleRightScroll = () => {
      if (leftScroll) {
        leftScroll.scrollTop = rightScroll.scrollTop;
      }
    };
    
    leftScroll.addEventListener('scroll', handleLeftScroll);
    rightScroll.addEventListener('scroll', handleRightScroll);
    
    return () => {
      leftScroll.removeEventListener('scroll', handleLeftScroll);
      rightScroll.removeEventListener('scroll', handleRightScroll);
    };
  }, []);
  
  const getLineBackgroundColor = (type: DiffLine['type']) => {
    switch (type) {
      case 'added':
        return 'bg-green-100 dark:bg-green-950';
      case 'removed':
        return 'bg-red-100 dark:bg-red-950';
      default:
        return '';
    }
  };
  
  const getLineTextColor = (type: DiffLine['type']) => {
    switch (type) {
      case 'added':
        return 'text-green-800 dark:text-green-200';
      case 'removed':
        return 'text-red-800 dark:text-red-200';
      default:
        return '';
    }
  };
  
  const getLinePrefix = (type: DiffLine['type']) => {
    switch (type) {
      case 'added':
        return '+';
      case 'removed':
        return '-';
      default:
        return ' ';
    }
  };

  return (
    <div className="flex flex-1 border rounded-md overflow-hidden">
      {/* Left side */}
      <div className="flex-1 border-r" ref={leftScrollRef}>
        <ScrollArea className="h-[600px] w-full">
          <div className="p-0">
            {diffLines.map((line, idx) => (
              <div 
                key={`left-${idx}`}
                className={cn(
                  "font-mono text-sm flex",
                  line.type !== 'added' && getLineBackgroundColor(line.type),
                )}
              >
                {/* Line number */}
                <div className="w-[50px] text-right pr-2 text-muted-foreground border-r select-none">
                  {line.lineNumber.left !== null ? line.lineNumber.left : ''}
                </div>
                {/* Line content */}
                {line.type !== 'added' && (
                  <pre className={cn(
                    "pl-2 py-0.5 whitespace-pre-wrap break-all flex-1",
                    getLineTextColor(line.type)
                  )}>
                    {getLinePrefix(line.type)}{line.content}
                  </pre>
                )}
                {line.type === 'added' && (
                  <pre className="pl-2 py-0.5 whitespace-pre-wrap break-all flex-1 invisible">
                    {line.content}
                  </pre>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
      
      {/* Right side */}
      <div className="flex-1" ref={rightScrollRef}>
        <ScrollArea className="h-[600px] w-full">
          <div className="p-0">
            {diffLines.map((line, idx) => (
              <div 
                key={`right-${idx}`}
                className={cn(
                  "font-mono text-sm flex",
                  line.type !== 'removed' && getLineBackgroundColor(line.type),
                )}
              >
                {/* Line number */}
                <div className="w-[50px] text-right pr-2 text-muted-foreground border-r select-none">
                  {line.lineNumber.right !== null ? line.lineNumber.right : ''}
                </div>
                {/* Line content */}
                {line.type !== 'removed' && (
                  <pre className={cn(
                    "pl-2 py-0.5 whitespace-pre-wrap break-all flex-1",
                    getLineTextColor(line.type)
                  )}>
                    {getLinePrefix(line.type)}{line.content}
                  </pre>
                )}
                {line.type === 'removed' && (
                  <pre className="pl-2 py-0.5 whitespace-pre-wrap break-all flex-1 invisible">
                    {line.content}
                  </pre>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default DiffViewer;
