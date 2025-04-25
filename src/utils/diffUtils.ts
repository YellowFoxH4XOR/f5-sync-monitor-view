import { DiffLine } from "@/types/models";

export const computeDiff = (leftText: string, rightText: string): DiffLine[] => {
  // This is a simplified diff algorithm for demonstration
  // In a real application, you'd use a more sophisticated algorithm or library like diff-match-patch
  
  const leftLines = leftText.split('\n');
  const rightLines = rightText.split('\n');
  
  const diffResult: DiffLine[] = [];
  
  // Find the maximum length between the two arrays
  const maxLength = Math.max(leftLines.length, rightLines.length);
  
  let leftLineNum = 1;
  let rightLineNum = 1;
  
  // Process each line
  for (let i = 0; i < maxLength; i++) {
    const leftLine = i < leftLines.length ? leftLines[i] : null;
    const rightLine = i < rightLines.length ? rightLines[i] : null;
    
    if (leftLine === rightLine) {
      // Unchanged line
      diffResult.push({
        type: 'unchanged',
        content: leftLine || '',
        lineNumber: {
          left: leftLineNum++,
          right: rightLineNum++
        }
      });
    } else {
      // Lines are different
      if (leftLine !== null) {
        // Line was removed or changed
        diffResult.push({
          type: 'removed',
          content: leftLine,
          lineNumber: {
            left: leftLineNum++,
            right: null
          }
        });
      }
      
      if (rightLine !== null) {
        // Line was added or changed
        diffResult.push({
          type: 'added',
          content: rightLine,
          lineNumber: {
            left: null,
            right: rightLineNum++
          }
        });
      }
    }
  }
  
  return diffResult;
};

// Helper function to get a summary of changes
export const getDiffSummary = (diffLines: DiffLine[]) => {
  const added = diffLines.filter(line => line.type === 'added').length;
  const removed = diffLines.filter(line => line.type === 'removed').length;
  const unchanged = diffLines.filter(line => line.type === 'unchanged').length;
  
  return {
    added,
    removed,
    unchanged,
    total: diffLines.length
  };
};

// Helper to find the next difference
export const findNextDiff = (diffLines: DiffLine[], currentIndex: number): number => {
  for (let i = currentIndex + 1; i < diffLines.length; i++) {
    if (diffLines[i].type !== 'unchanged') {
      return i;
    }
  }
  return -1; // No more diffs found
};

// Helper to find the previous difference
export const findPrevDiff = (diffLines: DiffLine[], currentIndex: number): number => {
  for (let i = currentIndex - 1; i >= 0; i--) {
    if (diffLines[i].type !== 'unchanged') {
      return i;
    }
  }
  return -1; // No more diffs found
};
