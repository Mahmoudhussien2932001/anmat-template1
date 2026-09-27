import { useState } from "react";
import { ArrowLeft, Play, X } from "lucide-react";

export default function Hero() {
  const [videoOpen, setVideoOpen] = useState(false);

  return (
    <section className="hero section-full" id="home">
      <div className="hero-copy">
        <div className="hero-copy-inner">
          <p className="eyebrow">من الفكرة إلى الامتداد</p>
          <h1>
            تمكين العلامات التجارية
            <br />
            لتنمو عبر <span className="gold-line">الامتياز التجاري</span>
          </h1>
          <p className="hero-lead">
            في FranchiseME، نحول الطموح إلى فرص حقيقية للنمو من خلال حلول
            متكاملة وعملية لتطوير أنظمة الامتياز التجاري في السعودية والمنطقة.
          </p>
          <div className="hero-actions">
            <a className="btn btn-gold" href="#contact">
              ابدأ رحلتك معنا
              <ArrowLeft size={16} />
            </a>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => setVideoOpen(true)}
            >
              شاهد الفيديو
              <span className="play-bubble" aria-hidden="true">
                <Play size={12} fill="currentColor" />
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="hero-media">
        <img
          src="/images/hero-riyadh.jpg"
          alt="أفق الرياض مع عبارة: فرص أكبر لنمو أوسع في المملكة"
        />
      </div>

      {videoOpen && (
        <div
          className="video-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="video-title"
        >
          <button
            type="button"
            className="video-backdrop"
            aria-label="إغلاق الفيديو"
            onClick={() => setVideoOpen(false)}
          />
          <div className="video-card">
            <button
              type="button"
              className="video-close"
              aria-label="إغلاق"
              onClick={() => setVideoOpen(false)}
            >
              <X size={18} />
            </button>
            <h2 id="video-title">شاهد الفيديو</h2>
            <p>
              فيديو تعريفي عن رحلة FranchiseME في تمكين العلامات التجارية عبر
              الامتياز التجاري. يمكن استبداله برابط الفيديو لاحقاً.
            </p>
            <a className="btn btn-gold" href="#contact" onClick={() => setVideoOpen(false)}>
              تواصل معنا
              <ArrowLeft size={16} />
            </a>
          </div>
        </div>
      )}
    </section>
  );
}
