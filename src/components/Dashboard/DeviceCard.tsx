
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format, formatDistanceToNow } from "date-fns";
import { Device, SyncStatus } from "@/types/models";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useNavigate } from "react-router-dom";

interface DeviceCardProps {
  device: Device;
}

const DeviceCard: React.FC<DeviceCardProps> = ({ device }) => {
  const navigate = useNavigate();
  
  // Determine status for styling
  const getStatusColor = (status: SyncStatus) => {
    switch (status) {
      case SyncStatus.InSync:
        return "bg-success text-white";
      case SyncStatus.OutOfSync:
        return "bg-error text-white";
      case SyncStatus.Warning:
        return "bg-warning text-black";
      case SyncStatus.Unknown:
      default:
        return "bg-muted text-muted-foreground";
    }
  };
  
  const getStatusText = (status: SyncStatus) => {
    switch (status) {
      case SyncStatus.InSync:
        return "In Sync";
      case SyncStatus.OutOfSync:
        return "Out of Sync";
      case SyncStatus.Warning:
        return "Warning";
      case SyncStatus.Unknown:
      default:
        return "Unknown";
    }
  };

  // Format last sync time
  const formatSyncTime = (date: Date | null) => {
    if (!date) return "Never";
    return formatDistanceToNow(date, { addSuffix: true });
  };

  const handleCardClick = () => {
    navigate(`/device/${device.id}`);
  };

  return (
    <Card 
      className="hover:shadow-md transition-shadow cursor-pointer" 
      onClick={handleCardClick}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">{device.name}</CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge className={`${getStatusColor(device.syncStatus)}`}>
                  {getStatusText(device.syncStatus)}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>Sync status: {getStatusText(device.syncStatus)}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-sm space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">IP Address:</span>
            <span>{device.ipAddress}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Last Sync:</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span>{formatSyncTime(device.lastSyncTime)}</span>
                </TooltipTrigger>
                {device.lastSyncTime && (
                  <TooltipContent>
                    <p>{format(device.lastSyncTime, "PPP pp")}</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Model:</span>
            <span>{device.model}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Version:</span>
            <span>{device.version}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DeviceCard;
