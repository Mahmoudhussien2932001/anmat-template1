export default function GlobeFallback() {
  return (
    <div className="globe-fallback" role="img" aria-label="Earth">
      <img
        className="globe-fallback-image"
        src="/images/globe/earth-fallback.jpg"
        alt=""
        width={1024}
        height={1024}
        decoding="async"
      />
    </div>
  )
}
