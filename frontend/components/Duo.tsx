export default function Duo({ size = 120 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className="duo" aria-label="Duo the owl">
      <ellipse cx="50" cy="58" rx="38" ry="34" fill="#58cc02" />
      <path d="M20 30 L32 38 L22 46Z M80 30 L68 38 L78 46Z" fill="#58a700" />
      <ellipse cx="50" cy="72" rx="24" ry="18" fill="#89e219" />
      <circle cx="35" cy="42" r="15" fill="#fff" /><circle cx="65" cy="42" r="15" fill="#fff" />
      <circle cx="38" cy="44" r="6.5" fill="#3c3c3c" /><circle cx="62" cy="44" r="6.5" fill="#3c3c3c" />
      <circle cx="40" cy="42" r="2" fill="#fff" /><circle cx="64" cy="42" r="2" fill="#fff" />
      <path d="M42 54 L58 54 L50 66Z" fill="#ffc800" />
      <ellipse cx="38" cy="92" rx="9" ry="4" fill="#ff9600" /><ellipse cx="62" cy="92" rx="9" ry="4" fill="#ff9600" />
    </svg>
  );
}
