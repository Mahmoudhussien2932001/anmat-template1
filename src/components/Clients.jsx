const clients = [
  "alamar",
  "LUCID",
  "barn's",
  "careem",
  "SPL",
  "ساتورب",
  "المراعي",
  "سينومي",
];

export default function Clients() {
  return (
    <section className="clients section-full" id="success">
      <div id="articles" className="anchor" />
      <div className="clients-inner reveal">
        <div className="clients-head">
          <p className="eyebrow">يثق بنا</p>
          <h2>شركاء في النجاح</h2>
        </div>
        <div className="client-row" aria-label="شعارات الشركاء">
          {clients.map((name) => (
            <span className="client-logo" key={name}>
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
