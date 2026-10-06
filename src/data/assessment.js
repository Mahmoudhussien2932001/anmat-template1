import { opportunities } from './opportunities.js'

export const RULES_VERSION = '2026.09.1'

export const franchisorQuestions = [
  {
    id: 'stage',
    prompt: 'أين وصلت علامتك اليوم؟',
    answers: [
      { id: 'idea', label: 'فكرة أو مشروع في مرحلة الإعداد' },
      { id: 'operating', label: 'فرع يعمل ونريد تنظيمه' },
      { id: 'expanding', label: 'عدة فروع ونسعى للتوسع' },
    ],
  },
  {
    id: 'operations',
    prompt: 'هل لديكم إجراءات تشغيل موثّقة؟',
    answers: [
      { id: 'documented', label: 'نعم، أدلة واضحة ومستخدمة' },
      { id: 'partial', label: 'بعض الإجراءات فقط' },
      { id: 'none', label: 'لم نبدأ توثيقها بعد' },
    ],
  },
  {
    id: 'financials',
    prompt: 'هل توجد بيانات مالية واضحة للوحدة؟',
    answers: [
      { id: 'documented', label: 'نعم، تكاليف وإيرادات موثّقة' },
      { id: 'partial', label: 'متوفرة جزئيًا' },
      { id: 'missing', label: 'نحتاج إلى إعدادها' },
    ],
  },
  {
    id: 'independence',
    prompt: 'هل التشغيل يعتمد على حضور المالك؟',
    answers: [
      { id: 'system', label: 'الفريق يدير العمل وفق نظام' },
      { id: 'owner', label: 'يتطلب متابعة المالك باستمرار' },
      { id: 'unknown', label: 'لا نعرف بعد' },
    ],
  },
  {
    id: 'priority',
    prompt: 'ما أولويتك الآن؟',
    answers: [
      { id: 'readiness', label: 'تقييم جاهزية العلامة' },
      { id: 'development', label: 'تطوير برنامج امتياز متكامل' },
      { id: 'attraction', label: 'طرح الفرصة واستقطاب الشركاء' },
      { id: 'network', label: 'دعم شبكة الامتياز الحالية' },
    ],
  },
]

export function buildInvestorQuestions(records) {
  const sectors = []
  const countries = []
  const seenSectors = new Set()
  const seenCountries = new Set()

  for (const record of records) {
    if (record.sectorId && record.sectorLabel && !seenSectors.has(record.sectorId)) {
      seenSectors.add(record.sectorId)
      sectors.push({ id: record.sectorId, label: record.sectorLabel })
    }
    if (record.countryId && record.countryLabel && !seenCountries.has(record.countryId)) {
      seenCountries.add(record.countryId)
      countries.push({ id: record.countryId, label: record.countryLabel })
    }
  }

  return [
    {
      id: 'sector',
      prompt: 'أي قطاع يهمك أكثر؟',
      answers: [...sectors, { id: 'all', label: 'أريد استكشاف الجميع', unrestricted: true }],
    },
    {
      id: 'level',
      prompt: 'ما مستوى الاستثمار الذي تبحث عنه؟',
      answers: [
        { id: 'low', label: 'منخفض' },
        { id: 'medium', label: 'متوسط' },
        { id: 'high', label: 'مرتفع' },
        { id: 'undecided', label: 'لم أحدد بعد', unrestricted: true },
      ],
    },
    {
      id: 'country',
      prompt: 'هل لديك تفضيل لبلد العلامة؟',
      note: 'المقصود بلد منشأ العلامة. الاختيار لا يعني أن الامتياز متاح في سوق مستهدف.',
      answers: [...countries, { id: 'all', label: 'جميع الدول', unrestricted: true }],
    },
  ]
}

export const investorQuestions = buildInvestorQuestions(opportunities)

export function questionsFor(audience) {
  return audience === 'investor' ? investorQuestions : franchisorQuestions
}

export function answerLabel(questions, questionId, answerId) {
  const question = questions.find((item) => item.id === questionId)
  return question?.answers.find((item) => item.id === answerId)?.label ?? ''
}

export function isUnrestricted(question, answerId) {
  return Boolean(question?.answers.some((item) => item.id === answerId && item.unrestricted))
}

export function isComplete(questions, answers) {
  if (!answers) return false
  return questions.every((question) => question.answers.some((item) => item.id === answers[question.id]))
}
