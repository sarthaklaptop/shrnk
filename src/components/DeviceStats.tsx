import React, { useState, useMemo } from 'react';

// Filter icon SVG component
const FilterIcon = () => (
  <svg height="18" width="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" className="hidden h-4 w-4 sm:block">
    <g fill="currentColor">
      <path d="M8.095,7.778l7.314,2.51c.222,.076,.226,.388,.007,.47l-3.279,1.233c-.067,.025-.121,.079-.146,.146l-1.233,3.279c-.083,.219-.394,.215-.47-.007l-2.51-7.314c-.068-.197,.121-.385,.318-.318Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></path>
      <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" x1="12.031" x2="16.243" y1="12.031" y2="16.243"></line>
      <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" x1="7.75" x2="7.75" y1="1.75" y2="3.75"></line>
      <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" x1="11.993" x2="10.578" y1="3.507" y2="4.922"></line>
      <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" x1="3.507" x2="4.922" y1="11.993" y2="10.578"></line>
      <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" x1="1.75" x2="3.75" y1="7.75" y2="7.75"></line>
      <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" x1="3.507" x2="4.922" y1="3.507" y2="4.922"></line>
    </g>
  </svg>
);

// Desktop icon SVG
const DesktopIcon = () => (
  <svg height="18" width="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
    <g fill="currentColor">
      <path d="M12.476,15.535c-.887-.279-1.803-.445-2.726-.504v-1.781c0-.414-.336-.75-.75-.75s-.75,.336-.75,.75v1.781c-.923,.06-1.839,.225-2.726,.504-.395,.125-.614,.545-.489,.941,.124,.394,.541,.612,.94,.49,1.958-.617,4.087-.618,6.049,0,.075,.023,.151,.035,.226,.035,.319,0,.614-.205,.716-.525,.124-.395-.096-.816-.49-.94Z" fill="#212121"></path>
      <path d="M14.25,14H3.75c-1.517,0-2.75-1.233-2.75-2.75V4.75c0-1.517,1.233-2.75,2.75-2.75H14.25c1.517,0,2.75,1.233,2.75,2.75v6.5c0,1.517-1.233,2.75-2.75,2.75ZM3.75,3.5c-.689,0-1.25,.561-1.25,1.25v6.5c0,.689,.561,1.25,1.25,1.25H14.25c.689,0,1.25-.561,1.25-1.25V4.75c0-.689-.561-1.25-1.25-1.25H3.75Z" fill="#212121"></path>
    </g>
  </svg>
);

// Mobile icon SVG
const MobileIcon = () => (
  <svg height="18" width="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
    <g fill="currentColor">
      <rect height="14.5" width="10.5" fill="none" rx="2" ry="2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" x="3.75" y="1.75"></rect>
      <polyline fill="none" points="7.75 1.75 7.75 2.75 10.25 2.75 10.25 1.75" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></polyline>
      <circle cx="9" cy="13" fill="currentColor" r="1" stroke="none"></circle>
    </g>
  </svg>
);

export function DeviceStats({ stats }: any) {
  const [activeTab, setActiveTab] = useState<'devices' | 'browsers' | 'os'>('devices');

  // Calculate device data
  const deviceData = useMemo(() => {
    if (!stats?.clicks || !Array.isArray(stats.clicks)) return [];
    
    const deviceCount: Record<string, number> = {};
    stats.clicks.forEach((click: any) => {
      if (click.deviceType) {
        deviceCount[click.deviceType] = (deviceCount[click.deviceType] || 0) + 1;
      }
    });

    const total = Object.values(deviceCount).reduce((sum, count) => sum + count, 0);
    return Object.entries(deviceCount)
      .map(([device, count]) => ({
        name: device,
        count: count as number,
        percentage: ((count as number / total) * 100).toFixed(1),
      }))
      .sort((a, b) => b.count - a.count);
  }, [stats]);

  // Calculate browser data
  const browserData = useMemo(() => {
    if (!stats?.clicks || !Array.isArray(stats.clicks)) return [];
    
    const browserCount: Record<string, number> = {};
    stats.clicks.forEach((click: any) => {
      if (click.browser) {
        browserCount[click.browser] = (browserCount[click.browser] || 0) + 1;
      }
    });

    const total = Object.values(browserCount).reduce((sum, count) => sum + count, 0);
    return Object.entries(browserCount)
      .map(([browser, count]) => ({
        name: browser,
        count: count as number,
        percentage: ((count as number / total) * 100).toFixed(1),
      }))
      .sort((a, b) => b.count - a.count);
  }, [stats]);

  // Calculate OS data
  const osData = useMemo(() => {
    if (!stats?.clicks || !Array.isArray(stats.clicks)) return [];
    
    const osCount: Record<string, number> = {};
    stats.clicks.forEach((click: any) => {
      if (click.os) {
        osCount[click.os] = (osCount[click.os] || 0) + 1;
      }
    });

    const total = Object.values(osCount).reduce((sum, count) => sum + count, 0);
    return Object.entries(osCount)
      .map(([os, count]) => ({
        name: os,
        count: count as number,
        percentage: ((count as number / total) * 100).toFixed(1),
      }))
      .sort((a, b) => b.count - a.count);
  }, [stats]);

  const displayData = 
    activeTab === 'devices' ? deviceData :
    activeTab === 'browsers' ? browserData :
    activeTab === 'os' ? osData : [];

  const getDeviceIcon = (deviceName: string) => {
    const name = deviceName?.toLowerCase() || '';
    if (name.includes('desktop') || name.includes('pc')) {
      return <DesktopIcon />;
    } else if (name.includes('mobile') || name.includes('phone')) {
      return <MobileIcon />;
    }
    return <DesktopIcon />; // Default icon
  };

  const tabs = [
    { id: 'devices' as const, label: 'Devices' },
    { id: 'browsers' as const, label: 'Browsers' },
    { id: 'os' as const, label: 'OS' },
    // { id: 'triggers' as const, label: 'Triggers' },
  ];

  return (
    <div className="group relative z-0 h-[400px] overflow-hidden border border-neutral-200 bg-white sm:rounded-xl">
      <div className="flex items-center justify-between border-b border-neutral-200 px-4">
        <div className="flex text-sm">
          {tabs.map((tab) => (
            <div key={tab.id} className="relative">
              <button
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`p-4 transition-colors duration-75 ${
                  activeTab === tab.id
                    ? 'text-neutral-900 font-medium'
                    : 'text-neutral-500 hover:text-neutral-700'
                }`}
                data-selected={activeTab === tab.id}
              >
                {tab.label}
              </button>
              {activeTab === tab.id && (
                <div className="absolute bottom-0 w-full px-1.5" style={{ opacity: 1 }}>
                  <div className="h-0.5 rounded-t-full bg-current"></div>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-1 pr-2 text-neutral-500">
          <FilterIcon />
          <p className="text-xs uppercase">clicks</p>
        </div>
      </div>
      
      <div className="py-4">
        <div className="relative grid h-full auto-rows-min grid-cols-1">
          {displayData.length > 0 ? (
            displayData.map((item, index) => {
              const width = `${item.percentage}%`;
              
              return (
                <a
                  key={index}
                  className="block min-w-0 border-l-2 border-transparent px-4 py-1 transition-all hover:bg-gradient-to-r hover:from-red-50 hover:to-transparent hover:border-red-500"
                  href="#"
                >
                  <div className="relative flex items-center justify-between">
                    <div
                      className="-z-10 h-full origin-left rounded-md bg-red-100"
                      style={{ width, position: 'absolute', inset: '0px', transform: 'scaleX(1)' }}
                    ></div>
                    <div className="relative z-10 flex h-8 w-full min-w-0 max-w-[calc(100%-2rem)] items-center transition-[max-width] duration-300 ease-in-out group-hover:max-w-[calc(100%-5rem)]">
                      <div className="z-10 flex items-center space-x-4 overflow-hidden px-3">
                        {activeTab === 'devices' ? (
                          <div className="text-neutral-900">
                            {getDeviceIcon(item.name)}
                          </div>
                        ) : null}
                        <div className="truncate text-sm text-neutral-800">{item.name || 'Unknown'}</div>
                      </div>
                    </div>
                    <div className="z-10 flex items-center">
                      <span className="z-10 px-2 text-sm text-neutral-600 transition-transform duration-300 group-hover:-translate-x-14">
                        {item.count}
                      </span>
                      <div className="absolute right-0 px-3 text-sm text-neutral-600/70 transition-all duration-300 invisible translate-x-14 opacity-0 group-hover:visible group-hover:translate-x-0 group-hover:opacity-100">
                        {item.percentage}%
                      </div>
                    </div>
                  </div>
                </a>
              );
            })
          ) : (
            <div className="px-4 py-8 text-center text-sm text-neutral-500">
              No {activeTab} data available
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
