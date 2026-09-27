import { ArrowLeft } from "lucide-react";

export default function CTA() {
  return (
    <section className="cta section-full" aria-labelledby="cta-title">
      <div className="cta-layout">
        <div className="cta-visual">
          <img src="/images/cta-building.jpg" alt="واجهة مبنى زجاجي حديث" />
          <p>
            علامتك أقوى
            <br />
            أسواق أوسع
            <br />
            مستقبل أفضل
          </p>
        </div>
        <div className="cta-copy">
          <h2 id="cta-title">
            لنحوّل علامتك التجارية إلى قصة نجاح إقليمية
          </h2>
          <p>
            ابدأ رحلتك مع FranchiseME اليوم، واكتشف كيف يمكن للامتياز التجاري
            أن يفتح لك آفاقاً جديدة للنمو.
          </p>
        </div>
        <a className="btn btn-gold" href="#contact">
          تواصل معنا الآن
          <ArrowLeft size={16} />
        </a>
      </div>
    </section>
  );
}
