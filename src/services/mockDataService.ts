
import { Device, SyncStatus, Configuration } from '../types/models';

// Mock devices data
const mockDevices: Device[] = [
  {
    id: '1',
    name: 'F5-LTM-PROD-01',
    ipAddress: '192.168.1.10',
    lastSyncTime: new Date(Date.now() - 3600000), // 1 hour ago
    syncStatus: SyncStatus.InSync,
    model: 'BIG-IP 12000',
    version: '15.1.4'
  },
  {
    id: '2',
    name: 'F5-LTM-PROD-02',
    ipAddress: '192.168.1.11',
    lastSyncTime: new Date(Date.now() - 7200000), // 2 hours ago
    syncStatus: SyncStatus.InSync,
    model: 'BIG-IP 12000',
    version: '15.1.4'
  },
  {
    id: '3',
    name: 'F5-LTM-DR-01',
    ipAddress: '192.168.2.10',
    lastSyncTime: new Date(Date.now() - 86400000), // 24 hours ago
    syncStatus: SyncStatus.OutOfSync,
    model: 'BIG-IP 8000',
    version: '15.1.3'
  },
  {
    id: '4',
    name: 'F5-LTM-DEV-01',
    ipAddress: '192.168.3.10',
    lastSyncTime: new Date(Date.now() - 172800000), // 48 hours ago
    syncStatus: SyncStatus.Warning,
    model: 'BIG-IP 8000',
    version: '15.0.1'
  },
  {
    id: '5',
    name: 'F5-LTM-QA-01',
    ipAddress: '192.168.4.10',
    lastSyncTime: null, 
    syncStatus: SyncStatus.Unknown,
    model: 'BIG-IP 5000',
    version: '14.1.4'
  },
  {
    id: '6',
    name: 'F5-GTM-PROD-01',
    ipAddress: '192.168.1.20',
    lastSyncTime: new Date(Date.now() - 3600000 * 3), // 3 hours ago
    syncStatus: SyncStatus.InSync,
    model: 'BIG-IP 12000',
    version: '15.1.4'
  }
];

// Mock configurations
const generateMockConfig = (deviceId: string, timestamp: Date): Configuration => {
  const baseConfig = `ltm virtual vs_app_http {
    destination 10.10.10.10:80
    ip-protocol tcp
    mask 255.255.255.255
    pool pool_app_http
    profiles {
        http { }
        tcp { }
    }
    source 0.0.0.0/0
    translate-address enabled
    translate-port enabled
}

ltm pool pool_app_http {
    members {
        10.20.10.10:80 {
            address 10.20.10.10
            session monitor-enabled
            state up
        }
        10.20.10.11:80 {
            address 10.20.10.11
            session monitor-enabled
            state up
        }
    }
    monitor http
}`;

  // Add some variations based on device ID and timestamp
  const variations = [
    `ltm monitor http /Common/http {
        adaptive disabled
        defaults-from /Common/http
        destination *:*
        interval 5
        ip-dscp 0
        recv "HTTP/1.1 200"
        recv-disable none
        send "GET / HTTP/1.1\\r\\nHost: www.example.com\\r\\nConnection: Close\\r\\n\\r\\n"
        time-until-up 0
        timeout 16
    }`,
    `ltm profile tcp /Common/tcp {
        abc enabled
        ack-on-push enabled
        app-service none
        close-wait-timeout 5
        congestion-control woodside
        deferred-accept disabled
        delay-window-control disabled
        delayed-acks enabled
        delay-window-control disabled
        fin-wait-timeout 5
        idle-timeout ${Math.floor(Math.random() * 3600)}
        init-cwnd 16
        init-rwnd 16
        ip-tos-to-client 0
        keep-alive-interval 1800
        limited-transmit enabled
        link-qos-to-client 0
    }`
  ];

  // Add a random variation based on device ID to make configs different
  const configWithVariation = baseConfig + 
    (parseInt(deviceId) % 2 === 0 ? variations[0] : variations[1]);

  return {
    id: `config-${deviceId}-${timestamp.getTime()}`,
    deviceId,
    deviceName: mockDevices.find(d => d.id === deviceId)?.name || 'Unknown Device',
    timestamp,
    content: configWithVariation
  };
};

// Generate several configurations per device with different timestamps
const mockConfigurations: Configuration[] = [];
mockDevices.forEach(device => {
  // Current config
  mockConfigurations.push(generateMockConfig(device.id, new Date()));
  
  // Yesterday's config
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  mockConfigurations.push(generateMockConfig(device.id, yesterday));
  
  // Last week's config
  const lastWeek = new Date();
  lastWeek.setDate(lastWeek.getDate() - 7);
  mockConfigurations.push(generateMockConfig(device.id, lastWeek));
});

export const getDevices = (): Promise<Device[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...mockDevices]);
    }, 500);
  });
};

export const getDeviceById = (id: string): Promise<Device | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockDevices.find(device => device.id === id));
    }, 300);
  });
};

export const getConfigurationsForDevice = (deviceId: string): Promise<Configuration[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockConfigurations.filter(config => config.deviceId === deviceId));
    }, 500);
  });
};

export const getConfigurationById = (id: string): Promise<Configuration | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockConfigurations.find(config => config.id === id));
    }, 300);
  });
};

export const getConfigurationByDeviceAndTimestamp = (
  deviceId: string, 
  timestamp: Date
): Promise<Configuration | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Find configuration closest to the requested timestamp
      const deviceConfigs = mockConfigurations.filter(config => config.deviceId === deviceId);
      if (deviceConfigs.length === 0) {
        resolve(undefined);
        return;
      }
      
      let closestConfig = deviceConfigs[0];
      let smallestDiff = Math.abs(timestamp.getTime() - closestConfig.timestamp.getTime());
      
      for (const config of deviceConfigs) {
        const diff = Math.abs(timestamp.getTime() - config.timestamp.getTime());
        if (diff < smallestDiff) {
          smallestDiff = diff;
          closestConfig = config;
        }
      }
      
      resolve(closestConfig);
    }, 400);
  });
};
