import React, { useState, useEffect } from 'react';
import { 
  Download, 
  FileCheck, 
  Eye, 
  Database, 
  Filter, 
  RefreshCw, 
  Copy, 
  Share2, 
  Calendar, 
  User, 
  Tag
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const DataCenter = ({ activeDownloads = [], completedDeliveries = [] }) => {
  const { user } = useAuth();
  const [downloadHistory, setDownloadHistory] = useState(() => {
    try {
      const saved = localStorage.getItem(`genesisnet-downloads-${user?.userId}`);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error loading download history:', error);
      return [];
    }
  });
  
  const [currentTab, setCurrentTab] = useState('all');
  const [selectedData, setSelectedData] = useState(null);
  const [selectedFormat, setSelectedFormat] = useState('json');
  const [searchTerm, setSearchTerm] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });

  // Merge active downloads and completed deliveries with download history
  const allData = [
    ...downloadHistory,
    ...completedDeliveries.filter(item => !downloadHistory.some(h => h.id === item.id)),
    ...activeDownloads.filter(item => !downloadHistory.some(h => h.id === item.id) && 
                                     !completedDeliveries.some(c => c.id === item.id))
  ];

  // Filter data based on tab and search term
  const filteredData = allData.filter(item => {
    const matchesSearch = searchTerm === '' || 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.provider?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.type?.toLowerCase().includes(searchTerm.toLowerCase());
      
    if (currentTab === 'all') return matchesSearch;
    if (currentTab === 'active') return item.status === 'downloading' && matchesSearch;
    if (currentTab === 'completed') return item.status === 'completed' && matchesSearch;
    return matchesSearch;
  });

  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    if (sortConfig.key === 'date') {
      const dateA = new Date(a.date || a.completedAt || Date.now());
      const dateB = new Date(b.date || b.completedAt || Date.now());
      return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
    }
    if (sortConfig.key === 'name') {
      return sortConfig.direction === 'asc' 
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    }
    if (sortConfig.key === 'size') {
      return sortConfig.direction === 'asc' 
        ? (a.size || 0) - (b.size || 0)
        : (b.size || 0) - (a.size || 0);
    }
    return 0;
  });

  // Handle downloading data
  const handleDownload = () => {
    if (!selectedData) return;
    
    setIsDownloading(true);
    
    // Simulate download delay
    setTimeout(() => {
      // Create a mock file download
      const dataStr = JSON.stringify(selectedData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${selectedData.name.replace(/\s+/g, '-').toLowerCase()}.${selectedFormat}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      // Update download history
      const updatedData = {
        ...selectedData,
        lastDownloaded: new Date().toISOString(),
        downloadCount: (selectedData.downloadCount || 0) + 1,
        status: 'completed'
      };
      
      const existingIndex = downloadHistory.findIndex(item => item.id === selectedData.id);
      let newHistory;
      
      if (existingIndex >= 0) {
        newHistory = [
          ...downloadHistory.slice(0, existingIndex),
          updatedData,
          ...downloadHistory.slice(existingIndex + 1)
        ];
      } else {
        newHistory = [...downloadHistory, updatedData];
      }
      
      setDownloadHistory(newHistory);
      localStorage.setItem(`genesisnet-downloads-${user?.userId}`, JSON.stringify(newHistory));
      
      setIsDownloading(false);
      setSelectedData(updatedData);
    }, 1500);
  };

  // Handle sort changes
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Format file size for display
  const formatFileSize = (bytes) => {
    if (!bytes) return 'Unknown';
    if (bytes < 1024) return bytes + ' bytes';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="data-center bg-white border-4 border-black rounded-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] h-full flex flex-col">
      {/* Header */}
      <div className="bg-purple-200 border-b-4 border-black p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Database className="w-6 h-6 mr-2" />
            <h2 className="text-xl font-black">Data Center</h2>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search data..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-2 pr-8 border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <Filter className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b-4 border-black p-2 bg-gray-100">
        <div className="flex space-x-2">
          <button
            onClick={() => setCurrentTab('all')}
            className={`px-4 py-2 rounded-lg border-2 border-black font-bold text-sm ${
              currentTab === 'all' 
                ? 'bg-yellow-300 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' 
                : 'bg-white hover:bg-yellow-100'
            }`}
          >
            All Data
          </button>
          <button
            onClick={() => setCurrentTab('active')}
            className={`px-4 py-2 rounded-lg border-2 border-black font-bold text-sm ${
              currentTab === 'active' 
                ? 'bg-yellow-300 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' 
                : 'bg-white hover:bg-yellow-100'
            }`}
          >
            Active Downloads
          </button>
          <button
            onClick={() => setCurrentTab('completed')}
            className={`px-4 py-2 rounded-lg border-2 border-black font-bold text-sm ${
              currentTab === 'completed' 
                ? 'bg-yellow-300 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' 
                : 'bg-white hover:bg-yellow-100'
            }`}
          >
            Completed
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-grow overflow-hidden">
        {/* Data list */}
        <div className="w-2/3 overflow-auto border-r-4 border-black p-4">
          {sortedData.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-6">
              <Database className="w-12 h-12 mb-2 text-gray-400" />
              <h3 className="text-lg font-bold mb-1">No Data Available</h3>
              <p className="text-gray-600">
                Your downloaded data will appear here. Start by searching and downloading data from the marketplace.
              </p>
            </div>
          ) : (
            <div>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-black">
                    <th 
                      className="px-4 py-2 text-left cursor-pointer hover:bg-gray-100"
                      onClick={() => requestSort('name')}
                    >
                      Name {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </th>
                    <th className="px-4 py-2 text-left">Type</th>
                    <th 
                      className="px-4 py-2 text-left cursor-pointer hover:bg-gray-100"
                      onClick={() => requestSort('date')}
                    >
                      Date {sortConfig.key === 'date' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </th>
                    <th 
                      className="px-4 py-2 text-left cursor-pointer hover:bg-gray-100"
                      onClick={() => requestSort('size')}
                    >
                      Size {sortConfig.key === 'size' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </th>
                    <th className="px-4 py-2 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedData.map((item) => (
                    <tr 
                      key={item.id} 
                      className={`border-b border-gray-200 hover:bg-yellow-50 cursor-pointer ${
                        selectedData?.id === item.id ? 'bg-yellow-100' : ''
                      }`}
                      onClick={() => setSelectedData(item)}
                    >
                      <td className="px-4 py-3 font-bold">{item.name}</td>
                      <td className="px-4 py-3">{item.type || 'Unknown'}</td>
                      <td className="px-4 py-3">{formatDate(item.date || item.completedAt)}</td>
                      <td className="px-4 py-3">{formatFileSize(item.size)}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          item.status === 'completed' 
                            ? 'bg-green-100 text-green-800' 
                            : item.status === 'downloading' 
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                        }`}>
                          {item.status === 'completed' ? (
                            <>
                              <FileCheck className="w-3 h-3 mr-1" />
                              Completed
                            </>
                          ) : item.status === 'downloading' ? (
                            <>
                              <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                              Downloading
                            </>
                          ) : (
                            'Ready'
                          )}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Data details and download options */}
        <div className="w-1/3 p-4 overflow-auto">
          {selectedData ? (
            <div className="space-y-4">
              <div className="bg-gray-100 border-2 border-black rounded-lg p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                <h3 className="text-lg font-black mb-2">{selectedData.name}</h3>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-start">
                    <Tag className="w-4 h-4 mr-2 mt-1" />
                    <div>
                      <p className="text-xs font-bold text-gray-500">Data Type</p>
                      <p className="font-medium">{selectedData.type || 'Unknown'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <User className="w-4 h-4 mr-2 mt-1" />
                    <div>
                      <p className="text-xs font-bold text-gray-500">Provider</p>
                      <p className="font-medium">{selectedData.provider || 'Unknown'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Calendar className="w-4 h-4 mr-2 mt-1" />
                    <div>
                      <p className="text-xs font-bold text-gray-500">Acquired</p>
                      <p className="font-medium">{formatDate(selectedData.date || selectedData.completedAt)}</p>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-bold mb-1">Description</h4>
                  <p className="text-sm">{selectedData.description || 'No description available.'}</p>
                </div>

                {selectedData.preview && (
                  <div className="mb-4">
                    <h4 className="font-bold mb-1">Preview</h4>
                    <div className="bg-white border border-gray-300 rounded p-2 h-24 overflow-y-auto">
                      <pre className="text-xs">{selectedData.preview}</pre>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-gray-100 border-2 border-black rounded-lg p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                <h4 className="font-bold mb-3">Download Options</h4>
                
                <div className="mb-3">
                  <label className="text-sm font-bold mb-1 block">Format</label>
                  <div className="flex space-x-2">
                    {['json', 'csv', 'xml', 'txt'].map(format => (
                      <button
                        key={format}
                        className={`px-3 py-1 border-2 border-black rounded-lg text-sm font-bold ${
                          selectedFormat === format 
                            ? 'bg-purple-300 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' 
                            : 'bg-white'
                        }`}
                        onClick={() => setSelectedFormat(format)}
                      >
                        {format.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
                
                <button
                  className="w-full flex items-center justify-center px-4 py-2 bg-yellow-300 border-2 border-black rounded-lg text-black font-bold shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  onClick={handleDownload}
                  disabled={isDownloading || selectedData.status === 'downloading'}
                >
                  {isDownloading ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Downloading...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-2" />
                      Download {selectedFormat.toUpperCase()}
                    </>
                  )}
                </button>
                
                <div className="flex space-x-2 mt-2">
                  <button
                    className="flex-1 flex items-center justify-center px-2 py-1 bg-white border-2 border-black rounded-lg text-sm font-bold hover:bg-gray-100"
                    onClick={() => {
                      navigator.clipboard.writeText(selectedData.id);
                    }}
                  >
                    <Copy className="w-3 h-3 mr-1" />
                    Copy ID
                  </button>
                  <button
                    className="flex-1 flex items-center justify-center px-2 py-1 bg-white border-2 border-black rounded-lg text-sm font-bold hover:bg-gray-100"
                  >
                    <Share2 className="w-3 h-3 mr-1" />
                    Share
                  </button>
                  <button
                    className="flex-1 flex items-center justify-center px-2 py-1 bg-white border-2 border-black rounded-lg text-sm font-bold hover:bg-gray-100"
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    View
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <FileCheck className="w-10 h-10 mb-2 text-gray-400" />
              <h3 className="text-lg font-bold mb-1">No Data Selected</h3>
              <p className="text-gray-600">
                Select a data file from the list to view details and download options.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataCenter;
