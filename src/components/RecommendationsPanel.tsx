import Icon from '@/components/ui/icon';
import type { Recommendation, PlanItem, Priority } from '@/data/mockData';

interface RecommendationsPanelProps {
  recommendations: Recommendation[];
  planItems: PlanItem[];
  onAddToPlan: (item: PlanItem) => void;
}

export default function RecommendationsPanel({ recommendations, planItems, onAddToPlan }: RecommendationsPanelProps) {
  const complex = recommendations.filter(r => r.type === 'complex');
  const direction = recommendations.filter(r => r.type === 'direction');

  const isInPlan = (id: string) => planItems.some(p => p.id === id);

  const handleAdd = (rec: Recommendation) => {
    if (isInPlan(rec.id)) return;
    const item: PlanItem = {
      id: rec.id,
      title: rec.title,
      subtitle: rec.subtitle,
      priority: rec.count >= 4 ? 'high' : 'medium' as Priority,
      justification: rec.type === 'complex'
        ? `Комплексная: рост авар. ${rec.growthRange}`
        : `Повтор ${rec.count} объектов`,
      duration: rec.duration,
      type: rec.type === 'complex' ? 'complex' : 'direction',
    };
    onAddToPlan(item);
  };

  const RecCard = ({ rec }: { rec: Recommendation }) => {
    const added = isInPlan(rec.id);
    return (
      <div className={`border transition-all ${added ? 'border-[hsl(var(--corp-blue))] bg-[hsl(var(--corp-blue-light))]' : 'border-[hsl(var(--corp-border))] bg-white hover:border-[hsl(var(--corp-blue-mid))]'} p-3`}>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <Icon name="ChevronRight" size={11} className="text-[hsl(var(--corp-blue-mid))] flex-shrink-0" />
              <span className="text-xs font-semibold text-[hsl(var(--corp-text))] truncate">{rec.title}</span>
            </div>
            <div className="text-[11px] text-[hsl(var(--corp-text-muted))] ml-4 mb-2">{rec.subtitle}</div>
            <div className="flex items-center gap-3 ml-4">
              {rec.growthRange && (
                <div className="flex items-center gap-1">
                  <Icon name="TrendingUp" size={10} className="text-[hsl(var(--corp-red))]" />
                  <span className="text-[10px] font-mono-corp text-[hsl(var(--corp-red))]">рост {rec.growthRange}</span>
                </div>
              )}
              {rec.duration && (
                <div className="flex items-center gap-1">
                  <Icon name="Clock" size={10} className="text-[hsl(var(--corp-text-muted))]" />
                  <span className="text-[10px] text-[hsl(var(--corp-text-muted))]">{rec.duration} р.д.</span>
                </div>
              )}
              {!rec.duration && (
                <div className="flex items-center gap-1">
                  <Icon name="Clock" size={10} className="text-[hsl(var(--corp-text-muted))]" />
                  <span className="text-[10px] text-[hsl(var(--corp-text-muted))]">? р.д.</span>
                </div>
              )}
            </div>
          </div>
          <button
            onClick={() => handleAdd(rec)}
            disabled={added}
            className={`flex-shrink-0 flex items-center gap-1 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider transition-colors whitespace-nowrap ${added ? 'bg-[hsl(var(--corp-blue))] text-white cursor-default' : 'bg-white border border-[hsl(var(--corp-blue))] text-[hsl(var(--corp-blue))] hover:bg-[hsl(var(--corp-blue))] hover:text-white'}`}
          >
            {added ? <><Icon name="Check" size={10} /> В плане</> : <><Icon name="Plus" size={10} /> В план</>}
          </button>
        </div>
      </div>
    );
  };

  const SectionHeader = ({ title, icon, count }: { title: string; icon: string; count: number }) => (
    <div className="flex items-center justify-between px-3 py-2 rosseti-header-bg mb-0">
      <div className="flex items-center gap-2 relative z-10">
        <Icon name={icon} size={12} className="text-[hsl(var(--corp-accent))]" />
        <span className="font-corp-medium text-[10px] text-white uppercase tracking-[0.14em]">{title}</span>
      </div>
      <span className="font-corp-light text-[10px] text-white/55 relative z-10">{count} рек.</span>
    </div>
  );

  return (
    <div className="flex flex-col gap-3" style={{ minWidth: 280, maxWidth: 300 }}>
      {/* Complex */}
      <div className="corp-shadow bg-white">
        <SectionHeader title="Комплексные проверки" icon="Layers" count={complex.length} />
        <div className="p-2 border border-[hsl(var(--corp-border))] border-t-0">
          <div className="text-[10px] text-[hsl(var(--corp-text-muted))] px-1 py-1.5 mb-1 italic">≥3 объекта одного филиала</div>
          <div className="flex flex-col gap-2">
            {complex.map(rec => <RecCard key={rec.id} rec={rec} />)}
          </div>
        </div>
      </div>

      {/* Direction */}
      <div className="corp-shadow bg-white">
        <SectionHeader title="Проверки по направлению" icon="Target" count={direction.length} />
        <div className="p-2 border border-[hsl(var(--corp-border))] border-t-0">
          <div className="text-[10px] text-[hsl(var(--corp-text-muted))] px-1 py-1.5 mb-1 italic">≥3 объекта с одинаковой причиной</div>
          <div className="flex flex-col gap-2">
            {direction.map(rec => <RecCard key={rec.id} rec={rec} />)}
          </div>
        </div>
      </div>
    </div>
  );
}