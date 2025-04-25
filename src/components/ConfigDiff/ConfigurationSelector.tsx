
import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { getDevices, getConfigurationsForDevice } from "@/services/mockDataService";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Device, Configuration } from "@/types/models";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";

interface ConfigurationSelectorProps {
  side: "left" | "right";
  onSelectConfiguration: (deviceId: string, timestamp: Date) => void;
  selectedDeviceId: string | null;
  selectedTimestamp: Date | null;
}

const ConfigurationSelector: React.FC<ConfigurationSelectorProps> = ({
  side,
  onSelectConfiguration,
  selectedDeviceId,
  selectedTimestamp
}) => {
  const [availableConfigurations, setAvailableConfigurations] = useState<Configuration[]>([]);
  
  // Fetch all devices
  const { data: devices = [] } = useQuery({
    queryKey: ["devices"],
    queryFn: getDevices
  });
  
  // Fetch configurations for selected device
  const { data: configurations = [], isLoading: isLoadingConfigurations } = useQuery({
    queryKey: ["configurations", selectedDeviceId],
    queryFn: () => selectedDeviceId ? getConfigurationsForDevice(selectedDeviceId) : Promise.resolve([]),
    enabled: !!selectedDeviceId
  });
  
  // Update available configurations when query results change
  useEffect(() => {
    if (configurations.length > 0) {
      setAvailableConfigurations(configurations);
    }
  }, [configurations]);
  
  // Handle device selection
  const handleDeviceChange = (deviceId: string) => {
    // If device changes, reset the timestamp
    onSelectConfiguration(deviceId, null as unknown as Date);
  };
  
  // Handle timestamp selection
  const handleTimestampChange = (date: Date) => {
    if (selectedDeviceId) {
      onSelectConfiguration(selectedDeviceId, date);
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      <h3 className="text-lg font-semibold">{side === "left" ? "Left" : "Right"} Configuration</h3>
      
      <div className="space-y-2">
        <label className="text-sm text-muted-foreground">Device</label>
        <Select
          value={selectedDeviceId || ""}
          onValueChange={handleDeviceChange}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a device" />
          </SelectTrigger>
          <SelectContent className="max-h-[300px]">
            {devices.map((device) => (
              <SelectItem key={device.id} value={device.id}>
                {device.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm text-muted-foreground">Configuration Date</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !selectedTimestamp && "text-muted-foreground"
              )}
              disabled={!selectedDeviceId || isLoadingConfigurations}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedTimestamp ? (
                format(selectedTimestamp, "PPP")
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedTimestamp || undefined}
              onSelect={(date) => date && handleTimestampChange(date)}
              disabled={(date) => {
                // Only enable dates that have configurations
                if (!availableConfigurations.length) return true;
                
                return !availableConfigurations.some(config => {
                  const configDate = new Date(config.timestamp);
                  return (
                    configDate.getDate() === date.getDate() &&
                    configDate.getMonth() === date.getMonth() &&
                    configDate.getFullYear() === date.getFullYear()
                  );
                });
              }}
              initialFocus
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default ConfigurationSelector;
