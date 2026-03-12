import { NAV_ITEMS } from '../../shared/constants/navigation';

export function MobileBottomNav({ activeTab, theme, darkMode, glassStyle, onTabChange }) {
  return (
    <nav className={`md:hidden fixed bottom-0 w-full flex justify-around px-1 py-3 pb-safe z-50 border-t overflow-x-auto scrollbar-hide ${glassStyle}`}>
      {NAV_ITEMS.map((item) => (
        <button
          key={item.id}
          onClick={() => onTabChange(item.id)}
          className={`flex flex-col items-center p-2 min-w-[64px] rounded-lg transition-colors ${activeTab === item.id ? theme.text : darkMode ? 'text-zinc-500' : 'text-stone-500'}`}
        >
          <item.icon className="w-6 h-6 mb-1" strokeWidth={1.5} />
          <span className="text-[9px] font-medium whitespace-nowrap">{item.label.split(' ')[0]}</span>
        </button>
      ))}
    </nav>
  );
}
