import { useState } from 'react';
import Icon from '@/components/ui/icon';
import type { ObjectRecord, PlanItem } from '@/data/mockData';

interface ObjectsTableProps {
  objects: ObjectRecord[];
  planItems: PlanItem[];
  onAddToPlan: (item: PlanItem) => void;
}

const PRIORITY_LABELS: Record<string, { label: string; color: string }> = {
  high: { label: 'высший', color: 'text-[hsl(var(--corp-red))]' },
  medium: { label: 'средний', color: 'text-[hsl(var(--corp-amber))]' },
  low: { label: 'низкий', color: 'text-[hsl(var(--corp-text-muted))]' },
};

export default function ObjectsTable({ objects, planItems, onAddToPlan }: ObjectsTableProps) {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const isInPlan = (id: number) => planItems.some(p => p.objectId === id);

  const handleAdd = (obj: ObjectRecord) => {
    if (isInPlan(obj.id)) return;
    onAddToPlan({
      id: `obj-${obj.id}`,
      objectId: obj.id,
      title: obj.name,
      priority: obj.priorityLevel,
      justification: `Рост ${obj.dynamicPct}%, ${obj.mainCause}`,
      duration: '3',
      type: 'object',
    });
  };

  return (
    <div className="corp-shadow bg-white">
      {/* Section header */}
      <div className="flex items-center justify-between px-4 py-2.5 rosseti-header-bg border-b border-white/10">
        <div className="flex items-center gap-2 relative z-10">
          <Icon name="ListOrdered" size={13} className="text-[hsl(var(--corp-accent))]" />
          <span className="font-corp-medium text-[10px] text-white uppercase tracking-[0.14em]">Приоритетный перечень объектов</span>
        </div>
        <span className="font-corp-light text-[10px] text-white/55 relative z-10">{objects.length} объектов</span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[hsl(var(--muted))] border-b border-[hsl(var(--corp-border))]">
              <th className="text-left px-3 py-2 text-[10px] font-semibold text-[hsl(var(--corp-text-muted))] uppercase tracking-wider w-8">#</th>
              <th className="text-left px-3 py-2 text-[10px] font-semibold text-[hsl(var(--corp-text-muted))] uppercase tracking-wider">Объект</th>
              <th className="text-center px-3 py-2 text-[10px] font-semibold text-[hsl(var(--corp-text-muted))] uppercase tracking-wider whitespace-nowrap">Откл. 24/25/26</th>
              <th className="text-center px-3 py-2 text-[10px] font-semibold text-[hsl(var(--corp-text-muted))] uppercase tracking-wider">Динамика</th>
              <th className="text-left px-3 py-2 text-[10px] font-semibold text-[hsl(var(--corp-text-muted))] uppercase tracking-wider">Осн. причина</th>
              <th className="text-center px-2 py-2 text-[10px] font-semibold text-[hsl(var(--corp-text-muted))] uppercase tracking-wider w-8">Ст.</th>
              <th className="w-16 px-2"></th>
            </tr>
          </thead>
          <tbody>
            {objects.map((obj, idx) => {
              const expanded = expandedId === obj.id;
              const inPlan = isInPlan(obj.id);
              const pr = PRIORITY_LABELS[obj.priorityLevel];

              return (
                <>
                  <tr
                    key={obj.id}
                    className={`border-b border-[hsl(var(--corp-border))] table-row-hover transition-colors ${expanded ? 'bg-[hsl(var(--corp-blue-light))]' : ''}`}
                    onClick={() => setExpandedId(expanded ? null : obj.id)}
                  >
                    <td className="px-3 py-2.5 text-xs font-mono-corp text-[hsl(var(--corp-text-muted))]">{idx + 1}</td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-1.5">
                        <Icon name={expanded ? 'ChevronDown' : 'ChevronRight'} size={11} className="text-[hsl(var(--corp-blue-mid))] flex-shrink-0" />
                        <div>
                          <div className="text-xs font-medium text-[hsl(var(--corp-text))]">{obj.name}</div>
                          <div className="text-[10px] text-[hsl(var(--corp-text-muted))]">{obj.branch}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      <span className="font-mono-corp text-xs text-[hsl(var(--corp-text-muted))]">{obj.outages.y2024}</span>
                      <span className="font-mono-corp text-xs text-[hsl(var(--corp-text-muted))]"> / </span>
                      <span className="font-mono-corp text-xs text-[hsl(var(--corp-text-muted))]">{obj.outages.y2025}</span>
                      <span className="font-mono-corp text-xs text-[hsl(var(--corp-text-muted))]"> / </span>
                      <span className="font-mono-corp text-xs font-semibold text-[hsl(var(--corp-text))]">{obj.outages.y2026}</span>
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Icon name="TrendingUp" size={11} className="text-[hsl(var(--corp-red))]" />
                        <span className="font-mono-corp text-xs font-semibold text-[hsl(var(--corp-red))]">
                          ↑{obj.dynamicPct}%
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-2.5">
                      <div>
                        <div className="text-xs text-[hsl(var(--corp-text))]">{obj.mainCause}</div>
                        <div className={`text-[10px] ${pr.color}`}>({pr.label})</div>
                      </div>
                    </td>
                    <td className="px-2 py-2.5 text-center">
                      <span className={`text-base ${obj.status === 'unchecked' ? '' : 'opacity-40'}`}>
                        {obj.status === 'unchecked' ? '❌' : '✅'}
                      </span>
                    </td>
                    <td className="px-2 py-2.5 text-center" onClick={e => e.stopPropagation()}>
                      <button
                        onClick={() => handleAdd(obj)}
                        disabled={inPlan}
                        className={`px-2 py-1 text-[10px] font-semibold uppercase tracking-wider transition-colors whitespace-nowrap ${inPlan ? 'bg-[hsl(var(--corp-blue))] text-white cursor-default' : 'border border-[hsl(var(--corp-blue))] text-[hsl(var(--corp-blue))] hover:bg-[hsl(var(--corp-blue))] hover:text-white bg-white'}`}
                      >
                        {inPlan ? '✓' : '+ план'}
                      </button>
                    </td>
                  </tr>

                  {/* Expanded row */}
                  {expanded && obj.details.length > 0 && (
                    <tr key={`detail-${obj.id}`} className="bg-[hsl(var(--corp-blue-light))] border-b border-[hsl(var(--corp-blue))/30]">
                      <td colSpan={7} className="px-4 py-3">
                        <div className="animate-fade-in">
                          <div className="text-[10px] font-semibold text-[hsl(var(--corp-blue))] uppercase tracking-widest mb-2 flex items-center gap-1.5">
                            <Icon name="History" size={10} />
                            История аварийности — {obj.name}
                          </div>
                          <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                              <thead>
                                <tr className="border-b border-[hsl(var(--corp-blue))/20]">
                                  <th className="text-left text-[10px] text-[hsl(var(--corp-text-muted))] font-medium py-1 pr-4">Дата</th>
                                  <th className="text-left text-[10px] text-[hsl(var(--corp-text-muted))] font-medium py-1 pr-4">Тип</th>
                                  <th className="text-left text-[10px] text-[hsl(var(--corp-text-muted))] font-medium py-1 pr-4">Причина</th>
                                  <th className="text-left text-[10px] text-[hsl(var(--corp-text-muted))] font-medium py-1 pr-4">Длительность</th>
                                  <th className="text-left text-[10px] text-[hsl(var(--corp-text-muted))] font-medium py-1">Мероприятие</th>
                                </tr>
                              </thead>
                              <tbody>
                                {obj.details.map((d, i) => (
                                  <tr key={i} className="border-b border-[hsl(var(--corp-blue))/10] last:border-0">
                                    <td className="py-1.5 pr-4 font-mono-corp text-[11px] text-[hsl(var(--corp-text))] whitespace-nowrap">{d.date}</td>
                                    <td className="py-1.5 pr-4 text-[11px] text-[hsl(var(--corp-text))] whitespace-nowrap">{d.type}</td>
                                    <td className="py-1.5 pr-4 text-[11px] text-[hsl(var(--corp-text))]">{d.cause}</td>
                                    <td className="py-1.5 pr-4 font-mono-corp text-[11px] text-[hsl(var(--corp-text-muted))] whitespace-nowrap">{d.duration}</td>
                                    <td className="py-1.5 text-[11px] text-[hsl(var(--corp-text-muted))]">{d.damage}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                  {expanded && obj.details.length === 0 && (
                    <tr key={`detail-empty-${obj.id}`} className="bg-[hsl(var(--corp-blue-light))] border-b border-[hsl(var(--corp-border))]">
                      <td colSpan={7} className="px-6 py-3 text-xs text-[hsl(var(--corp-text-muted))] italic">
                        История аварийности не найдена
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}