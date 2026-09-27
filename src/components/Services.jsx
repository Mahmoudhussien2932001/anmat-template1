import {
  BarChart3,
  FileText,
  Leaf,
  Lightbulb,
  Settings,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";

const services = [
  { icon: Lightbulb, title: "الاستراتيجية", subtitle: "والفرص" },
  { icon: FileText, title: "تطوير أنظمة", subtitle: "الامتياز التجاري" },
  { icon: Users, title: "دعم الامتياز", subtitle: "والشركاء" },
  { icon: TrendingUp, title: "التوسع والنمو", subtitle: "ودخول الأسواق" },
];

const nodes = [
  { label: "استراتيجية", icon: Target, tone: "teal", angle: 0 },
  { label: "تطوير", icon: FileText, tone: "gold", angle: 60 },
  { label: "تدريب", icon: Users, tone: "gold", angle: 120 },
  { label: "دعم", icon: Settings, tone: "teal", angle: 180 },
  { label: "توسع", icon: BarChart3, tone: "gold", angle: 240 },
  { label: "استدامة", icon: Leaf, tone: "gold", angle: 300 },
];

export default function Services() {
  return (
    <section className="services section-full" id="services">
      <div className="services-layout">
        <div className="model reveal">
          <div className="model-copy">
            <h3>
              حلول 360°
              <br />
              لتطوير الامتياز التجاري
            </h3>
            <p>
              من الاستراتيجية إلى التنفيذ، نقدم دائرة متكاملة تغطي جميع جوانب
              الامتياز التجاري لتحويل طموحاتك إلى واقع قابل للتوسع.
            </p>
          </div>

          <div className="orbit" aria-hidden="false">
            <svg className="orbit-ring" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="31" />
              {nodes.map((node) => {
                const rad = ((node.angle - 90) * Math.PI) / 180;
                const x2 = 50 + Math.cos(rad) * 31;
                const y2 = 50 + Math.sin(rad) * 31;
                return (
                  <line key={node.label} x1="50" y1="50" x2={x2} y2={y2} />
                );
              })}
            </svg>
            <div className="orbit-center">360°</div>
            {nodes.map(({ label, icon: Icon, tone, angle }) => (
              <div
                className={`orbit-node is-${tone}`}
                key={label}
                style={{ "--a": `${angle}deg` }}
              >
                <span>{label}</span>
                <i>
                  <Icon size={16} strokeWidth={1.7} />
                </i>
              </div>
            ))}
          </div>
        </div>

        <div className="services-block reveal">
          <p className="eyebrow">خدماتنا</p>
          <h2 className="section-title">حلول متكاملة لتطوير الامتياز التجاري</h2>
          <div className="services-grid">
            {services.map(({ icon: Icon, title, subtitle }) => (
              <article className="service" key={title}>
                <Icon strokeWidth={1.5} />
                <p>
                  {title}
                  <br />
                  {subtitle}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
