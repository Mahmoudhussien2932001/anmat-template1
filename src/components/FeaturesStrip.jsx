import { Globe, TrendingUp, Users } from "lucide-react";

const features = [
  { icon: Globe, title: "خبرة إقليمية", subtitle: "وعالمية" },
  { icon: TrendingUp, title: "منهجية مجربة", subtitle: "ونتائج ملموسة" },
  { icon: Users, title: "شريكك في", subtitle: "النمو المستدام" },
];

export default function FeaturesStrip() {
  return (
    <section className="features section-full" aria-label="مزايا FranchiseME">
      <div className="features-row">
        <div className="features-deco" aria-hidden="true">
          <img src="/images/about-office.jpg" alt="" />
        </div>
        <div className="features-items">
          {features.map(({ icon: Icon, title, subtitle }) => (
            <article className="feature" key={title}>
              <Icon className="feature-icon" strokeWidth={1.6} />
              <p>
                {title}
                <br />
                {subtitle}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
