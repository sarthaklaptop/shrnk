import React, { useState, useMemo } from 'react';
import { CircleFlag } from 'react-circle-flags';
import { MdLocalAirport } from 'react-icons/md';

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

export function LocationStats({ stats }: any) {
  const [activeTab, setActiveTab] = useState<'countries' | 'cities'>('countries');

  // Calculate country data
  const countryData = useMemo(() => {
    if (!stats?.clicks || !Array.isArray(stats.clicks)) return [];
    
    const countryCount: Record<string, number> = {};
    stats.clicks.forEach((click: any) => {
      if (click.country) {
        countryCount[click.country] = (countryCount[click.country] || 0) + 1;
      }
    });

    const total = Object.values(countryCount).reduce((sum, count) => sum + count, 0);
    return Object.entries(countryCount)
      .map(([country, count]) => ({
        name: country,
        count: count as number,
        percentage: ((count as number / total) * 100).toFixed(1),
      }))
      .sort((a, b) => b.count - a.count);
  }, [stats]);

  // Calculate city data
  const cityData = useMemo(() => {
    if (!stats?.clicks || !Array.isArray(stats.clicks)) return [];
    
    const cityCount: Record<string, number> = {};
    stats.clicks.forEach((click: any) => {
      if (click.city) {
        cityCount[click.city] = (cityCount[click.city] || 0) + 1;
      }
    });

    const total = Object.values(cityCount).reduce((sum, count) => sum + count, 0);
    return Object.entries(cityCount)
      .map(([city, count]) => ({
        name: city,
        count: count as number,
        percentage: ((count as number / total) * 100).toFixed(1),
      }))
      .sort((a, b) => b.count - a.count);
  }, [stats]);

  const displayData = activeTab === 'countries' ? countryData : activeTab === 'cities' ? cityData : [];

  const tabs = [
    { id: 'countries' as const, label: 'Countries' },
    { id: 'cities' as const, label: 'Cities' },
    // { id: 'regions' as const, label: 'Regions' },
    // { id: 'continents' as const, label: 'Continents' },
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
              const isBlue = activeTab === 'countries';

              return (
                <a
                  key={index}
                  className={`block min-w-0 border-l-2 border-transparent px-4 py-1 transition-all hover:bg-gradient-to-r ${
                    isBlue
                      ? 'hover:from-red-50 hover:to-transparent hover:border-red-500'
                      : 'hover:from-red-50 hover:to-transparent hover:border-red-500'
                  }`}
                  href="#"
                >
                  <div className="relative flex items-center justify-between">
                    <div
                      className={`-z-10 h-full origin-left rounded-md ${
                        isBlue ? 'bg-red-100' : 'bg-red-100'
                      }`}
                      style={{ width, position: 'absolute', inset: '0px', transform: 'scaleX(1)' }}
                    ></div>
                    <div className="relative z-10 flex h-8 w-full min-w-0 max-w-[calc(100%-2rem)] items-center transition-[max-width] duration-300 ease-in-out group-hover:max-w-[calc(100%-5rem)]">
                      <div className="z-10 flex items-center space-x-4 overflow-hidden px-3">
                        {activeTab === 'countries' ? (
                          item.name && item.name.toLowerCase() !== 'local' && item.name.toLowerCase() !== 'unknown' ? (
                            <CircleFlag
                              countryCode={item.name.toLowerCase()}
                              height={16}
                              width={16}
                            />
                          ) : (
                            <MdLocalAirport className="h-4 w-4 text-neutral-600" />
                          )
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