
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import ConfigurationSelector from "./ConfigurationSelector";
import DiffViewer from "./DiffViewer";
import { computeDiff, getDiffSummary, findNextDiff, findPrevDiff } from "@/utils/diffUtils";
import { getConfigurationByDeviceAndTimestamp } from "@/services/mockDataService";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { ConfigSelectionState, DiffLine } from "@/types/models";

const ConfigDiff: React.FC = () => {
  // State for configuration selection
  const [configSelectionState, setConfigSelectionState] = useState<ConfigSelectionState>({
    leftDevice: null,
    leftTimestamp: null,
    rightDevice: null,
    rightTimestamp: null
  });
  
  // State for diff results
  const [diffLines, setDiffLines] = useState<DiffLine[]>([]);
  const [currentDiffIndex, setCurrentDiffIndex] = useState<number>(-1);
  
  // Track if comparison has been made
  const [hasCompared, setHasCompared] = useState(false);
  
  // Get left configuration
  const { data: leftConfig, isLoading: isLoadingLeftConfig } = useQuery({
    queryKey: ["configuration", configSelectionState.leftDevice, configSelectionState.leftTimestamp],
    queryFn: () => 
      configSelectionState.leftDevice && configSelectionState.leftTimestamp
        ? getConfigurationByDeviceAndTimestamp(
            configSelectionState.leftDevice,
            configSelectionState.leftTimestamp
          )
        : Promise.resolve(undefined),
    enabled: !!(configSelectionState.leftDevice && configSelectionState.leftTimestamp)
  });
  
  // Get right configuration
  const { data: rightConfig, isLoading: isLoadingRightConfig } = useQuery({
    queryKey: ["configuration", configSelectionState.rightDevice, configSelectionState.rightTimestamp],
    queryFn: () => 
      configSelectionState.rightDevice && configSelectionState.rightTimestamp
        ? getConfigurationByDeviceAndTimestamp(
            configSelectionState.rightDevice,
            configSelectionState.rightTimestamp
          )
        : Promise.resolve(undefined),
    enabled: !!(configSelectionState.rightDevice && configSelectionState.rightTimestamp)
  });
  
  // Handle left configuration selection
  const handleLeftConfigSelection = (deviceId: string, timestamp: Date) => {
    setConfigSelectionState(prev => ({
      ...prev,
      leftDevice: deviceId,
      leftTimestamp: timestamp
    }));
    setHasCompared(false);
  };
  
  // Handle right configuration selection
  const handleRightConfigSelection = (deviceId: string, timestamp: Date) => {
    setConfigSelectionState(prev => ({
      ...prev,
      rightDevice: deviceId,
      rightTimestamp: timestamp
    }));
    setHasCompared(false);
  };
  
  // Calculate diff when both configs are loaded and the compare button is clicked
  const handleCompare = () => {
    if (leftConfig && rightConfig) {
      const computedDiff = computeDiff(leftConfig.content, rightConfig.content);
      setDiffLines(computedDiff);
      setHasCompared(true);
      
      // Find the first difference
      const firstDiffIndex = computedDiff.findIndex(line => line.type !== 'unchanged');
      setCurrentDiffIndex(firstDiffIndex);
      
      // Show summary as toast
      const summary = getDiffSummary(computedDiff);
      toast.info(`Comparison complete: ${summary.added} additions, ${summary.removed} removals`);
    }
  };
  
  // Navigate to the next difference
  const goToNextDiff = () => {
    const nextIndex = findNextDiff(diffLines, currentDiffIndex);
    if (nextIndex !== -1) {
      setCurrentDiffIndex(nextIndex);
      // Scroll to the difference would be implemented here
    } else {
      toast.info("Reached the end of differences");
    }
  };
  
  // Navigate to the previous difference
  const goToPrevDiff = () => {
    const prevIndex = findPrevDiff(diffLines, currentDiffIndex);
    if (prevIndex !== -1) {
      setCurrentDiffIndex(prevIndex);
      // Scroll to the difference would be implemented here
    } else {
      toast.info("Reached the beginning of differences");
    }
  };
  
  // Determine if compare button should be enabled
  const isCompareEnabled = 
    !!configSelectionState.leftDevice && 
    !!configSelectionState.leftTimestamp &&
    !!configSelectionState.rightDevice && 
    !!configSelectionState.rightTimestamp;
  
  // Determine if navigation buttons should be enabled
  const isNavigationEnabled = hasCompared && diffLines.length > 0;

  return (
    <div className="container mx-auto py-6 animate-fade-in">
      <h1 className="text-3xl font-bold mb-6">Configuration Comparison</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardContent className="pt-6">
            <ConfigurationSelector
              side="left"
              onSelectConfiguration={handleLeftConfigSelection}
              selectedDeviceId={configSelectionState.leftDevice}
              selectedTimestamp={configSelectionState.leftTimestamp}
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <ConfigurationSelector
              side="right"
              onSelectConfiguration={handleRightConfigSelection}
              selectedDeviceId={configSelectionState.rightDevice}
              selectedTimestamp={configSelectionState.rightTimestamp}
            />
          </CardContent>
        </Card>
      </div>
      
      <div className="flex justify-center mb-6">
        <Button 
          onClick={handleCompare}
          disabled={!isCompareEnabled || isLoadingLeftConfig || isLoadingRightConfig}
          size="lg"
        >
          {isLoadingLeftConfig || isLoadingRightConfig 
            ? "Loading Configurations..." 
            : "Compare Configurations"}
        </Button>
      </div>
      
      {hasCompared && (
        <>
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-2">
              <Badge variant="secondary">
                {leftConfig?.deviceName} ({leftConfig?.timestamp.toLocaleDateString()})
              </Badge>
              <Badge variant="secondary">
                {rightConfig?.deviceName} ({rightConfig?.timestamp.toLocaleDateString()})
              </Badge>
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={goToPrevDiff}
                disabled={!isNavigationEnabled}
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon"
                onClick={goToNextDiff}
                disabled={!isNavigationEnabled}
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="border rounded-md p-4 mb-4 flex items-center justify-around bg-muted/50">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-green-500"></div>
              <span>Added</span>
            </div>
            <Separator orientation="vertical" className="h-6" />
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-red-500"></div>
              <span>Removed</span>
            </div>
            <Separator orientation="vertical" className="h-6" />
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-gray-300 dark:bg-gray-600"></div>
              <span>Unchanged</span>
            </div>
          </div>
          
          <DiffViewer diffLines={diffLines} />
        </>
      )}
    </div>
  );
};

export default ConfigDiff;
