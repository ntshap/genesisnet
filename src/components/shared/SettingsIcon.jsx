import React from 'react';
import { Settings } from 'lucide-react';

const SettingsIcon = ({ onClick }) => (
	<button
		onClick={onClick}
		aria-label="Pengaturan Akun"
		className="flex items-center justify-center w-10 h-10 rounded-lg bg-pink-200 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-pink-300 transition-all"
		style={{ marginLeft: '2px' }}
	>
		<Settings size={20} className="text-black" />
	</button>
);

export default SettingsIcon;
