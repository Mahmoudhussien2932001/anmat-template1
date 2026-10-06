export default function AudienceSwitch({ audience, onChange }) {
  return (
    <div className="audience-switch" role="group" aria-label="اختر مسارك">
      <button type="button" aria-pressed={audience === 'franchisor'} onClick={() => onChange('franchisor')}>
        أنا مانح امتياز
      </button>
      <button type="button" aria-pressed={audience === 'investor'} onClick={() => onChange('investor')}>
        أنا مستثمر
      </button>
    </div>
  )
}
