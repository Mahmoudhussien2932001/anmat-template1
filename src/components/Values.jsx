import { Gem, Handshake, Leaf, Users } from "lucide-react";

const values = [
  { icon: Leaf, title: "النمو", subtitle: "المستدام" },
  { icon: Users, title: "تمكين", subtitle: "رواد الأعمال" },
  { icon: Gem, title: "التميز", subtitle: "في التنفيذ" },
  { icon: Handshake, title: "الشراكة", subtitle: "الحقيقية" },
];

export default function Values() {
  return (
    <section className="values section-full" aria-labelledby="values-title">
      <div className="values-layout">
        <figure className="quote reveal">
          <img
            src="/images/mountain-quote.jpg"
            alt="نؤمن بأن كل علامة تجارية تحمل في داخلها فرصة أكبر. — FranchiseME"
          />
        </figure>

        <div className="values-copy reveal">
          <div className="values-copy-inner">
            <p className="eyebrow">قيمنا</p>
            <h2 className="section-title" id="values-title">
              ما نؤمن به
            </h2>
            <div className="values-row">
              {values.map(({ icon: Icon, title, subtitle }) => (
                <article className="value" key={title}>
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
      </div>
    </section>
  );
}
