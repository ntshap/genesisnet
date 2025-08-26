import React from 'react';
import { Download, FileCheck, Database, BarChart } from 'lucide-react';

const DataCenter = ({ dataDeliveries = [], activeDownloads = [] }) => {
  return (
    <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-lg overflow-hidden">
      <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
        <div className="flex items-center">
          <Database className="mr-2 h-5 w-5 text-indigo-600" />
          <h2 className="text-lg font-bold">Data Center</h2>
        </div>
        <div>
          <span className="text-xs font-bold bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">
            {dataDeliveries.length} datasets
          </span>
        </div>
      </div>

      <div className="p-4">
        {/* Active Downloads */}
        {activeDownloads.length > 0 && (
          <div className="mb-6">
            <h3 className="text-md font-bold mb-3 flex items-center">
              <Download className="h-4 w-4 mr-2 text-indigo-600" />
              Active Downloads
            </h3>
            <div className="space-y-3">
              {activeDownloads.map((download, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-sm">{download.name}</span>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                      {download.progress}% complete
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${download.progress}%` }}
                    ></div>
                  </div>
                  <div className="mt-2 flex justify-between text-xs text-gray-500">
                    <span>{download.size}</span>
                    <span>Est. time: {download.remainingTime}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Available Datasets */}
        <div>
          <h3 className="text-md font-bold mb-3 flex items-center">
            <FileCheck className="h-4 w-4 mr-2 text-green-600" />
            Available Datasets
          </h3>
          
          {dataDeliveries.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dataDeliveries.map((data, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold">{data.name}</span>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                      {data.type}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mb-2">
                    Provider: {data.provider}
                  </div>
                  <div className="text-xs text-gray-500 mb-3">
                    Size: {data.size} • Added: {data.date}
                  </div>
                  <div className="flex space-x-2">
                    <button className="flex-1 py-1 px-3 bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-bold rounded border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all duration-200">
                      View
                    </button>
                    <button className="flex-1 py-1 px-3 bg-white hover:bg-gray-50 text-gray-800 text-xs font-bold rounded border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all duration-200">
                      Export
                    </button>
                    <button className="w-8 py-1 px-1 bg-white hover:bg-gray-50 text-gray-800 text-xs font-bold rounded border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all duration-200">
                      <BarChart className="h-4 w-4 mx-auto" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <Database className="h-12 w-12 mx-auto text-gray-400 mb-2" />
              <h3 className="text-lg font-bold text-gray-500">No datasets available</h3>
              <p className="text-sm text-gray-500 mt-1 mb-4">
                Use the control panel to search for and download data
              </p>
              <button className="py-2 px-4 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-bold rounded-md border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all">
                Search for Data
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataCenter;
