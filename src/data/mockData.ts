export type CheckStatus = 'unchecked' | 'checked';
export type Priority = 'high' | 'medium' | 'low';
export type Trend = 'up' | 'down' | 'flat';

export interface ObjectRecord {
  id: number;
  name: string;
  subname: string;
  voltageClass: string;
  branch: string;
  outages: { y2024: number; y2025: number; y2026: number };
  dynamicPct: number;
  trend: Trend;
  priorityLevel: Priority;
  mainCause: string;
  causeCategory: string;
  status: CheckStatus;
  details: DetailRecord[];
}

export interface DetailRecord {
  date: string;
  type: string;
  cause: string;
  duration: string;
  damage: string;
}

export interface Recommendation {
  id: string;
  type: 'complex' | 'direction';
  title: string;
  subtitle: string;
  count: number;
  growthRange: string;
  duration: string | null;
  branch: string;
}

export interface PlanItem {
  id: string;
  objectId?: number;
  title: string;
  subtitle?: string;
  priority: Priority;
  justification: string;
  duration: string | null;
  type: 'object' | 'complex' | 'direction';
}

export const objectRecords: ObjectRecord[] = [
  {
    id: 1,
    name: 'ВЛ 110 кВ Гранит-Север',
    subname: '',
    voltageClass: '110',
    branch: 'Юго-Западный',
    outages: { y2024: 2, y2025: 4, y2026: 9 },
    dynamicPct: 125,
    trend: 'up',
    priorityLevel: 'high',
    mainCause: 'Эксплуатация ВЛ (изоляторы)',
    causeCategory: 'Эксплуатация ВЛ 35 и выше',
    status: 'unchecked',
    details: [
      { date: '12.03.2026', type: 'Аварийное отключение', cause: 'Разрушение изолятора ПС-70Е', duration: '4ч 20м', damage: 'Замена 3 гирлянд' },
      { date: '05.01.2026', type: 'Аварийное отключение', cause: 'Обрыв провода ВЛ пролёт 47-48', duration: '8ч 10м', damage: 'Восстановление провода' },
      { date: '19.11.2025', type: 'Плановое ТО', cause: 'Обнаружен износ изоляторов', duration: '6ч', damage: 'Профилактика' },
      { date: '02.07.2025', type: 'Аварийное отключение', cause: 'Перекрытие изоляции при грозе', duration: '1ч 40м', damage: 'Нет' },
    ],
  },
  {
    id: 2,
    name: 'ПС 35 кВ Заречная',
    subname: '',
    voltageClass: '35',
    branch: 'Северное ПО',
    outages: { y2024: 1, y2025: 2, y2026: 5 },
    dynamicPct: 150,
    trend: 'up',
    priorityLevel: 'high',
    mainCause: 'Эксплуатация РЗА',
    causeCategory: 'Эксплуатация ВЛ 35 и выше',
    status: 'unchecked',
    details: [
      { date: '22.04.2026', type: 'Аварийное отключение', cause: 'Ложное срабатывание дифференциальной защиты', duration: '2ч 15м', damage: 'Настройка РЗА' },
      { date: '11.02.2026', type: 'Аварийное отключение', cause: 'Отказ цепей УРЗА при КЗ', duration: '5ч', damage: 'Замена блока БМРЗ' },
    ],
  },
  {
    id: 3,
    name: 'КЛ 110 кВ Кольцевая-1',
    subname: '',
    voltageClass: '110',
    branch: 'Центральный',
    outages: { y2024: 0, y2025: 1, y2026: 2 },
    dynamicPct: 200,
    trend: 'up',
    priorityLevel: 'medium',
    mainCause: 'Природа: Гроза',
    causeCategory: 'Природные',
    status: 'unchecked',
    details: [
      { date: '18.06.2026', type: 'Аварийное отключение', cause: 'Грозовой разряд, перекрытие кабельной муфты', duration: '12ч', damage: 'Замена муфты' },
    ],
  },
  {
    id: 4,
    name: 'ВЛ 35 кВ Промышленная-2',
    subname: '',
    voltageClass: '35',
    branch: 'Юго-Западный',
    outages: { y2024: 3, y2025: 5, y2026: 8 },
    dynamicPct: 60,
    trend: 'up',
    priorityLevel: 'high',
    mainCause: 'Эксплуатация ВЛ (провод)',
    causeCategory: 'Эксплуатация ВЛ 35 и выше',
    status: 'unchecked',
    details: [
      { date: '03.04.2026', type: 'Аварийное отключение', cause: 'Схлёст проводов при ветре', duration: '3ч 30м', damage: 'Регулировка стрелы провеса' },
    ],
  },
  {
    id: 5,
    name: 'ПС 110 кВ Восточная',
    subname: '',
    voltageClass: '110',
    branch: 'Восточный',
    outages: { y2024: 1, y2025: 1, y2026: 3 },
    dynamicPct: 200,
    trend: 'up',
    priorityLevel: 'medium',
    mainCause: 'Оборудование: силовой трансформатор',
    causeCategory: 'Природные',
    status: 'checked',
    details: [
      { date: '15.03.2026', type: 'Аварийное отключение', cause: 'Пробой обмотки ВН трансформатора Т-2', duration: '48ч', damage: 'Ремонт трансформатора' },
    ],
  },
  {
    id: 6,
    name: 'ВЛ 35 кВ Северная-3',
    subname: '',
    voltageClass: '35',
    branch: 'Северное ПО',
    outages: { y2024: 2, y2025: 3, y2026: 5 },
    dynamicPct: 67,
    trend: 'up',
    priorityLevel: 'medium',
    mainCause: 'Природа: Ветер/обледенение',
    causeCategory: 'Природные',
    status: 'unchecked',
    details: [
      { date: '14.01.2026', type: 'Аварийное отключение', cause: 'Обледенение проводов, превышение нагрузки', duration: '6ч', damage: 'Патрулирование' },
    ],
  },
  {
    id: 7,
    name: 'ПС 35 кВ Центральная',
    subname: '',
    voltageClass: '35',
    branch: 'Центральный',
    outages: { y2024: 0, y2025: 2, y2026: 3 },
    dynamicPct: 50,
    trend: 'up',
    priorityLevel: 'low',
    mainCause: 'Эксплуатация РЗА',
    causeCategory: 'Эксплуатация ВЛ 35 и выше',
    status: 'unchecked',
    details: [],
  },
  {
    id: 8,
    name: 'КЛ 35 кВ Западная',
    subname: '',
    voltageClass: '35',
    branch: 'Западный',
    outages: { y2024: 1, y2025: 2, y2026: 4 },
    dynamicPct: 100,
    trend: 'up',
    priorityLevel: 'medium',
    mainCause: 'Эксплуатация КЛ (муфты)',
    causeCategory: 'Эксплуатация ВЛ 35 и выше',
    status: 'unchecked',
    details: [],
  },
  {
    id: 9,
    name: 'ВЛ 110 кВ Магистральная',
    subname: '',
    voltageClass: '110',
    branch: 'Западный',
    outages: { y2024: 3, y2025: 4, y2026: 6 },
    dynamicPct: 50,
    trend: 'up',
    priorityLevel: 'medium',
    mainCause: 'Эксплуатация ВЛ (изоляторы)',
    causeCategory: 'Эксплуатация ВЛ 35 и выше',
    status: 'unchecked',
    details: [],
  },
  {
    id: 10,
    name: 'ПС 110 кВ Южная',
    subname: '',
    voltageClass: '110',
    branch: 'Юго-Западный',
    outages: { y2024: 1, y2025: 2, y2026: 3 },
    dynamicPct: 50,
    trend: 'up',
    priorityLevel: 'low',
    mainCause: 'Оборудование: выключатель',
    causeCategory: 'Природные',
    status: 'checked',
    details: [],
  },
];

export const recommendations: Recommendation[] = [
  {
    id: 'r1',
    type: 'complex',
    title: 'Юго-Западный филиал',
    subtitle: '4 объекта',
    count: 4,
    growthRange: '35–60%',
    duration: '6',
    branch: 'Юго-Западный',
  },
  {
    id: 'r2',
    type: 'complex',
    title: 'Северное ПО',
    subtitle: '3 объекта',
    count: 3,
    growthRange: '20–45%',
    duration: '6',
    branch: 'Северное ПО',
  },
  {
    id: 'r3',
    type: 'direction',
    title: 'Разрушение изоляторов ВЛ 35',
    subtitle: '5 объектов, Западный регион',
    count: 5,
    growthRange: '',
    duration: null,
    branch: 'Западный',
  },
  {
    id: 'r4',
    type: 'direction',
    title: 'Отказ цепей РЗА',
    subtitle: '3 объекта, Центральный филиал',
    count: 3,
    growthRange: '',
    duration: null,
    branch: 'Центральный',
  },
];

export const branches = ['Все филиалы', 'Юго-Западный', 'Северное ПО', 'Центральный', 'Восточный', 'Западный'];
export const causeCategories = ['Все причины', 'Эксплуатация ВЛ 35 и выше', 'Природные'];
export const equipmentTypes = ['Все типы', 'ВЛ', 'КЛ', 'ПС'];
