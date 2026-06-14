import { useEffect, useRef } from "react";

export default function NeuralBg() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let W,
      H,
      nodes = [],
      pulses = [],
      pulseTimer = 0;
    let animationId;

    const COLORS = ["#e63c1e", "#cc4e2a", "#d4730a", "#e8a020", "#f0c040"];

    function hexToRgb(hex) {
      return {
        r: parseInt(hex.slice(1, 3), 16),
        g: parseInt(hex.slice(3, 5), 16),
        b: parseInt(hex.slice(5, 7), 16),
      };
    }

    function init() {
      nodes = [];
      pulses = [];
      const count = 48;
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const spd = 0.12 + Math.random() * 0.18;
        nodes.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: Math.cos(angle) * spd,
          vy: Math.sin(angle) * spd,
          r: 1.8 + Math.random() * 2,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          phase: Math.random() * Math.PI * 2,
          phaseSpeed: 0.012 + Math.random() * 0.018,
        });
      }
    }

    function resize() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
      init();
    }

    function spawnPulse(i, j) {
      pulses.push({
        from: i,
        to: j,
        t: 0,
        speed: 0.008 + Math.random() * 0.012,
        color: nodes[i].color,
      });
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      const MAX_DIST = 130;

      // connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MAX_DIST) {
            const alpha = (1 - dist / MAX_DIST) * 0.15;
            const { r, g, b } = hexToRgb(nodes[i].color);
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      // pulses
      pulses = pulses.filter((p) => p.t <= 1);
      for (const p of pulses) {
        const A = nodes[p.from],
          B = nodes[p.to];
        if (!A || !B) continue;
        const x = A.x + (B.x - A.x) * p.t;
        const y = A.y + (B.y - A.y) * p.t;
        const { r, g, b } = hexToRgb(p.color);
        const grd = ctx.createRadialGradient(x, y, 0, x, y, 7);
        grd.addColorStop(0, `rgba(${r},${g},${b},0.7)`);
        grd.addColorStop(0.4, `rgba(${r},${g},${b},0.25)`);
        grd.addColorStop(1, `rgba(${r},${g},${b},0)`);
        ctx.beginPath();
        ctx.arc(x, y, 7, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x, y, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},0.95)`;
        ctx.fill();
        p.t += p.speed;
      }

      // nodes with breathing glow
      for (const n of nodes) {
        n.phase += n.phaseSpeed;
        const breathe = 0.35 + 0.25 * Math.sin(n.phase);
        const { r, g, b } = hexToRgb(n.color);
        const halo = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 5);
        halo.addColorStop(
          0,
          `rgba(${r},${g},${b},${(breathe * 0.4).toFixed(2)})`,
        );
        halo.addColorStop(1, `rgba(${r},${g},${b},0)`);
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * 5, 0, Math.PI * 2);
        ctx.fillStyle = halo;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${breathe.toFixed(2)})`;
        ctx.fill();
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;
      }

      // spawn pulses
      pulseTimer++;
      if (pulseTimer % 18 === 0) {
        const i = Math.floor(Math.random() * nodes.length);
        const candidates = [];
        for (let j = 0; j < nodes.length; j++) {
          if (j === i) continue;
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          if (Math.sqrt(dx * dx + dy * dy) < 130) candidates.push(j);
        }
        if (candidates.length) {
          const j = candidates[Math.floor(Math.random() * candidates.length)];
          spawnPulse(i, j);
        }
      }

      animationId = requestAnimationFrame(draw);
    }

    window.addEventListener("resize", resize);
    resize();
    draw();

    // cleanup — component unmount pe animation band karo
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 0,
        pointerEvents: "none",
        display: "block",
      }}
    />
  );
}
