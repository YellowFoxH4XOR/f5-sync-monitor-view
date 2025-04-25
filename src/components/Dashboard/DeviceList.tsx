
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format, formatDistanceToNow } from "date-fns";
import { Device, SyncStatus } from "@/types/models";
import { useNavigate } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface DeviceListProps {
  devices: Device[];
}

const DeviceList: React.FC<DeviceListProps> = ({ devices }) => {
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

  const handleRowClick = (deviceId: string) => {
    navigate(`/device/${deviceId}`);
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Name</TableHead>
            <TableHead>IP Address</TableHead>
            <TableHead>Last Sync</TableHead>
            <TableHead>Model</TableHead>
            <TableHead>Version</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {devices.map((device) => (
            <TableRow 
              key={device.id} 
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => handleRowClick(device.id)}
            >
              <TableCell className="font-medium">{device.name}</TableCell>
              <TableCell>{device.ipAddress}</TableCell>
              <TableCell>
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
              </TableCell>
              <TableCell>{device.model}</TableCell>
              <TableCell>{device.version}</TableCell>
              <TableCell>
                <Badge className={getStatusColor(device.syncStatus)}>
                  {getStatusText(device.syncStatus)}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DeviceList;
