const stats = [
  { value: "+100", label: "علامة تجارية تم دعمها" },
  { value: "+10", label: "سنوات من الخبرة" },
  { value: "+6", label: "أسواق إقليمية" },
];

export default function About() {
  return (
    <section className="about section-full" id="about">
      <div className="about-layout">
        <div className="about-copy reveal">
          <p className="eyebrow">من نحن</p>
          <h2 className="section-title">شريكك في تطوير الامتياز التجاري</h2>
          <p>
            FranchiseME هي شركة استشارية متخصصة في تطوير أنظمة الامتياز
            التجاري، نعمل مع رواد الأعمال والشركات الطموحة لتمكين علاماتهم
            التجارية من التوسع محلياً وإقليمياً عبر حلول استراتيجية وعملية
            ومتكاملة.
          </p>
          <div className="stats">
            {stats.map((stat) => (
              <article className="stat" key={stat.value}>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </article>
            ))}
          </div>
        </div>

        <div className="about-media reveal">
          <img
            src="/images/about-office.jpg"
            alt="شعار FranchiseME على جدار المكتب بجانب قاعة اجتماعات زجاجية"
          />
        </div>
      </div>
    </section>
  );
}
