
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import DeviceCard from "./DeviceCard";
import DeviceList from "./DeviceList";
import { getDevices } from "@/services/mockDataService";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const Dashboard: React.FC = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Fetch devices data
  const { data: devices = [], isLoading, error } = useQuery({
    queryKey: ["devices"],
    queryFn: getDevices
  });
  
  // Filter devices based on search query
  const filteredDevices = devices.filter(device => 
    device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    device.ipAddress.includes(searchQuery)
  );

  return (
    <div className="container mx-auto py-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold">F5 Device Dashboard</h1>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search devices..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>
      
      <div className="mb-6">
        <Tabs defaultValue="grid" onValueChange={(value) => setViewMode(value as "grid" | "list")}>
          <TabsList>
            <TabsTrigger value="grid">Grid View</TabsTrigger>
            <TabsTrigger value="list">List View</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
            <p className="mt-4">Loading devices...</p>
          </div>
        </div>
      ) : error ? (
        <div className="text-center py-10">
          <p className="text-error">Error loading devices. Please try again.</p>
        </div>
      ) : filteredDevices.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No devices found matching your search.</p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDevices.map((device) => (
            <DeviceCard key={device.id} device={device} />
          ))}
        </div>
      ) : (
        <DeviceList devices={filteredDevices} />
      )}
    </div>
  );
};

export default Dashboard;
