import { useTheme } from "../context/ThemeContext";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  duration: number;
  delay: number;
}

const PARTICLES: Particle[] = Array.from({ length: 25 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 3 + 1,
  color: i % 2 === 0 ? "rgba(0,255,255,0.7)" : "rgba(195,98,255,0.7)",
  duration: Math.random() * 6 + 3,
  delay: Math.random() * 4,
}));

export default function AnimatedBackground() {
  const { theme } = useTheme();

  if (theme === "light") {
    return (
      <div
        className="fixed inset-0 overflow-hidden pointer-events-none"
        style={{ zIndex: -1 }}
        aria-hidden="true"
      >
        {/* Pink blob */}
        <div
          className="absolute w-[600px] h-[600px] rounded-full blur-[120px] opacity-40 animate-blob-1"
          style={{
            background: "radial-gradient(circle, #FF7AAE, #FFB3D1)",
            top: "-10%",
            left: "-5%",
          }}
        />
        {/* Purple blob */}
        <div
          className="absolute w-[500px] h-[500px] rounded-full blur-[100px] opacity-35 animate-blob-2"
          style={{
            background: "radial-gradient(circle, #A259FF, #D9C3F7)",
            top: "40%",
            right: "-10%",
          }}
        />
        {/* Peach blob */}
        <div
          className="absolute w-[400px] h-[400px] rounded-full blur-[100px] opacity-30 animate-blob-3"
          style={{
            background: "radial-gradient(circle, #FFD4A3, #FFB3D1)",
            bottom: "-10%",
            left: "25%",
          }}
        />
        {/* Lavender blob */}
        <div
          className="absolute w-[350px] h-[350px] rounded-full blur-[90px] opacity-25"
          style={{
            background: "radial-gradient(circle, #D9C3F7, #C4B5FD)",
            top: "20%",
            left: "40%",
            animation: "blob-drift-2 20s ease-in-out infinite 5s",
          }}
        />
        {/* Small pink blob */}
        <div
          className="absolute w-[250px] h-[250px] rounded-full blur-[80px] opacity-30"
          style={{
            background: "radial-gradient(circle, #FF7AAE, #FFC0D5)",
            bottom: "15%",
            right: "20%",
            animation: "blob-drift-1 24s ease-in-out infinite 2s",
          }}
        />
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: -1 }}
      aria-hidden="true"
    >
      {/* Large neon orbs */}
      <div
        className="absolute w-[700px] h-[700px] rounded-full blur-[160px] opacity-15 animate-blob-1"
        style={{
          background: "radial-gradient(circle, #00FFFF, transparent)",
          top: "-15%",
          left: "-10%",
        }}
      />
      <div
        className="absolute w-[600px] h-[600px] rounded-full blur-[140px] opacity-12 animate-blob-2"
        style={{
          background: "radial-gradient(circle, #C362FF, transparent)",
          bottom: "-15%",
          right: "-10%",
        }}
      />
      <div
        className="absolute w-[400px] h-[400px] rounded-full blur-[120px] opacity-10 animate-blob-3"
        style={{
          background: "radial-gradient(circle, #00FFFF, #C362FF, transparent)",
          top: "30%",
          left: "35%",
        }}
      />

      {/* Floating particles */}
      {PARTICLES.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: p.color,
            boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
            animation: `particle-float ${p.duration}s ease-in-out infinite ${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
