import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import {
  ArrowDownRight,
  ArrowRight,
  BarChart3,
  BriefcaseBusiness,
  Check,
  CircleAlert,
  Clock3,
  Crosshair,
  Database,
  Gauge,
  GitMerge,
  Info,
  Landmark,
  LockKeyhole,
  Menu,
  Network,
  Scale,
  ShieldAlert,
  Sparkles,
  Target,
  TrendingUp,
  X,
  Zap,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

type SectionId =
  | 'summary'
  | 'rationale'
  | 'comparables'
  | 'financials'
  | 'synergy'
  | 'valuation'
  | 'structure'
  | 'risks'
  | 'roadmap'
  | 'red-lines'
  | 'simulator'
  | 'next-steps';

const navItems: { id: SectionId; label: string; icon: typeof Target }[] = [
  { id: 'summary', label: 'The recommendation', icon: Target },
  { id: 'rationale', label: 'Why it makes sense', icon: Network },
  { id: 'comparables', label: 'What similar deals teach us', icon: Scale },
  { id: 'financials', label: 'Starting numbers', icon: BarChart3 },
  { id: 'synergy', label: 'How growth is created', icon: Sparkles },
  { id: 'valuation', label: 'Is the price fair?', icon: Landmark },
  { id: 'structure', label: 'Options', icon: GitMerge },
  { id: 'risks', label: 'What could go wrong', icon: ShieldAlert },
  { id: 'roadmap', label: 'The first 18 months', icon: Clock3 },
  { id: 'red-lines', label: 'Walk-away limits', icon: CircleAlert },
  { id: 'simulator', label: 'Try the numbers', icon: Gauge },
  { id: 'next-steps', label: 'What happens next', icon: ArrowRight },
];

const proFormaData = [
  { year: 'FY26 (Act)', ditto: 149, covergrid: 174, ebitda: 27 },
  { year: 'FY27E', ditto: 208, covergrid: 234, ebitda: 41 },
  { year: 'FY28E', ditto: 281, covergrid: 305, ebitda: 62 },
  { year: 'FY29E', ditto: 365, covergrid: 381, ebitda: 88 },
  { year: 'FY30E', ditto: 457, covergrid: 457, ebitda: 127 },
  { year: 'FY31E', ditto: 571, covergrid: 526, ebitda: 176 },
];

const baselineRows = [
  ['Revenue', '₹149 Cr', '₹174 Cr'],
  ['Operating earnings (EBITDA)', '₹11 Cr', '₹16 Cr'],
  ['Operating margin (EBITDA)', '7.4%', '9.2%'],
  ['Cash', '₹42 Cr', '₹14 Cr'],
  ['Debt', 'Nil', '₹28 Cr'],
  ['Net Cash / (Debt)', '₹42 Cr', '(₹14 Cr)'],
];

const funnelSteps = [
  { label: 'Total addressable base', value: '580,000', note: 'Total employees and dependents on CoverGrid', width: '100%', color: '#78cbd7' },
  { label: 'Engaged audience', value: '174,000', note: '30% log into the combined portal', width: '74%', color: '#5bbdc5' },
  { label: 'Advisory sessions booked', value: '17,400', note: '10% of engaged audience seeks advice', width: '47%', color: '#1ad079' },
  { label: 'Converted policies', value: '6,960', note: '40% of advised employees purchase', width: '27%', color: '#a8f0cc' },
];

const scenarios = [
  { name: 'Conservative', fy28: 4, fy31: 18, description: 'Employee take-up is slow because CoverGrid’s customer score is weak. Only basic systems savings are achieved.' },
  { name: 'Base', fy28: 8, fy31: 35, description: '2–3% of employees buy personal policies, while duplicate teams, tools, and marketing costs are removed.' },
  { name: 'Aggressive', fy28: 14, fy31: 62, description: 'Ditto becomes the go-to money and insurance advice portal for 600+ employers, with 5–7% of employees buying personal cover.' },
];

const decisionOptions = [
  { title: 'Proceed on proposed terms', score: 'High', trust: 'Severe', integration: 'High', verdict: 'Reject', tone: 'red', detail: "Three years of founder control would leave a commission-led culture outside Ditto’s advice standards and put the brand at risk." },
  { title: 'Renegotiate', score: 'High', trust: 'Moderate (Controlled)', integration: 'Moderate', verdict: 'Accept', tone: 'green', detail: 'Keep the 30% equity and ₹25 Cr cash, but replace founder autonomy with a 12-month performance period tied to customer satisfaction and compliance.' },
  { title: 'Acquire minority stake', score: 'Low', trust: 'Low', integration: 'Low', verdict: 'Reject', tone: 'muted', detail: "A small stake would not give Ditto enough control to improve CoverGrid’s declining customer score of 42." },
  { title: 'Strategic partnership', score: 'Medium', trust: 'Low', integration: 'Low', verdict: 'Backup', tone: 'amber', detail: 'A referral deal avoids the upfront cash payment, but it would convert far fewer employees than a shared platform.' },
  { title: 'Walk away', score: 'Zero', trust: 'Zero', integration: 'Zero', verdict: 'Reject', tone: 'muted', detail: 'The opportunity is too valuable: CoverGrid reaches employees at the moment they first start thinking about insurance.' },
];

const roadmap = [
  { period: 'Pre-close · Day 0–30', title: 'Keep customer data safe', icon: LockKeyhole, detail: 'Review all data on CoverGrid’s 5.8 lakh employees before the two network environments are connected. Align security controls first.' },
  { period: 'Month 1–3', title: 'Change how teams are paid', icon: ShieldAlert, detail: 'Move away from high-variable commissions. Use higher base salaries and bonuses tied to customer satisfaction and policy retention.' },
  { period: 'Month 6–12', title: 'Bring the tools together', icon: GitMerge, detail: 'Retire the old claims and enrollment portal. Move all 640 employer clients to the unified “Ditto Workplace” backend.' },
  { period: 'Month 18', title: 'Retire the old brand', icon: Sparkles, detail: 'Use “CoverGrid by Ditto” during the transition, then bring the business fully under the Ditto master brand.' },
];

const CountUp = ({ value, prefix = '', suffix = '', decimals = 0 }: { value: number; prefix?: string; suffix?: string; decimals?: number }) => {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      let start: number | null = null;
      const frame = (time: number) => {
        if (start === null) start = time;
        const progress = Math.min((time - start) / 300, 1);
        setDisplay(value * (1 - Math.pow(1 - progress, 3)));
        if (progress < 1) requestAnimationFrame(frame);
      };
      requestAnimationFrame(frame);
      observer.disconnect();
    }, { threshold: 0.4 });
    observer.observe(node);
    return () => observer.disconnect();
  }, [value]);
  return <span ref={ref}>{prefix}{display.toFixed(decimals)}{suffix}</span>;
};

function SectionHeader({ number, kicker, title, lede }: { number: string; kicker: string; title: string; lede?: string }) {
  return (
    <div className="reveal" data-reveal>
      <div className="section-kicker"><span>{number}</span>{kicker}</div>
      <h2 className="section-title">{title}</h2>
      {lede ? <p className="section-lede">{lede}</p> : null}
    </div>
  );
}

function Hero({ onNavigate }: { onNavigate: (id: SectionId) => void }) {
  return (
    <section className="relative min-h-[700px] overflow-hidden border-b border-[var(--line)]" data-hero>
      <div className="hero-grid absolute inset-0 opacity-70" />
      <div className="hero-scanline absolute left-0 top-[31%] h-px w-[42%] bg-[var(--green)]" />
      <div className="absolute right-[13%] top-[18%] h-44 w-44 rounded-full border border-[rgba(26,208,121,.22)] after:absolute after:inset-5 after:rounded-full after:border after:border-[rgba(120,203,215,.18)]" />
      <div className="page-frame relative flex min-h-[700px] flex-col justify-between pb-16 pt-16">
        <div className="flex items-center justify-between">
          <div className="eyebrow flex items-center gap-3 text-[var(--green-soft)]"><span className="h-2 w-2 bg-[var(--green)]" /> Confidential / strategy review</div>
          <div className="mono text-[10px] tracking-[.15em] text-[#68767d]">INDIA · FY26–FY31</div>
        </div>
        <div className="grid items-end gap-14 lg:grid-cols-[1.15fr_.85fr]">
          <div>
            <div className="reveal is-visible section-kicker"><span>00 / recommendation</span> Merger brief</div>
            <h1 className="reveal is-visible mt-7 max-w-[860px] font-[var(--app-font-serif)] text-[clamp(58px,9vw,144px)] font-medium leading-[.84] tracking-[-.08em]" style={{ transitionDelay: '120ms' }}>
              The Ditto<span className="text-[var(--green)]">–</span><br />CoverGrid<br /><span className="text-[#74848b]">Merger.</span>
            </h1>
            <p className="reveal is-visible mt-10 max-w-[560px] text-lg leading-relaxed text-[#a7b4b7]" style={{ transitionDelay: '220ms' }}>
              Use CoverGrid’s workplace reach to bring Ditto’s straightforward insurance advice to more people.
            </p>
            <button className="reveal is-visible mt-10 flex items-center gap-3 border-b border-[var(--green)] pb-2 font-mono text-[10px] uppercase tracking-[.17em] text-[var(--green-soft)] transition-colors hover:text-[var(--green)]" style={{ transitionDelay: '320ms' }} onClick={() => onNavigate('summary')} data-testid="button-read-thesis">
              Read the recommendation <ArrowDownRight size={15} />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-10 border-t border-[var(--line)] pt-6">
            <div className="metric-chip"><div className="eyebrow">Cash consideration</div><div className="stat-value mt-3"><CountUp value={25} prefix="₹" /> <span className="text-lg text-[#839197]">Cr</span></div></div>
            <div className="metric-chip"><div className="eyebrow">CoverGrid equity</div><div className="stat-value mt-3"><CountUp value={30} suffix="%" /></div></div>
            <div className="metric-chip"><div className="eyebrow">Employer access</div><div className="stat-value mt-3"><CountUp value={640} /></div><div className="mt-2 text-xs text-[#74848b]">employers</div></div>
            <div className="metric-chip"><div className="eyebrow">Captive audience</div><div className="stat-value mt-3"><CountUp value={5.8} suffix="L" decimals={1} /></div><div className="mt-2 text-xs text-[#74848b]">employees</div></div>
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-[var(--line)] pt-5 text-[10px] text-[#68767d]">
          <span className="mono uppercase tracking-[.12em]">A distribution deal built around clear advice</span>
          <span className="hidden sm:block">Strategy review team · Private & confidential</span>
        </div>
      </div>
    </section>
  );
}

function ExecutiveSummary() {
  const cards = [
    { label: 'The recommendation', title: 'Proceed, but rewrite the control terms.', text: 'The workplace reach is too valuable to leave behind. Ditto should only proceed if the combined business follows Ditto’s advice standards.', icon: Target, accent: 'green' },
    { label: 'The price', title: '30% equity + ₹25 Cr cash is favorable.', text: 'CoverGrid brings more revenue, but its ₹14 Cr net debt and weaker customer experience make the proposed price reasonable for Ditto.', icon: TrendingUp, accent: 'green' },
    { label: 'Why now', title: 'Reach people when insurance becomes real.', text: '640 employers and nearly 5.8 lakh employees give Ditto a direct path around its customer-acquisition bottleneck, at near-zero cost to reach them.', icon: BriefcaseBusiness, accent: 'cyan' },
    { label: 'The condition', title: 'Reject three years of founder control.', text: 'A separate enterprise division could keep the old commission-led behavior and undermine Ditto’s promise of clear, unbiased advice.', icon: ShieldAlert, accent: 'red' },
  ];
  return (
    <section id="summary" className="section-shell" data-section="summary">
      <div className="page-frame">
        <SectionHeader number="01" kicker="Executive summary" title="A good price for a non-negotiable culture." lede="The strategic answer is yes — with one clause rewritten before a signature." />
        <div className="mt-16 grid gap-px overflow-hidden border border-[var(--line)] bg-[var(--line)] md:grid-cols-2">
          {cards.map(({ label, title, text, icon: Icon, accent }, index) => (
            <article className={`reveal panel-hover min-h-[245px] bg-[#111521] p-8 ${index === 3 ? 'risk-stripe' : ''}`} data-reveal key={label} style={{ transitionDelay: `${index * 80}ms` }} data-testid={`card-summary-${index}`}>
              <div className="flex items-center justify-between" style={{ color: accent === 'red' ? 'var(--red)' : accent === 'cyan' ? 'var(--cyan)' : 'var(--green)' }}><span className="eyebrow">{label}</span><Icon size={18} strokeWidth={1.4} /></div>
              <h3 className="mt-9 max-w-[390px] font-[var(--app-font-serif)] text-[28px] leading-[1.04] tracking-[-.045em] text-[#e6f0ec]">{title}</h3>
              <p className="mt-5 max-w-[430px] text-sm leading-7 text-[#849196]">{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Rationale() {
  return (
    <section id="rationale" className="section-shell" data-section="rationale">
      <div className="page-frame">
        <SectionHeader number="02" kicker="Why it makes sense" title="Work is where many people first meet insurance." lede="CoverGrid has the employer relationships and enrollment process. Ditto has the clear advice. Together, Ditto can help people understand what they already have and what they may still need." />
        <div className="mt-20 grid items-center gap-12 lg:grid-cols-[.8fr_1.2fr]">
          <div className="space-y-7">
            <div className="data-line"><div className="eyebrow">Market shift</div><p className="mt-2 text-sm leading-7 text-[#c3cecb]">Employer-sponsored insurance is rapidly becoming a primary distribution channel in India.</p></div>
            <div className="data-line"><div className="eyebrow">The gap</div><p className="mt-2 text-sm leading-7 text-[#c3cecb]">Employees encounter health insurance at work, but often lack an understanding of its coverage limitations.</p></div>
            <div className="data-line"><div className="eyebrow">What changes</div><p className="mt-2 text-sm leading-7 text-[#c3cecb]">Offer personal health and term insurance to an audience Ditto can already reach, without the usual cost of finding new customers.</p></div>
          </div>
          <div className="relative min-h-[340px] border border-[var(--line)] bg-[#0e131d] p-8">
            <div className="absolute left-8 right-8 top-1/2 h-px bg-gradient-to-r from-[#78cbd7] via-[var(--green)] to-[var(--amber)]" />
            <div className="relative flex min-h-[280px] items-center justify-between gap-4">
              {[
                { n: '01', label: 'CoverGrid', sub: 'distribution', icon: BriefcaseBusiness, color: '#78cbd7' },
                { n: '02', label: 'Ditto', sub: 'advisory layer', icon: Crosshair, color: '#1ad079' },
                { n: '03', label: 'Personal cover', sub: 'cross-sell', icon: Zap, color: '#e9b866' },
              ].map(({ n, label, sub, icon: Icon, color }) => (
                <div key={n} className="relative z-10 flex max-w-[130px] flex-col items-center text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border" style={{ borderColor: color, background: `${color}12`, color }}><Icon size={23} strokeWidth={1.3} /></div>
                  <div className="mono text-[10px]" style={{ color }}>{n}</div><div className="mt-2 text-sm font-semibold text-[#dbe8e2]">{label}</div><div className="mt-1 text-xs text-[#78878b]">{sub}</div>
                </div>
              ))}
            </div>
              <div className="absolute bottom-5 left-8 flex items-center gap-2 text-[10px] uppercase tracking-[.12em] text-[#68767d]"><ArrowRight size={12} className="text-[var(--green)]" /> Clear advice reaches more people</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Comparables() {
  const deals = [
    { name: 'Marsh & McLennan × JLT', tier: 'Tier A / Success', score: 74, lesson: "Absorb acquired leadership into unified executive roles — don't leave it in walled-off divisions.", icon: Check, color: 'var(--green)' },
    { name: 'Aon × WTW', tier: 'Tier C / Failure', score: 38, lesson: 'Pre-emptive integration and divestiture commitments carry massive financial penalties if a deal collapses.', icon: X, color: 'var(--red)' },
  ];
  return (
    <section id="comparables" className="section-shell" data-section="comparables">
      <div className="page-frame">
        <SectionHeader number="03" kicker="What similar deals teach us" title="The way the teams are combined matters more than the headline price." lede="Two large insurance deals point to the same lesson: bring leadership and standards together early, and do not spend heavily before the plan is clear." />
        <div className="mt-16 grid gap-5 lg:grid-cols-2">
          {deals.map((deal, index) => (
            <article key={deal.name} className="reveal panel panel-hover relative overflow-hidden p-8" data-reveal style={{ transitionDelay: `${index * 120}ms` }}>
              <div className="flex items-start justify-between"><div><div className="eyebrow" style={{ color: deal.color }}>{deal.tier}</div><h3 className="mt-5 max-w-[390px] font-[var(--app-font-serif)] text-3xl tracking-[-.04em] text-[#e4efea]">{deal.name}</h3></div><deal.icon size={19} color={deal.color} strokeWidth={1.4} /></div>
              <div className="mt-12 flex items-end gap-5"><div className="font-[var(--app-font-serif)] text-7xl tracking-[-.07em]" style={{ color: deal.color }}>{deal.score}</div><div className="mb-2 text-xs text-[#75848a]">similarity<br />score / 100</div></div>
              <div className="mt-6 h-1 bg-[#29323b]"><div className="h-full" style={{ width: `${deal.score}%`, background: deal.color }} /></div>
              <div className="mt-8 border-t border-[var(--line)] pt-5"><div className="eyebrow">Lesson for Ditto</div><p className="mt-3 text-sm leading-7 text-[#a9b5b3]">{deal.lesson}</p></div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Financials() {
  return (
    <section id="financials" className="section-shell" data-section="financials">
      <div className="page-frame">
        <SectionHeader number="04" kicker="Starting numbers · FY26" title="CoverGrid brings scale. Ditto brings a stronger base." lede="Together, the businesses start at ₹323 Cr of revenue and ₹27 Cr of operating earnings. The cash, debt, customer scores, and employee experience are very different." />
        <div className="mt-16 overflow-hidden border border-[var(--line)]">
          <div className="grid grid-cols-[1.3fr_1fr_1fr] border-b border-[var(--line)] bg-[#151b27] p-5 text-xs uppercase tracking-[.14em] text-[#728087]"><div>Metric</div><div className="text-[var(--cyan)]">Ditto</div><div className="text-[var(--amber)]">CoverGrid</div></div>
          {baselineRows.map(([metric, ditto, covergrid], index) => <div key={metric} className="reveal grid grid-cols-[1.3fr_1fr_1fr] border-b border-[var(--line)] p-5 text-sm" data-reveal style={{ transitionDelay: `${index * 50}ms` }}><div className="text-[#93a19f]">{metric}</div><div className="mono text-[#b9f0d0]">{ditto}</div><div className={`mono ${index === 5 ? 'text-[var(--red)]' : 'text-[#eacb8e]'}`}>{covergrid}</div></div>)}
        </div>
        <div className="mt-10 grid gap-px bg-[var(--line)] md:grid-cols-3">
           <div className="bg-[#101620] p-6"><div className="eyebrow">Ditto customer score (NPS)</div><div className="mt-3 font-[var(--app-font-serif)] text-5xl text-[var(--cyan)]">74</div><div className="mt-2 text-xs text-[#718086]">91% employee satisfaction</div></div>
           <div className="bg-[#101620] p-6"><div className="eyebrow">CoverGrid customer score (NPS)</div><div className="mt-3 font-[var(--app-font-serif)] text-5xl text-[var(--red)]">42</div><div className="mt-2 text-xs text-[#718086]">68% employee satisfaction</div></div>
           <div className="bg-[#101620] p-6"><div className="eyebrow">Cash vs debt</div><div className="mt-3 font-[var(--app-font-serif)] text-5xl text-[var(--amber)]">₹42 / ₹28 Cr</div><div className="mt-2 text-xs text-[#718086]">Ditto cash / CoverGrid debt</div></div>
        </div>
      </div>
    </section>
  );
}

function ProForma() {
  return (
    <section className="section-shell" id="pro-forma" data-section="financials">
      <div className="page-frame">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
           <div><div className="section-kicker"><span>05 / outlook</span> Five-year financial outlook</div><h2 className="section-title">The combined business gets more profitable over time.</h2></div>
           <div className="mono text-right text-[10px] leading-6 text-[#76848a]">₹ Crore<br /><span className="text-[var(--green)]">■</span> Ditto <span className="text-[var(--cyan)]">■</span> CoverGrid <span className="text-[var(--amber)]">—</span> Operating earnings</div>
        </div>
        <div className="mt-14 border border-[var(--line)] bg-[#0e131c] p-4 pt-8 md:p-8">
          <div className="h-[360px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={proFormaData} margin={{ top: 8, right: 8, left: -22, bottom: 0 }}>
                <CartesianGrid stroke="rgba(218,236,229,.08)" vertical={false} />
                <XAxis dataKey="year" stroke="#6f7e84" tickLine={false} axisLine={false} tick={{ fontSize: 10, fontFamily: 'DM Mono' }} />
                <YAxis yAxisId="revenue" stroke="#6f7e84" tickLine={false} axisLine={false} tick={{ fontSize: 10, fontFamily: 'DM Mono' }} />
                <YAxis yAxisId="ebitda" orientation="right" stroke="#e9b866" tickLine={false} axisLine={false} tick={{ fontSize: 10, fontFamily: 'DM Mono' }} />
                <Tooltip contentStyle={{ background: '#17202a', border: '1px solid rgba(26,208,121,.3)', fontFamily: 'DM Mono', fontSize: 11 }} cursor={{ fill: 'rgba(255,255,255,.03)' }} />
                <Bar yAxisId="revenue" dataKey="ditto" stackId="rev" fill="#1ad079" radius={[2, 2, 0, 0]} />
                <Bar yAxisId="revenue" dataKey="covergrid" stackId="rev" fill="#78cbd7" radius={[2, 2, 0, 0]} />
                <Line yAxisId="ebitda" type="monotone" dataKey="ebitda" stroke="#e9b866" strokeWidth={2.5} dot={{ fill: '#e9b866', r: 3, strokeWidth: 0 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
         <div className="mt-6 flex justify-between border-t border-[var(--line)] pt-5 text-[10px] uppercase tracking-[.12em] text-[#74838a]"><span>Combined revenue before extra growth</span><span className="mono text-[var(--green-soft)]">₹323 Cr → ₹1,097 Cr</span></div>
      </div>
    </section>
  );
}

function Synergy() {
  const [scenarioIndex, setScenarioIndex] = useState(1);
  const scenario = scenarios[scenarioIndex];
  return (
    <section id="synergy" className="section-shell" data-section="synergy">
      <div className="page-frame">
        <SectionHeader number="06" kicker="How growth is created" title="Reach only matters if people take action." lede="CoverGrid supplies the audience. Ditto supplies the education and advice that can turn that audience into personal policy customers." />
        <div className="mt-16 grid gap-14 lg:grid-cols-[1fr_.8fr]">
          <div className="space-y-3">
            {funnelSteps.map((step, index) => <div key={step.label} className="funnel-step reveal" data-reveal style={{ transitionDelay: `${index * 90}ms` }}><div className="mb-2 flex items-baseline justify-between"><span className="text-sm text-[#d3e0da]">{step.label}</span><span className="mono text-lg" style={{ color: step.color }}>{step.value}</span></div><div className="h-11 bg-[#151d27] p-1"><div className="flex h-full items-center px-4 text-[10px] text-[#0b1a15]" style={{ width: step.width, background: step.color }}><span>{step.note}</span></div></div></div>)}
             <div className="flex items-center justify-between border-t border-[var(--line)] pt-5"><span className="eyebrow">Estimated annual revenue</span><span className="font-[var(--app-font-serif)] text-3xl text-[var(--green)]">~₹10.4 Cr</span></div>
          </div>
          <div className="panel p-7">
             <div className="flex items-center justify-between"><div className="eyebrow">What could happen</div><span className="mono text-[10px] text-[#728087]">FY28 → FY31</span></div>
            <div className="mt-7 grid grid-cols-3 border-b border-[var(--line)]">{scenarios.map((item, index) => <button key={item.name} onClick={() => setScenarioIndex(index)} className={`border-b-2 px-2 pb-4 text-left text-xs transition-colors ${index === scenarioIndex ? 'border-[var(--green)] text-[var(--green-soft)]' : 'border-transparent text-[#718087] hover:text-[#b9c8c5]'}`} data-testid={`button-scenario-${item.name.toLowerCase()}`}>{item.name}</button>)}</div>
             <div className="mt-9 flex items-end justify-between"><div><div className="eyebrow">FY28 operating earnings lift</div><div className="mt-2 font-[var(--app-font-serif)] text-5xl text-[#d9eee4]">+₹{scenario.fy28} <span className="text-lg text-[#75848a]">Cr</span></div></div><div className="text-right"><div className="eyebrow">FY31 operating earnings lift</div><div className="mt-2 font-[var(--app-font-serif)] text-5xl text-[var(--green)]">+₹{scenario.fy31} <span className="text-lg text-[#75848a]">Cr</span></div></div></div>
            <p className="mt-9 border-l border-[var(--green)] pl-4 text-sm leading-7 text-[#9ca9a7]">{scenario.description}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Valuation() {
  return (
    <section id="valuation" className="section-shell" data-section="valuation">
      <div className="page-frame">
        <SectionHeader number="07" kicker="Is the price fair?" title="Revenue alone does not tell the whole story." lede="CoverGrid contributes more revenue at the start. Ditto contributes cash, a stronger brand, and the advice model that is meant to make the combined reach valuable." />
        <div className="mt-16 grid items-center gap-12 lg:grid-cols-[1fr_.8fr]">
          <div className="space-y-10">
            <div><div className="mb-3 flex justify-between text-xs text-[#a6b3b0]"><span>Revenue contribution · CoverGrid</span><span className="mono text-[var(--cyan)]">53.8%</span></div><div className="h-4 bg-[#1c2730]"><div className="h-full bg-[var(--cyan)]" style={{ width: '53.8%' }} /></div><div className="mt-2 text-[10px] text-[#68767d]">₹174 Cr out of ₹323 Cr combined</div></div>
            <div><div className="mb-3 flex justify-between text-xs text-[#a6b3b0]"><span>EBITDA contribution · CoverGrid</span><span className="mono text-[var(--amber)]">59.2%</span></div><div className="h-4 bg-[#1c2730]"><div className="h-full bg-[var(--amber)]" style={{ width: '59.2%' }} /></div><div className="mt-2 text-[10px] text-[#68767d]">₹16 Cr out of ₹27 Cr combined</div></div>
            <div><div className="mb-3 flex justify-between text-xs text-[#a6b3b0]"><span>Proposed equity · CoverGrid</span><span className="mono text-[var(--green)]">30.0%</span></div><div className="h-4 bg-[#1c2730]"><div className="h-full bg-[var(--green)]" style={{ width: '30%' }} /></div><div className="mt-2 text-[10px] text-[#68767d]">After net debt, quality and cash adjustments</div></div>
          </div>
           <div className="border-l border-[var(--green)] pl-8"><div className="eyebrow">Bottom line</div><p className="mt-5 font-[var(--app-font-serif)] text-3xl leading-[1.1] tracking-[-.04em] text-[#e1eee8]">Accept the price. Rewrite the control terms.</p><p className="mt-6 text-sm leading-7 text-[#929f9f]">CoverGrid’s ₹14 Cr net debt and lower customer score help explain why 30% equity + ₹25 Cr cash is a reasonable price for Ditto.</p></div>
        </div>
      </div>
    </section>
  );
}

function DecisionMatrix() {
  const [selected, setSelected] = useState(1);
  const item = decisionOptions[selected];
  return (
    <section id="structure" className="section-shell" data-section="structure">
      <div className="page-frame">
        <SectionHeader number="08" kicker="Options" title="The price works. The control terms need work." lede="The board compared five ways forward against three simple tests: protect the advice model, create long-term value, and keep the transition manageable." />
        <div className="mt-14 overflow-hidden border border-[var(--line)]">
           <div className="table-row header"><div>Pathway</div><div>Value</div><div>Advice model</div><div>Change effort</div><div>Decision</div></div>
          {decisionOptions.map((option, index) => <div key={option.title} className={`matrix-row table-row ${selected === index ? 'selected' : ''}`} onClick={() => setSelected(index)} data-testid={`button-decision-${index}`}><div className="flex items-center gap-3 text-[#dbe8e3]"><span className="mono text-[10px] text-[#68767d]">0{index + 1}</span>{option.title}{index === 1 ? <span className="border border-[var(--green)] px-2 py-1 text-[9px] uppercase tracking-[.1em] text-[var(--green)]">Recommended</span> : null}</div><div className="text-[#a2b0ae]">{option.score}</div><div className={option.trust === 'Severe' ? 'text-[var(--red)]' : 'text-[#a2b0ae]'}>{option.trust}</div><div className="text-[#a2b0ae]">{option.integration}</div><div className={option.tone === 'green' ? 'text-[var(--green)]' : option.tone === 'amber' ? 'text-[var(--amber)]' : option.tone === 'red' ? 'text-[var(--red)]' : 'text-[#819096]'}>{option.verdict}</div>{selected === index ? <div className="col-span-5 border-t border-[var(--line)] py-4 pr-4 text-sm leading-6 text-[#9eaca9]">{option.detail}</div> : null}</div>)}
        </div>
         <div className="mt-7 flex items-center gap-3 text-xs text-[#899796]"><Info size={15} className="text-[var(--green)]" /> The recommended path keeps the proposed 30% + ₹25 Cr economics while putting the combined business under Ditto’s customer and compliance standards.</div>
      </div>
    </section>
  );
}

function Risks() {
  const risks = [
     { title: 'Keeping customer data safe', severity: 'Highest priority', icon: Database, intro: 'The source case uses the UnitedHealth–Change Healthcare breach as a warning: security controls must be aligned before the two systems connect.', checks: ['Review all 5.8 lakh employee records before close', 'Align security controls before systems are connected', 'Review past claims disputes during the first fact-finding phase'] },
     { title: 'Selling the right way', severity: 'High priority', icon: ShieldAlert, intro: "CoverGrid’s 68% employee satisfaction and 42 customer score point to a commission-led culture that cannot sit outside Ditto’s advice model.", checks: ['Replace high-variable commission incentives', 'Tie bonuses to customer satisfaction and policy retention', 'Train agents to give advice, not just sell volume'] },
  ];
  return (
    <section id="risks" className="section-shell" data-section="risks">
      <div className="page-frame">
        <SectionHeader number="09" kicker="What could go wrong" title="Protect trust before chasing growth." />
        <div className="mt-16 grid gap-5 lg:grid-cols-2">{risks.map(({ title, severity, icon: Icon, intro, checks }, index) => <article key={title} className="risk-stripe panel panel-hover p-8"><div className="flex justify-between"><div><div className="eyebrow text-[var(--red)]">{severity} risk</div><h3 className="mt-5 font-[var(--app-font-serif)] text-3xl tracking-[-.04em]">{title}</h3></div><Icon className="text-[var(--red)]" size={23} strokeWidth={1.2} /></div><p className="mt-7 max-w-[470px] text-sm leading-7 text-[#9ca9a7]">{intro}</p><div className="mt-7 space-y-3 border-t border-[var(--line)] pt-6">{checks.map(check => <div key={check} className="flex items-start gap-3 text-xs leading-5 text-[#c6d2ce]"><Check size={14} className="mt-0.5 shrink-0 text-[var(--green)]" />{check}</div>)}</div></article>)}</div>
      </div>
    </section>
  );
}

function Roadmap() {
  const [selected, setSelected] = useState(0);
  const active = roadmap[selected];
  return (
    <section id="roadmap" className="section-shell" data-section="roadmap">
      <div className="page-frame">
        <SectionHeader number="10" kicker="The first 18 months" title="Start carefully, then bring the businesses together." lede="The order matters: protect data first, change incentives second, combine tools third, and retire the old brand last." />
        <div className="relative mt-20">
          <div className="roadmap-line hidden md:block" />
          <div className="grid gap-10 md:grid-cols-4">{roadmap.map(({ period, title, icon: Icon }, index) => <button key={period} className={`milestone text-left ${selected === index ? 'selected' : ''}`} onClick={() => setSelected(index)} data-testid={`button-roadmap-${index}`}><div className="flex items-center gap-4 md:block"><div className="milestone-dot mb-5" /><div className="eyebrow text-[var(--green)]">{period}</div><div className="mt-3 flex items-center gap-2 text-sm font-semibold text-[#dce8e3]"><Icon size={15} strokeWidth={1.3} />{title}</div></div></button>)}</div>
          <div className="mt-12 border-t border-[var(--green)] bg-[#121a20] p-7"><div className="flex items-start justify-between gap-5"><div><div className="eyebrow">{active.period}</div><h3 className="mt-3 font-[var(--app-font-serif)] text-2xl tracking-[-.03em] text-[#e6f1eb]">{active.title}</h3><p className="mt-4 max-w-[700px] text-sm leading-7 text-[#9caaa7]">{active.detail}</p></div><span className="mono text-[10px] text-[var(--green)]">01 / 04</span></div></div>
        </div>
      </div>
    </section>
  );
}

function RedLines() {
  const lines = [
     { label: 'Cash limit', value: '₹35 Cr', note: 'Paying more would leave too little cash to complete the transition and absorb ₹28 Cr of debt.', icon: Landmark },
     { label: 'Equity limit', value: '38%', note: 'Above this level, Ditto would give too much of the combined company for weaker-quality revenue.', icon: Scale },
     { label: 'Governance limit', value: 'No autonomy', note: 'If founders will not accept sales reviews and customer-satisfaction incentives, do not proceed.', icon: LockKeyhole },
  ];
  return (
    <section id="red-lines" className="section-shell" data-section="red-lines">
      <div className="page-frame">
        <SectionHeader number="11" kicker="Walk-away limits" title="Know what ends the conversation." lede="The proposed price is acceptable. These are the limits the board should not cross." />
        <div className="mt-16 grid gap-4 lg:grid-cols-3">{lines.map(({ label, value, note, icon: Icon }, index) => <article key={label} className="redline-card panel panel-hover p-7"><div className="flex justify-between"><div className="eyebrow text-[var(--amber)]">0{index + 1} / {label}</div><Icon size={17} className="text-[var(--amber)]" strokeWidth={1.3} /></div><div className="mt-10 font-[var(--app-font-serif)] text-5xl tracking-[-.06em] text-[#f0d398]">{value}</div><p className="mt-6 text-sm leading-7 text-[#9ea9a6]">{note}</p><div className="mt-8 flex items-center gap-2 text-[10px] uppercase tracking-[.1em] text-[var(--red)]"><X size={13} /> Walk away beyond this line</div></article>)}</div>
      </div>
    </section>
  );
}

type SimulatorValues = { equity: number; cash: number; dittoGrowth: number; cgGrowth: number; synergy: number };

function calculateSimulator(values: SimulatorValues) {
  const dittoRev = [149];
  const cgRev = [174];
  const synergyRev = [0];
  const combinedEbitda = [27];
  let currentDitto = 149;
  let currentCg = 174;
  for (let year = 1; year <= 5; year += 1) {
    const dittoRate = 0.45 - ((0.45 - values.dittoGrowth / 100) * (year / 5));
    const cgRate = 0.44 - ((0.44 - values.cgGrowth / 100) * (year / 5));
    currentDitto *= 1 + dittoRate;
    currentCg *= 1 + cgRate;
    const currentSyn = values.synergy * (year / 5);
    dittoRev.push(Math.round(currentDitto));
    cgRev.push(Math.round(currentCg));
    synergyRev.push(Math.round(currentSyn));
    const dittoMargin = 0.074 + ((0.18 - 0.074) * (year / 5));
    const cgMargin = 0.092 + ((0.14 - 0.092) * (year / 5));
    combinedEbitda.push(Math.round((currentDitto * dittoMargin) + (currentCg * cgMargin) + (currentSyn * 0.4)));
  }
  return ['FY26', 'FY27E', 'FY28E', 'FY29E', 'FY30E', 'FY31E'].map((year, index) => ({ year, ditto: dittoRev[index], covergrid: cgRev[index], synergy: synergyRev[index], ebitda: combinedEbitda[index] }));
}

function Simulator() {
  const [values, setValues] = useState<SimulatorValues>({ equity: 30, cash: 25, dittoGrowth: 25, cgGrowth: 15, synergy: 80 });
  const data = useMemo(() => calculateSimulator(values), [values]);
  const destructive = values.equity > 38 || values.cash > 35;
  const controls = [
    { key: 'equity', label: 'CoverGrid equity stake', min: 10, max: 50, value: values.equity, display: `${values.equity}%` },
    { key: 'cash', label: 'Cash consideration', min: 0, max: 50, value: values.cash, display: `₹${values.cash} Cr` },
    { key: 'dittoGrowth', label: 'Ditto year 5 revenue growth', min: 10, max: 50, value: values.dittoGrowth, display: `${values.dittoGrowth}%` },
    { key: 'cgGrowth', label: 'CoverGrid year 5 revenue growth', min: 5, max: 45, value: values.cgGrowth, display: `${values.cgGrowth}%` },
    { key: 'synergy', label: 'Extra year 5 revenue', min: 0, max: 150, value: values.synergy, display: `₹${values.synergy} Cr` },
  ] as const;
  return (
    <section id="simulator" className="section-shell" data-section="simulator">
      <div className="page-frame">
        <SectionHeader number="12" kicker="Try the numbers" title="Change the assumptions. See the result." lede="Move the five sliders to test the price, growth, and extra revenue assumptions. The model follows the supplied formulas exactly." />
        <div className="mt-16 grid gap-px border border-[var(--line)] bg-[var(--line)] lg:grid-cols-[.75fr_1.25fr]">
          <div className="bg-[#111722] p-7 md:p-9">
            <div className="flex items-center justify-between"><div className="eyebrow">Change the assumptions</div><button onClick={() => setValues({ equity: 30, cash: 25, dittoGrowth: 25, cgGrowth: 15, synergy: 80 })} className="mono text-[10px] text-[#78868c] underline decoration-[var(--green)] underline-offset-4 hover:text-[var(--green)]" data-testid="button-reset-simulator">Reset</button></div>
              <div className="mt-9 space-y-7">{controls.map(control => <label className="block" key={control.key}><div className="mb-3 flex justify-between gap-4 text-xs text-[#b8c5c1]"><span>{control.label}</span><span className="mono text-[var(--green-soft)]">{control.display}</span></div><input className="range-input" type="range" min={control.min} max={control.max} value={control.value} style={{ '--range': `${((control.value - control.min) / (control.max - control.min)) * 100}%` } as CSSProperties} onChange={event => setValues(prev => ({ ...prev, [control.key]: Number(event.target.value) }))} data-testid={`input-simulator-${control.key}`} /></label>)}</div>
             <div className={`mt-9 border p-5 ${destructive ? 'border-[var(--red)] bg-[rgba(229,107,98,.08)]' : 'border-[var(--green)] bg-[rgba(26,208,121,.07)]'}`} data-testid="status-deal-assessment"><div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[.12em]" style={{ color: destructive ? 'var(--red)' : 'var(--green)' }}><span className="h-2 w-2 rounded-full" style={{ background: destructive ? 'var(--red)' : 'var(--green)' }} /> Deal assessment: {destructive ? 'Outside the board limits' : 'Within the board limits'}</div><p className="mt-4 text-xs leading-6 text-[#9ba8a5]">{destructive ? `At ${values.equity}% equity and ₹${values.cash} Cr cash, the offer crosses the board’s 38% equity or ₹35 Cr cash limit.` : `At ${values.equity}% equity and ₹${values.cash} Cr cash, the offer stays within the board’s 38% equity and ₹35 Cr cash limits.`}</p></div>
          </div>
          <div className="bg-[#0d121b] p-4 pt-8 md:p-9">
             <div className="mb-4 flex items-center justify-between"><div className="eyebrow">Live five-year result</div><div className="mono text-[10px] text-[#708087]">Revenue / operating earnings · ₹ Cr</div></div>
            <div className="h-[390px] w-full"><ResponsiveContainer width="100%" height="100%"><ComposedChart data={data} margin={{ top: 8, right: 4, left: -18, bottom: 0 }}><CartesianGrid stroke="rgba(218,236,229,.08)" vertical={false} /><XAxis dataKey="year" stroke="#6f7e84" tickLine={false} axisLine={false} tick={{ fontSize: 10, fontFamily: 'DM Mono' }} /><YAxis yAxisId="revenue" stroke="#6f7e84" tickLine={false} axisLine={false} tick={{ fontSize: 10, fontFamily: 'DM Mono' }} /><YAxis yAxisId="ebitda" orientation="right" stroke="#e9b866" tickLine={false} axisLine={false} tick={{ fontSize: 10, fontFamily: 'DM Mono' }} /><Tooltip contentStyle={{ background: '#17202a', border: '1px solid rgba(26,208,121,.3)', fontFamily: 'DM Mono', fontSize: 11 }} cursor={{ fill: 'rgba(255,255,255,.03)' }} /><Bar yAxisId="revenue" dataKey="ditto" stackId="rev" fill="#1ad079" /><Bar yAxisId="revenue" dataKey="covergrid" stackId="rev" fill="#78cbd7" /><Bar yAxisId="revenue" dataKey="synergy" stackId="rev" fill="#e9b866" /><Line yAxisId="ebitda" type="monotone" dataKey="ebitda" stroke="#f0f7f4" strokeWidth={2.5} dot={{ fill: '#f0f7f4', r: 3, strokeWidth: 0 }} /></ComposedChart></ResponsiveContainer></div>
             <div className="mt-3 grid grid-cols-4 gap-2 border-t border-[var(--line)] pt-4 text-[10px] text-[#728087]"><span><i className="mr-2 inline-block h-2 w-2 bg-[var(--green)]" />Ditto revenue</span><span><i className="mr-2 inline-block h-2 w-2 bg-[var(--cyan)]" />CoverGrid revenue</span><span><i className="mr-2 inline-block h-2 w-2 bg-[var(--amber)]" />Extra revenue</span><span><i className="mr-2 inline-block h-2 w-2 bg-[#f0f7f4]" />Operating earnings</span></div>
          </div>
        </div>
      </div>
    </section>
  );
}

function NextSteps() {
  const actions = [
    'Reject the three-year founder-control clause in the current non-binding offer.',
    'Issue a revised offer keeping the 30% equity and ₹25 Cr cash, with a 12-month performance period tied to customer satisfaction.',
    'Begin the first fact-finding review, focusing on CoverGrid’s security systems and past sales and claims disputes.',
  ];
  return (
    <section id="next-steps" className="section-shell footer-grid" data-section="next-steps">
      <div className="page-frame">
        <SectionHeader number="13" kicker="What happens next" title="Turn the recommendation into a clear offer." lede="Three actions make the opportunity concrete without giving up Ditto’s standards." />
        <div className="mt-16 grid gap-0 border-y border-[var(--line)]">{actions.map((action, index) => <div key={action} className="flex gap-7 border-b border-[var(--line)] py-7 last:border-0"><div className="mono pt-1 text-sm text-[var(--green)]">0{index + 1}</div><p className="max-w-[760px] font-[var(--app-font-serif)] text-2xl leading-[1.15] tracking-[-.03em] text-[#dce9e3]">{action}</p></div>)}</div>
         <div className="mt-20 flex flex-col justify-between gap-8 border-t border-[var(--green)] pt-7 md:flex-row md:items-start"><div><div className="eyebrow text-[var(--green)]">Recommendation</div><div className="mt-4 font-[var(--app-font-serif)] text-4xl tracking-[-.05em] text-[#e5f1eb]">Proceed — with clear standards.</div></div><div className="max-w-[350px] text-sm leading-7 text-[#879692]">The opportunity is direct access to a large workplace audience. The condition is simple: the combined business must give advice the Ditto way.</div></div>
         <footer className="mt-32 flex flex-col justify-between gap-4 border-t border-[var(--line)] pt-5 text-[10px] uppercase tracking-[.12em] text-[#65747b] md:flex-row"><span>Merger Brief: Ditto × CoverGrid / Confidential</span><span>Strategy review · FY26 case study</span></footer>
      </div>
    </section>
  );
}

function Nav({ active, onNavigate }: { active: SectionId; onNavigate: (id: SectionId) => void }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <aside className="nav-rail">
      <div className="nav-brand flex h-28 items-center gap-3 border-b border-[var(--line)] px-6"><div className="flex h-8 w-8 items-center justify-center border border-[var(--green)] text-[var(--green)]"><span className="font-[var(--app-font-serif)] text-lg">D</span></div><div className="nav-brand-copy"><div className="text-[10px] font-semibold leading-4 tracking-[.05em] text-[#dce9e3]">Merger Brief:</div><div className="text-[10px] font-semibold leading-4 tracking-[.03em] text-[#dce9e3]">Ditto <span className="text-[var(--green)]">×</span> CoverGrid</div><div className="mt-1 mono text-[9px] text-[#6d7b82]">STRATEGY REVIEW / 01</div></div><button className="ml-auto hidden text-[#879792]" onClick={() => setMobileOpen(!mobileOpen)} data-testid="button-toggle-nav"><Menu size={17} /></button></div>
      <div className={`nav-links py-7 ${mobileOpen ? 'block' : ''}`}>{navItems.map(({ id, label, icon: Icon }) => <button key={id} className={`nav-link ${active === id ? 'active' : ''}`} onClick={() => { onNavigate(id); setMobileOpen(false); }} data-testid={`link-nav-${id}`}><Icon size={14} strokeWidth={1.4} /><span>{label}</span></button>)}</div>
      <div className="nav-caption absolute bottom-7 left-6 right-6 border-t border-[var(--line)] pt-4 text-[9px] leading-5 text-[#617078]">Source of truth<br />Full content / FY26 case</div>
    </aside>
  );
}

function App() {
  const [active, setActive] = useState<SectionId>('summary');
  useEffect(() => {
    const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('is-visible'); }), { threshold: 0.12 });
    const sectionObserver = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) setActive(entry.target.getAttribute('data-section') as SectionId); }), { rootMargin: '-25% 0px -60% 0px' });
    document.querySelectorAll('[data-reveal]').forEach(node => revealObserver.observe(node));
    document.querySelectorAll('[data-section]').forEach(node => sectionObserver.observe(node));
    return () => { revealObserver.disconnect(); sectionObserver.disconnect(); };
  }, []);
  const onNavigate = (id: SectionId) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  return (
    <div className="app-shell grain">
      <Nav active={active} onNavigate={onNavigate} />
      <main className="main-content">
        <Hero onNavigate={onNavigate} />
        <ExecutiveSummary />
        <Rationale />
        <Comparables />
        <Financials />
        <ProForma />
        <Synergy />
        <Valuation />
        <DecisionMatrix />
        <Risks />
        <Roadmap />
        <RedLines />
        <Simulator />
        <NextSteps />
      </main>
    </div>
  );
}

export default App;