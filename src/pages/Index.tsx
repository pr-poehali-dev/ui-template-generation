import { useState, useMemo } from 'react';
import Icon from '@/components/ui/icon';
import FiltersPanel from '@/components/FiltersPanel';
import RecommendationsPanel from '@/components/RecommendationsPanel';
import ObjectsTable from '@/components/ObjectsTable';
import PlanBasket from '@/components/PlanBasket';
import { objectRecords, recommendations, branches, causeCategories, equipmentTypes } from '@/data/mockData';
import type { PlanItem } from '@/data/mockData';

const DEFAULT_FILTERS = {
  statusAll: false,
  statusUnchecked: true,
  statusChecked: false,
  voltage110: true,
  voltage35: true,
  voltage620: false,
  voltage04: false,
  branch: 'Все филиалы',
  dynamicGrowth: 15,
  causeCategory: 'Эксплуатация ВЛ 35 и выше',
  equipmentType: 'Все типы',
  dateFrom: '2024-01-01',
  dateTo: '2026-12-31',
};

export default function Index() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [topCount, setTopCount] = useState(10);
  const [planItems, setPlanItems] = useState<PlanItem[]>([]);

  const filteredObjects = useMemo(() => {
    return objectRecords
      .filter(obj => {
        if (!filters.statusAll) {
          if (filters.statusUnchecked && !filters.statusChecked && obj.status !== 'unchecked') return false;
          if (filters.statusChecked && !filters.statusUnchecked && obj.status !== 'checked') return false;
        }

        const voltageActive = [
          filters.voltage110 && '110',
          filters.voltage35 && '35',
          filters.voltage620 && '6-20',
          filters.voltage04 && '0.4',
        ].filter(Boolean);
        if (voltageActive.length > 0 && !voltageActive.includes(obj.voltageClass)) return false;

        if (filters.branch !== 'Все филиалы' && obj.branch !== filters.branch) return false;
        if (obj.dynamicPct < filters.dynamicGrowth) return false;
        if (filters.causeCategory !== 'Все причины' && obj.causeCategory !== filters.causeCategory) return false;
        if (filters.equipmentType !== 'Все типы' && !obj.name.startsWith(filters.equipmentType)) return false;

        return true;
      })
      .sort((a, b) => b.dynamicPct - a.dynamicPct)
      .slice(0, topCount);
  }, [filters, topCount]);

  const addToPlan = (item: PlanItem) => {
    setPlanItems(prev => {
      if (prev.some(p => p.id === item.id)) return prev;
      return [...prev, item];
    });
  };

  const removeFromPlan = (id: string) => {
    setPlanItems(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--background))] flex flex-col" style={{ height: '100vh' }}>
      {/* Top header */}
      <header className="bg-[hsl(var(--corp-navy))] flex-shrink-0">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 bg-[hsl(var(--corp-accent))] flex items-center justify-center flex-shrink-0">
                <Icon name="Zap" size={14} className="text-white" />
              </div>
              <div>
                <div className="text-white font-semibold text-sm tracking-wide">ПЛАНИРОВАНИЕ ПРОВЕРОК</div>
                <div className="text-white/40 text-[10px] uppercase tracking-widest">Система управления контрольной деятельностью</div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-1.5 text-white/50 text-[11px]">
              <Icon name="Calendar" size={11} />
              <span className="font-mono-corp">29.04.2026</span>
            </div>
            <div className="flex items-center gap-1.5 text-white/50 text-[11px]">
              <Icon name="Database" size={11} />
              <span>{objectRecords.length} объектов в базе</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-white/50 text-[11px]">Данные актуальны</span>
            </div>
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 px-6 py-1.5 border-t border-white/5 bg-white/5">
          <span className="text-white/40 text-[10px]">Главная</span>
          <Icon name="ChevronRight" size={9} className="text-white/30" />
          <span className="text-white/40 text-[10px]">Контрольная деятельность</span>
          <Icon name="ChevronRight" size={9} className="text-white/30" />
          <span className="text-[hsl(var(--corp-accent))] text-[10px] font-medium">Планирование проверок</span>
        </div>
      </header>

      {/* Stats strip */}
      <div className="bg-[hsl(var(--corp-blue))] border-b border-[hsl(var(--corp-blue-mid))] flex-shrink-0">
        <div className="flex items-center divide-x divide-white/10 px-6">
          {[
            { label: 'Всего объектов', value: objectRecords.length.toString(), icon: 'MapPin' },
            { label: 'Не проверено', value: objectRecords.filter(o => o.status === 'unchecked').length.toString(), icon: 'AlertCircle', highlight: true },
            { label: 'В плане', value: planItems.length.toString(), icon: 'ClipboardList', accent: true },
            { label: 'Высокий приоритет', value: objectRecords.filter(o => o.priorityLevel === 'high').length.toString(), icon: 'Flame' },
            { label: 'Средний рост откл.', value: Math.round(objectRecords.reduce((s, o) => s + o.dynamicPct, 0) / objectRecords.length) + '%', icon: 'TrendingUp' },
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-2.5 px-5 py-2">
              <Icon name={s.icon} size={13} className={s.highlight ? 'text-yellow-300' : s.accent ? 'text-[hsl(var(--corp-accent))]' : 'text-white/50'} />
              <div>
                <div className={`font-mono-corp text-sm font-semibold ${s.highlight ? 'text-yellow-300' : s.accent ? 'text-[hsl(var(--corp-accent))]' : 'text-white'}`}>{s.value}</div>
                <div className="text-white/50 text-[10px]">{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: filters */}
        <div className="flex-shrink-0 border-r border-[hsl(var(--corp-border))] overflow-y-auto" style={{ width: 240 }}>
          <FiltersPanel
            filters={filters}
            onChange={setFilters}
            branches={branches}
            causeCategories={causeCategories}
            equipmentTypes={equipmentTypes}
            topCount={topCount}
            onTopCountChange={setTopCount}
          />
        </div>

        {/* Center: main tables */}
        <div className="flex-1 flex flex-col overflow-y-auto p-4 gap-4 min-w-0">
          <ObjectsTable
            objects={filteredObjects}
            planItems={planItems}
            onAddToPlan={addToPlan}
          />
          <PlanBasket
            items={planItems}
            onRemove={removeFromPlan}
          />
        </div>

        {/* Right: recommendations */}
        <div className="flex-shrink-0 border-l border-[hsl(var(--corp-border))] overflow-y-auto p-3" style={{ width: 308 }}>
          <RecommendationsPanel
            recommendations={recommendations}
            planItems={planItems}
            onAddToPlan={addToPlan}
          />
        </div>
      </div>
    </div>
  );
}
