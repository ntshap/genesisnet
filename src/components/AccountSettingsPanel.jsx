import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  User, 
  LogOut, 
  Settings, 
  Shield, 
  Bell, 
  Monitor, 
  Moon, 
  Sun, 
  Key
} from 'lucide-react';

const AccountSettingsPanel = ({ settings, onChange }) => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  
  // Handle logout
  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      logout();
      // Redirect to landing page or login page if needed
      window.location.href = '/';
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-black mb-6 text-center border-b-4 border-black pb-2">
        Account Settings Panel
      </h2>
      
      {/* Tabs */}
      <div className="flex mb-6 border-2 border-black rounded-lg overflow-hidden">
        <button
          className={`flex-1 py-2 font-bold text-sm ${activeTab === 'profile' 
            ? 'bg-purple-600 text-white' 
            : 'bg-white text-black hover:bg-gray-100'}`}
          onClick={() => setActiveTab('profile')}
        >
          <div className="flex items-center justify-center">
            <User size={16} className="mr-1" />
            Profile
          </div>
        </button>
        <button
          className={`flex-1 py-2 font-bold text-sm ${activeTab === 'preferences' 
            ? 'bg-purple-600 text-white' 
            : 'bg-white text-black hover:bg-gray-100'}`}
          onClick={() => setActiveTab('preferences')}
        >
          <div className="flex items-center justify-center">
            <Settings size={16} className="mr-1" />
            Preferences
          </div>
        </button>
        <button
          className={`flex-1 py-2 font-bold text-sm ${activeTab === 'security' 
            ? 'bg-purple-600 text-white' 
            : 'bg-white text-black hover:bg-gray-100'}`}
          onClick={() => setActiveTab('security')}
        >
          <div className="flex items-center justify-center">
            <Shield size={16} className="mr-1" />
            Security
          </div>
        </button>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'profile' && (
        <div className="space-y-6">
          {/* User profile info */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-24 h-24 bg-purple-600 text-white rounded-full flex items-center justify-center text-3xl font-bold border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
            </div>
            <h3 className="text-xl font-bold mt-3">{user?.username || 'Username'}</h3>
            <p className="text-gray-600">{user?.email || 'user@example.com'}</p>
            <p className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-bold mt-2">
              {user?.role || 'User'} Account
            </p>
          </div>
          
          {/* Profile details form */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold mb-1">Full Name</label>
              <input 
                type="text"
                className="w-full px-3 py-2 border-2 border-black rounded shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none"
                defaultValue={user?.fullName || ''}
                placeholder="Your full name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold mb-1">Email Address</label>
              <input 
                type="email"
                className="w-full px-3 py-2 border-2 border-black rounded shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none"
                defaultValue={user?.email || ''}
                placeholder="your.email@example.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold mb-1">Organization</label>
              <input 
                type="text"
                className="w-full px-3 py-2 border-2 border-black rounded shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none"
                defaultValue={user?.organization || ''}
                placeholder="Your organization"
              />
            </div>
          </div>
          
          <button className="w-full py-2 bg-yellow-400 text-black font-bold border-2 border-black rounded shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-1px] hover:shadow-[3px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
            Save Profile Changes
          </button>
        </div>
      )}

      {activeTab === 'preferences' && (
        <div className="space-y-6">
          <h3 className="font-bold text-lg border-b-2 border-gray-200 pb-2">Display Settings</h3>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Sun size={18} className="mr-2" />
              <span className="font-medium">Theme Mode</span>
            </div>
            <div className="flex items-center bg-gray-200 rounded-full p-1">
              <button className="bg-white text-black font-bold rounded-full px-3 py-1 shadow">Light</button>
              <button className="text-gray-600 px-3 py-1">Dark</button>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Bell size={18} className="mr-2" />
              <span className="font-medium">Notifications</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={settings?.notifications || true} className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Monitor size={18} className="mr-2" />
              <span className="font-medium">Live Updates</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={settings?.liveUpdates || true} className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>
          
          <h3 className="font-bold text-lg border-b-2 border-gray-200 pb-2 mt-6">Network Preferences</h3>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Default Data Source</label>
              <select className="w-full px-3 py-2 border-2 border-black rounded shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none">
                <option>ICP Mainnet</option>
                <option>Local Network</option>
                <option>Test Network</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Refresh Interval</label>
              <select className="w-full px-3 py-2 border-2 border-black rounded shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none">
                <option>5 seconds</option>
                <option>10 seconds</option>
                <option>30 seconds</option>
                <option>1 minute</option>
              </select>
            </div>
          </div>
          
          <button className="w-full py-2 bg-yellow-400 text-black font-bold border-2 border-black rounded shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-1px] hover:shadow-[3px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
            Save Preferences
          </button>
        </div>
      )}
      
      {activeTab === 'security' && (
        <div className="space-y-6">
          <h3 className="font-bold text-lg border-b-2 border-gray-200 pb-2">Security Settings</h3>
          
          <div>
            <h4 className="font-medium flex items-center mb-3">
              <Key size={16} className="mr-2" />
              Change Password
            </h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Current Password</label>
                <input 
                  type="password"
                  className="w-full px-3 py-2 border-2 border-black rounded shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none"
                  placeholder="Enter current password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">New Password</label>
                <input 
                  type="password"
                  className="w-full px-3 py-2 border-2 border-black rounded shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none"
                  placeholder="Enter new password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Confirm New Password</label>
                <input 
                  type="password"
                  className="w-full px-3 py-2 border-2 border-black rounded shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none"
                  placeholder="Confirm new password"
                />
              </div>
            </div>
            
            <button className="mt-4 w-full py-2 bg-yellow-400 text-black font-bold border-2 border-black rounded shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-1px] hover:shadow-[3px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
              Update Password
            </button>
          </div>
          
          <div className="pt-4 border-t-2 border-gray-200">
            <h4 className="font-medium mb-3">Session Management</h4>
            <p className="text-sm text-gray-600 mb-2">You're currently signed in on this device.</p>
            
            <div className="bg-gray-100 rounded p-3 mb-4 border border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Current Session</p>
                  <p className="text-xs text-gray-500">Started: {new Date().toLocaleString()}</p>
                </div>
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded">Active</span>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Logout button at bottom */}
      <div className="mt-8 pt-4 border-t-2 border-gray-200">
        <button 
          onClick={handleLogout}
          className="w-full py-3 bg-red-500 text-white font-bold border-2 border-black rounded shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-1px] hover:shadow-[3px_4px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center"
        >
          <LogOut size={18} className="mr-2" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default AccountSettingsPanel;
