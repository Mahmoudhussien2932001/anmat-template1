import {
  Cog,
  Dumbbell,
  GraduationCap,
  HeartPulse,
  Home,
  Palmtree,
  Settings,
  ShoppingBag,
  UtensilsCrossed,
} from "lucide-react";

const industries = [
  { icon: Palmtree, label: "السياحة والضيافة" },
  { icon: Cog, label: "الخدمات التجارية" },
  { icon: Settings, label: "الخدمات المهنية" },
  { icon: Home, label: "العقار والمقاولات" },
  { icon: GraduationCap, label: "التعليم والتدريب" },
  { icon: ShoppingBag, label: "التجزئة" },
  { icon: UtensilsCrossed, label: "الأغذية والمشروبات" },
  { icon: Dumbbell, label: "اللياقة والعافية" },
  { icon: HeartPulse, label: "الرعاية الصحية" },
];

export default function Industries() {
  return (
    <section className="industries section-full" id="industries">
      <div className="industries-inner reveal">
        <div className="industries-head">
          <p className="eyebrow">القطاعات</p>
          <h2 className="section-title">القطاعات التي نعمل معها</h2>
          <p>
            نخدم مجموعة واسعة من القطاعات ذات الإمكانات العالية للنمو عبر
            الامتياز التجاري
          </p>
        </div>
        <div className="industries-grid">
          {industries.map(({ icon: Icon, label }) => (
            <article className="industry" key={label}>
              <Icon strokeWidth={1.5} />
              <p>{label}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
