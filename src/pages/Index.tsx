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
      {/* Top header — фирменный стиль Россети */}
      <header className="rosseti-header-bg flex-shrink-0">
        <div className="relative z-10 flex items-center justify-between px-6 py-3.5">
          <div className="flex items-center gap-4">
            {/* Логотип Россети */}
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                {/* Официальный логотип Россети — солнце из лепестков */}
                <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Лепесток 1 — верх */}
                  <path d="M19 19 L16 4 Q19 1 22 4 Z" fill="white" fillOpacity="0.95"/>
                  {/* Лепесток 2 — верх-право */}
                  <path d="M19 19 L31.5 9.5 Q34.5 12 31.5 15 Z" fill="white" fillOpacity="0.85"/>
                  {/* Лепесток 3 — право */}
                  <path d="M19 19 L34 22 Q34 26 30 26 Z" fill="white" fillOpacity="0.75"/>
                  {/* Лепесток 4 — низ-право */}
                  <path d="M19 19 L28 32 Q24.5 35 22 32 Z" fill="white" fillOpacity="0.65"/>
                  {/* Лепесток 5 — низ */}
                  <path d="M19 19 L16 34 Q19 37 22 34 Z" fill="white" fillOpacity="0.55"/>
                  {/* Лепесток 6 — низ-лево */}
                  <path d="M19 19 L10 32 Q6.5 30 8.5 26.5 Z" fill="white" fillOpacity="0.65"/>
                  {/* Лепесток 7 — лево */}
                  <path d="M19 19 L4 22 Q4 18 8 16 Z" fill="white" fillOpacity="0.75"/>
                  {/* Лепесток 8 — верх-лево */}
                  <path d="M19 19 L6.5 9.5 Q9.5 6.5 13 9 Z" fill="white" fillOpacity="0.85"/>
                  {/* Центральный круг */}
                  <circle cx="19" cy="19" r="5" fill="white"/>
                </svg>
              </div>
              <div>
                <div className="font-corp-bold text-white text-[15px] tracking-[0.1em] uppercase leading-none">
                  Центр технического надзора
                </div>
                <div className="font-corp-light text-white/55 text-[10px] tracking-[0.2em] uppercase mt-0.5">
                  Надзорная деятельность
                </div>
              </div>
            </div>

            {/* Разделитель */}
            <div className="w-px h-8 bg-white/15 mx-1"></div>

            {/* Название модуля */}
            <div>
              <div className="font-corp-medium text-white text-[13px] tracking-[0.08em] uppercase">
                Планирование проверок
              </div>
            </div>
          </div>

          <div className="flex items-center gap-5">
            <div className="flex items-center gap-1.5 text-white/50 text-[11px] font-corp-light">
              <Icon name="Calendar" size={11} />
              <span className="font-mono-corp">29.04.2026</span>
            </div>
            <div className="flex items-center gap-1.5 text-white/50 text-[11px] font-corp-light">
              <Icon name="Database" size={11} />
              <span>{objectRecords.length} объектов в базе</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-white/50 text-[11px] font-corp-light">Данные актуальны</span>
            </div>
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="relative z-10 flex items-center gap-1.5 px-6 py-1.5 border-t border-white/8 bg-black/10">
          <span className="text-white/35 text-[10px] font-corp-light tracking-wider">Главная</span>
          <Icon name="ChevronRight" size={9} className="text-white/25" />
          <span className="text-white/35 text-[10px] font-corp-light tracking-wider">Контрольная деятельность</span>
          <Icon name="ChevronRight" size={9} className="text-white/25" />
          <span className="text-[hsl(var(--corp-accent))] text-[10px] font-corp-medium tracking-wider">Планирование проверок</span>
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
                <div className={`font-corp-medium text-sm tracking-wide ${s.highlight ? 'text-yellow-300' : s.accent ? 'text-[hsl(var(--corp-accent))]' : 'text-white'}`}>{s.value}</div>
                <div className="text-white/45 text-[10px] font-corp-light tracking-wider">{s.label}</div>
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