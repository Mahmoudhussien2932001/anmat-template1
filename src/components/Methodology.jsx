import { Calendar, Clock, Users } from "lucide-react";

const steps = [
  { n: "1", tone: "gold", title: "فهم الرؤية", subtitle: "والأهداف" },
  { n: "2", tone: "teal", title: "تحليل الجاهزية", subtitle: "والفرص" },
  { n: "3", tone: "gold", title: "تطوير النظام", subtitle: "والأدلة" },
  { n: "4", tone: "teal", title: "التجهيز", subtitle: "لإطلاق الامتياز" },
  { n: "5", tone: "gold", title: "التوسع", subtitle: "ودعم الامتياز" },
];

const facts = [
  { icon: Calendar, text: "8 - 12 ورشة عمل" },
  { icon: Clock, text: "2 - 3 أشهر" },
  { icon: Users, text: "بمشاركة فريقك" },
];

export default function Methodology() {
  return (
    <section className="methodology section-full" id="methodology">
      <div className="method-layout">
        <article className="workshop reveal">
          <img
            src="/images/workshop-office.jpg"
            alt="ورشة عمل داخل قاعة اجتماعات زجاجية"
          />
          <div className="workshop-copy">
            <h3>نهج قائم على ورش العمل</h3>
            <ul>
              {facts.map(({ icon: Icon, text }) => (
                <li key={text}>
                  <Icon strokeWidth={1.6} />
                  <span>{text}</span>
                </li>
              ))}
            </ul>
            <p>
              نؤمن بالعمل التشاركي من خلال ورش عمل مكثفة وموجهة لتحقيق أفضل
              النتائج.
            </p>
          </div>
        </article>

        <div className="method-steps reveal">
          <p className="eyebrow">منهجيتنا</p>
          <h2 className="section-title">5 خطوات واضحة .. من الرؤية إلى التوسع</h2>
          <ol className="steps">
            {steps.map((step) => (
              <li key={step.n}>
                <span className={`step-num is-${step.tone}`}>{step.n}</span>
                <p>
                  {step.title}
                  <br />
                  {step.subtitle}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
