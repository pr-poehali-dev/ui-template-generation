import { useState } from 'react';
import Icon from '@/components/ui/icon';

interface FiltersPanelProps {
  filters: {
    statusAll: boolean;
    statusUnchecked: boolean;
    statusChecked: boolean;
    voltage110: boolean;
    voltage35: boolean;
    voltage620: boolean;
    voltage04: boolean;
    branch: string;
    dynamicGrowth: number;
    causeCategory: string;
    equipmentType: string;
    dateFrom: string;
    dateTo: string;
  };
  onChange: (filters: FiltersPanelProps['filters']) => void;
  branches: string[];
  causeCategories: string[];
  equipmentTypes: string[];
  topCount: number;
  onTopCountChange: (n: number) => void;
}

export default function FiltersPanel({ filters, onChange, branches, causeCategories, equipmentTypes, topCount, onTopCountChange }: FiltersPanelProps) {
  const [collapsed, setCollapsed] = useState(false);

  const update = (key: string, value: unknown) => {
    onChange({ ...filters, [key]: value });
  };

  const SectionLabel = ({ children }: { children: React.ReactNode }) => (
    <div className="text-[10px] font-semibold uppercase tracking-widest text-[hsl(var(--corp-text-muted))] mb-2 mt-4 first:mt-0">
      {children}
    </div>
  );

  const CheckRow = ({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) => (
    <label className="flex items-center gap-2 cursor-pointer group py-0.5">
      <div
        onClick={() => onChange(!checked)}
        className={`w-3.5 h-3.5 border flex-shrink-0 flex items-center justify-center transition-colors ${checked ? 'bg-[hsl(var(--corp-blue))] border-[hsl(var(--corp-blue))]' : 'border-[hsl(var(--corp-border))] bg-white'}`}
      >
        {checked && <Icon name="Check" size={9} className="text-white" />}
      </div>
      <span className="text-xs text-[hsl(var(--corp-text))] group-hover:text-[hsl(var(--corp-blue))] transition-colors">{label}</span>
    </label>
  );

  return (
    <div className="bg-white corp-shadow flex flex-col" style={{ minWidth: 220, maxWidth: 240 }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[hsl(var(--corp-border))] rosseti-header-bg">
        <span className="font-corp-medium text-[11px] text-white uppercase tracking-[0.15em] relative z-10">Фильтры</span>
        <button onClick={() => setCollapsed(c => !c)} className="text-white/60 hover:text-white transition-colors">
          <Icon name={collapsed ? 'ChevronDown' : 'ChevronUp'} size={14} />
        </button>
      </div>

      {!collapsed && (
        <div className="px-4 py-4 flex flex-col gap-0.5 overflow-y-auto flex-1">
          {/* Top count */}
          <SectionLabel>Показать Топ</SectionLabel>
          <div className="flex gap-1.5 flex-wrap">
            {[5, 10, 20, 50].map(n => (
              <button
                key={n}
                onClick={() => onTopCountChange(n)}
                className={`px-2.5 py-0.5 text-xs border transition-colors ${topCount === n ? 'bg-[hsl(var(--corp-blue))] text-white border-[hsl(var(--corp-blue))]' : 'bg-white text-[hsl(var(--corp-text))] border-[hsl(var(--corp-border))] hover:border-[hsl(var(--corp-blue))]'}`}
              >
                {n}
              </button>
            ))}
          </div>

          {/* Status */}
          <SectionLabel>Статус проверки</SectionLabel>
          <CheckRow label="Все" checked={filters.statusAll} onChange={v => update('statusAll', v)} />
          <CheckRow label="Не проверен" checked={filters.statusUnchecked} onChange={v => update('statusUnchecked', v)} />
          <CheckRow label="Проверен" checked={filters.statusChecked} onChange={v => update('statusChecked', v)} />

          {/* Voltage */}
          <SectionLabel>Класс напряжения</SectionLabel>
          <CheckRow label="110 кВ" checked={filters.voltage110} onChange={v => update('voltage110', v)} />
          <CheckRow label="35 кВ" checked={filters.voltage35} onChange={v => update('voltage35', v)} />
          <CheckRow label="6–20 кВ" checked={filters.voltage620} onChange={v => update('voltage620', v)} />
          <CheckRow label="0,4 кВ" checked={filters.voltage04} onChange={v => update('voltage04', v)} />

          {/* Branch */}
          <SectionLabel>Подразделение</SectionLabel>
          <div className="relative">
            <select
              value={filters.branch}
              onChange={e => update('branch', e.target.value)}
              className="w-full text-xs border border-[hsl(var(--corp-border))] bg-white text-[hsl(var(--corp-text))] px-2.5 py-1.5 pr-6 appearance-none focus:outline-none focus:border-[hsl(var(--corp-blue))] transition-colors"
            >
              {branches.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
            <Icon name="ChevronDown" size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-[hsl(var(--corp-text-muted))] pointer-events-none" />
          </div>

          {/* Dynamics */}
          <SectionLabel>Динамика аварийности</SectionLabel>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[hsl(var(--corp-text-muted))] whitespace-nowrap">Рост более:</span>
            <input
              type="number"
              min={0}
              max={500}
              value={filters.dynamicGrowth}
              onChange={e => update('dynamicGrowth', Number(e.target.value))}
              className="w-14 text-xs border border-[hsl(var(--corp-border))] bg-white text-[hsl(var(--corp-text))] px-2 py-1 focus:outline-none focus:border-[hsl(var(--corp-blue))] transition-colors font-mono-corp"
            />
            <span className="text-xs text-[hsl(var(--corp-text-muted))]">%</span>
          </div>

          {/* Cause */}
          <SectionLabel>Причина аварийности</SectionLabel>
          <div className="relative mb-2">
            <select
              value={filters.causeCategory}
              onChange={e => update('causeCategory', e.target.value)}
              className="w-full text-xs border border-[hsl(var(--corp-border))] bg-white text-[hsl(var(--corp-text))] px-2.5 py-1.5 pr-6 appearance-none focus:outline-none focus:border-[hsl(var(--corp-blue))] transition-colors"
            >
              {causeCategories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <Icon name="ChevronDown" size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-[hsl(var(--corp-text-muted))] pointer-events-none" />
          </div>
          <CheckRow label="Эксплуатация ВЛ 35 и выше" checked={filters.causeCategory === 'Эксплуатация ВЛ 35 и выше'} onChange={v => update('causeCategory', v ? 'Эксплуатация ВЛ 35 и выше' : 'Все причины')} />
          <CheckRow label="Природные" checked={filters.causeCategory === 'Природные'} onChange={v => update('causeCategory', v ? 'Природные' : 'Все причины')} />

          {/* Equipment type */}
          <SectionLabel>Тип оборудования</SectionLabel>
          <div className="relative">
            <select
              value={filters.equipmentType}
              onChange={e => update('equipmentType', e.target.value)}
              className="w-full text-xs border border-[hsl(var(--corp-border))] bg-white text-[hsl(var(--corp-text))] px-2.5 py-1.5 pr-6 appearance-none focus:outline-none focus:border-[hsl(var(--corp-blue))] transition-colors"
            >
              {equipmentTypes.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <Icon name="ChevronDown" size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-[hsl(var(--corp-text-muted))] pointer-events-none" />
          </div>

          {/* Date range */}
          <SectionLabel>Диапазон дат</SectionLabel>
          <div className="flex flex-col gap-1.5">
            <input
              type="date"
              value={filters.dateFrom}
              onChange={e => update('dateFrom', e.target.value)}
              className="w-full text-xs border border-[hsl(var(--corp-border))] bg-white text-[hsl(var(--corp-text))] px-2.5 py-1 focus:outline-none focus:border-[hsl(var(--corp-blue))] transition-colors font-mono-corp"
            />
            <input
              type="date"
              value={filters.dateTo}
              onChange={e => update('dateTo', e.target.value)}
              className="w-full text-xs border border-[hsl(var(--corp-border))] bg-white text-[hsl(var(--corp-text))] px-2.5 py-1 focus:outline-none focus:border-[hsl(var(--corp-blue))] transition-colors font-mono-corp"
            />
          </div>

          {/* Apply */}
          <button className="mt-5 w-full py-2 bg-[hsl(var(--corp-blue))] hover:bg-[hsl(var(--corp-navy))] text-white text-xs font-semibold uppercase tracking-wider transition-colors">
            Применить фильтры
          </button>
        </div>
      )}
    </div>
  );
}