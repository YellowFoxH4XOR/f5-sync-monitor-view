
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { getDeviceById, getConfigurationsForDevice } from "@/services/mockDataService";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";
import { SyncStatus } from "@/types/models";

const DeviceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Fetch device details
  const { data: device, isLoading: isLoadingDevice } = useQuery({
    queryKey: ["device", id],
    queryFn: () => getDeviceById(id!),
    enabled: !!id
  });
  
  // Fetch device configurations
  const { data: configurations = [], isLoading: isLoadingConfigs } = useQuery({
    queryKey: ["configurations", id],
    queryFn: () => getConfigurationsForDevice(id!),
    enabled: !!id
  });

  // Navigate back to dashboard
  const handleBack = () => {
    navigate("/");
  };
  
  // Navigate to config diff page with this device preselected
  const handleViewConfig = (timestamp: Date) => {
    navigate(`/config-diff?leftDevice=${id}&leftTimestamp=${timestamp.toISOString()}`);
  };
  
  // Determine status color
  const getStatusColor = (status?: SyncStatus) => {
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
  
  const getStatusText = (status?: SyncStatus) => {
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

  if (isLoadingDevice) {
    return (
      <div className="container mx-auto py-6 flex justify-center items-center h-64">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-4">Loading device details...</p>
        </div>
      </div>
    );
  }
  
  if (!device) {
    return (
      <div className="container mx-auto py-6">
        <Button variant="outline" onClick={handleBack} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
        <div className="text-center py-10">
          <p className="text-error">Device not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 animate-fade-in">
      <Button variant="outline" onClick={handleBack} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Dashboard
      </Button>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold">{device.name}</h1>
          <p className="text-muted-foreground">{device.ipAddress}</p>
        </div>
        
        <Badge className={`${getStatusColor(device.syncStatus)} px-3 py-1 text-base`}>
          {getStatusText(device.syncStatus)}
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Device Information</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-4">
              <div className="flex justify-between">
                <dt className="font-medium">Model</dt>
                <dd>{device.model}</dd>
              </div>
              <Separator />
              <div className="flex justify-between">
                <dt className="font-medium">Version</dt>
                <dd>{device.version}</dd>
              </div>
              <Separator />
              <div className="flex justify-between">
                <dt className="font-medium">IP Address</dt>
                <dd>{device.ipAddress}</dd>
              </div>
              <Separator />
              <div className="flex justify-between">
                <dt className="font-medium">Last Sync</dt>
                <dd>
                  {device.lastSyncTime 
                    ? format(device.lastSyncTime, "PPP p") 
                    : "Never"}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Sync Status</CardTitle>
            <CardDescription>
              Current synchronization status and last successful sync details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Current Status</span>
                <Badge className={getStatusColor(device.syncStatus)}>
                  {getStatusText(device.syncStatus)}
                </Badge>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="font-medium">Last Successful Sync</span>
                <span>
                  {device.lastSyncTime 
                    ? format(device.lastSyncTime, "PPP p") 
                    : "Never"}
                </span>
              </div>
              <Separator />
              <div className="flex justify-end">
                <Button onClick={() => navigate('/config-diff')}>
                  Compare Configurations
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <h2 className="text-2xl font-bold mb-4">Configuration History</h2>
      
      {isLoadingConfigs ? (
        <div className="flex justify-center items-center h-40">
          <div className="text-center">
            <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
            <p className="mt-2">Loading configurations...</p>
          </div>
        </div>
      ) : configurations.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No configuration history found.</p>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px]">Date</TableHead>
                <TableHead className="w-[180px]">Time</TableHead>
                <TableHead>Configuration ID</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {configurations.map((config) => (
                <TableRow key={config.id}>
                  <TableCell>{format(config.timestamp, 'PP')}</TableCell>
                  <TableCell>{format(config.timestamp, 'p')}</TableCell>
                  <TableCell className="font-mono text-xs">{config.id}</TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewConfig(config.timestamp)}
                    >
                      View/Compare
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default DeviceDetail;
