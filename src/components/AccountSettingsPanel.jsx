import React, { useState } from 'react';

const defaultSettings = {
  theme: 'light',
  accentColor: '#FFD600',
  language: 'id',
  notifications: true,
  avatar: '',
};

export default function AccountSettingsPanel({ settings, onChange }) {
  const [localSettings, setLocalSettings] = useState(settings || defaultSettings);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newSettings = {
      ...localSettings,
      [name]: type === 'checkbox' ? checked : value,
    };
    setLocalSettings(newSettings);
    if (onChange) onChange(newSettings);
  };

  return (
    <div className="bg-white border-2 border-black rounded-lg p-6 w-full max-w-md mx-auto shadow-md">
      <h2 className="font-bold text-lg mb-4">Setelan Akun & Kustomisasi Antarmuka</h2>
      <div className="mb-3">
        <label className="block font-medium mb-1">Tema</label>
        <select name="theme" value={localSettings.theme} onChange={handleChange} className="border rounded px-2 py-1 w-full">
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </div>
      <div className="mb-3">
        <label className="block font-medium mb-1">Warna Aksen</label>
        <input type="color" name="accentColor" value={localSettings.accentColor} onChange={handleChange} className="w-12 h-8 p-0 border-none" />
      </div>
      <div className="mb-3">
        <label className="block font-medium mb-1">Bahasa</label>
        <select name="language" value={localSettings.language} onChange={handleChange} className="border rounded px-2 py-1 w-full">
          <option value="id">Bahasa Indonesia</option>
          <option value="en">English</option>
        </select>
      </div>
      <div className="mb-3 flex items-center">
        <input type="checkbox" name="notifications" checked={localSettings.notifications} onChange={handleChange} className="mr-2" />
        <label className="font-medium">Aktifkan Notifikasi</label>
      </div>
      <div className="mb-3">
        <label className="block font-medium mb-1">Avatar</label>
        <input type="text" name="avatar" value={localSettings.avatar} onChange={handleChange} placeholder="URL gambar avatar" className="border rounded px-2 py-1 w-full" />
      </div>
      <button className="mt-4 px-4 py-2 bg-black text-yellow-300 rounded font-bold border-2 border-black hover:bg-yellow-300 hover:text-black transition">Simpan Setelan</button>
    </div>
  );
}
