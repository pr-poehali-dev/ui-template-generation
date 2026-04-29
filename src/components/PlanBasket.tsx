import { useState } from 'react';
import Icon from '@/components/ui/icon';
import type { PlanItem } from '@/data/mockData';

interface PlanBasketProps {
  items: PlanItem[];
  onRemove: (id: string) => void;
}

const PRIORITY_CONFIG = {
  high: { label: 'Высокий', bg: 'bg-red-50 text-red-700 border-red-200', dot: 'bg-red-500' },
  medium: { label: 'Средний', bg: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
  low: { label: 'Низкий', bg: 'bg-slate-50 text-slate-500 border-slate-200', dot: 'bg-slate-400' },
};

const TYPE_ICON: Record<string, string> = {
  object: 'MapPin',
  complex: 'Layers',
  direction: 'Target',
};

export default function PlanBasket({ items, onRemove }: PlanBasketProps) {
  const [collapsed, setCollapsed] = useState(false);

  const handleExport = () => {
    const rows = [
      ['№', 'Объект/Подразделение', 'Приоритет', 'Обоснование', 'Длительность (р.д.)'],
      ...items.map((item, idx) => [
        String(idx + 1),
        item.subtitle ? `${item.title} (${item.subtitle})` : item.title,
        PRIORITY_CONFIG[item.priority].label,
        item.justification,
        item.duration ?? '?',
      ]),
    ];
    const csv = rows.map(r => r.map(c => `"${c}"`).join(';')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'plan_proverok.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="corp-shadow bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[hsl(var(--corp-navy))] border-b border-white/10">
        <div className="flex items-center gap-2">
          <Icon name="ShoppingCart" size={13} className="text-[hsl(var(--corp-accent))]" />
          <span className="text-[10px] font-semibold text-white uppercase tracking-widest">Итоговый план проверок</span>
          {items.length > 0 && (
            <span className="bg-[hsl(var(--corp-accent))] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-sm font-mono-corp">
              {items.length}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExport}
            disabled={items.length === 0}
            className="flex items-center gap-1.5 text-[10px] font-semibold text-[hsl(var(--corp-accent))] hover:text-white disabled:text-white/30 disabled:cursor-not-allowed transition-colors uppercase tracking-wider"
          >
            <Icon name="Download" size={11} />
            Экспорт .xlsx (Р7)
          </button>
          <button onClick={() => setCollapsed(c => !c)} className="text-white/60 hover:text-white transition-colors">
            <Icon name={collapsed ? 'ChevronDown' : 'ChevronUp'} size={14} />
          </button>
        </div>
      </div>

      {!collapsed && (
        <div>
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 gap-2">
              <Icon name="Inbox" size={28} className="text-[hsl(var(--corp-border))]" />
              <span className="text-xs text-[hsl(var(--corp-text-muted))] italic">
                Добавьте объекты или рекомендации в план
              </span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-[hsl(var(--muted))] border-b border-[hsl(var(--corp-border))]">
                    <th className="text-left px-3 py-2 text-[10px] font-semibold text-[hsl(var(--corp-text-muted))] uppercase tracking-wider w-8">#</th>
                    <th className="text-left px-3 py-2 text-[10px] font-semibold text-[hsl(var(--corp-text-muted))] uppercase tracking-wider">Объект / Подразделение</th>
                    <th className="text-left px-3 py-2 text-[10px] font-semibold text-[hsl(var(--corp-text-muted))] uppercase tracking-wider">Приоритет</th>
                    <th className="text-left px-3 py-2 text-[10px] font-semibold text-[hsl(var(--corp-text-muted))] uppercase tracking-wider">Обоснование</th>
                    <th className="text-center px-3 py-2 text-[10px] font-semibold text-[hsl(var(--corp-text-muted))] uppercase tracking-wider w-16">Дней</th>
                    <th className="w-8 px-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, idx) => {
                    const pc = PRIORITY_CONFIG[item.priority];
                    return (
                      <tr key={item.id} className="border-b border-[hsl(var(--corp-border))] hover:bg-[hsl(var(--muted))] transition-colors animate-fade-in">
                        <td className="px-3 py-2.5 text-xs font-mono-corp text-[hsl(var(--corp-text-muted))]">{idx + 1}</td>
                        <td className="px-3 py-2.5">
                          <div className="flex items-start gap-1.5">
                            <Icon name={TYPE_ICON[item.type]} size={11} className="text-[hsl(var(--corp-blue-mid))] mt-0.5 flex-shrink-0" />
                            <div>
                              <div className="text-xs font-medium text-[hsl(var(--corp-text))]">{item.title}</div>
                              {item.subtitle && <div className="text-[10px] text-[hsl(var(--corp-text-muted))]">{item.subtitle}</div>}
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-2.5">
                          <span className={`inline-flex items-center gap-1 text-[10px] font-semibold border px-1.5 py-0.5 ${pc.bg}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${pc.dot}`}></span>
                            {pc.label}
                          </span>
                        </td>
                        <td className="px-3 py-2.5 text-xs text-[hsl(var(--corp-text))] max-w-[220px]">{item.justification}</td>
                        <td className="px-3 py-2.5 text-center font-mono-corp text-xs text-[hsl(var(--corp-text-muted))]">
                          {item.duration ?? <span className="text-[hsl(var(--corp-text-muted))]">?</span>}
                        </td>
                        <td className="px-2 py-2.5 text-center">
                          <button
                            onClick={() => onRemove(item.id)}
                            className="text-[hsl(var(--corp-text-muted))] hover:text-[hsl(var(--corp-red))] transition-colors"
                          >
                            <Icon name="X" size={13} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
