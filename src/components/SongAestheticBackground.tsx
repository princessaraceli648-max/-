/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';

interface BackgroundProps {
  skin: string; // 'celadon' | 'ink' | 'palace' | 'sunset' | 'bamboo' | 'lavender'
  trail: string; // 'trail_spark' | 'trail_ink' | 'trail_petal' | 'trail_leaf' | 'trail_bubble' | 'trail_flicker'
}

export const SongAestheticBackground: React.FC<BackgroundProps> = ({ skin, trail }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    // Dynamic resize handler
    const handleResize = () => {
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle class for atmospheric effects
    class AestheticParticle {
      x: number = 0;
      y: number = 0;
      size: number = 0;
      speedX: number = 0;
      speedY: number = 0;
      opacity: number = 0;
      color: string = '';
      sinVal: number = 0;
      sinSpeed: number = 0;

      constructor() {
        this.reset(true);
      }

      reset(init = false) {
        this.x = Math.random() * width;
        this.y = init ? Math.random() * height : -10;
        this.size = Math.random() * 3 + 1.2;
        this.speedX = Math.random() * 0.4 - 0.2;
        this.speedY = Math.random() * 0.5 + 0.2;
        this.opacity = Math.random() * 0.4 + 0.1;
        this.sinVal = Math.random() * 100;
        this.sinSpeed = Math.random() * 0.02 + 0.005;

        // Set colors based on chosen skin
        if (skin === 'celadon') {
          // Celestial green petals or dew dust
          this.color = `rgba(${111 + Math.floor(Math.random() * 30)}, ${143 + Math.floor(Math.random() * 15)}, ${114 + Math.floor(Math.random() * 20)}, `;
        } else if (skin === 'ink') {
          // Charcoal dilute ink spots
          this.color = `rgba(${47 + Math.floor(Math.random() * 10)}, ${47 + Math.floor(Math.random() * 10)}, ${47 + Math.floor(Math.random() * 10)}, `;
          this.size = Math.random() * 6 + 2; // Dilute ink blobs are larger
        } else if (skin === 'palace') {
          // Palace: Gold imperial sparks
          this.color = `rgba(${200 + Math.floor(Math.random() * 50)}, ${165 + Math.floor(Math.random() * 40)}, ${90 + Math.floor(Math.random() * 30)}, `;
        } else if (skin === 'sunset') {
          // Crimson and soft pink particles
          this.color = `rgba(${225 + Math.floor(Math.random() * 30)}, ${120 + Math.floor(Math.random() * 40)}, ${120 + Math.floor(Math.random() * 40)}, `;
        } else if (skin === 'bamboo') {
          // Warm bamboo green and yellow leaves
          this.color = `rgba(${40 + Math.floor(Math.random() * 40)}, ${140 + Math.floor(Math.random() * 30)}, ${70 + Math.floor(Math.random() * 30)}, `;
        } else if (skin === 'lavender') {
          // Twilight lavender stars
          this.color = `rgba(${130 + Math.floor(Math.random() * 40)}, ${100 + Math.floor(Math.random() * 45)}, ${190 + Math.floor(Math.random() * 45)}, `;
        } else {
          this.color = 'rgba(100, 100, 100, ';
        }
      }

      update() {
        this.y += this.speedY;
        this.sinVal += this.sinSpeed;
        this.x += this.speedX + Math.sin(this.sinVal) * 0.25;

        if (this.y > height || this.x < -10 || this.x > width + 10) {
          this.reset(false);
        }
      }

      draw(c: CanvasRenderingContext2D) {
        c.beginPath();
        if (skin === 'ink') {
          // Soft watercolor ink drops
          c.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          const radGrad = c.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
          radGrad.addColorStop(0, this.color + this.opacity + ')');
          radGrad.addColorStop(1, this.color + '0)');
          c.fillStyle = radGrad;
        } else {
          c.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          c.fillStyle = this.color + this.opacity + ')';
        }
        c.fill();
      }
    }

    const particles: AestheticParticle[] = Array.from({ length: 40 }, () => new AestheticParticle());

    // Mouse Trail effect implementation
    class TrailParticle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      maxLife: number;
      life: number;
      color: string;
      angle: number;
      spin: number;

      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 1.2;
        this.vy = (Math.random() - 0.5) * 1.2;
        
        const isInk = trail === 'trail_ink';
        this.size = Math.random() * 5 + (isInk ? 6 : 3);
        this.maxLife = Math.random() * 20 + 20; // 20 - 40 frames
        this.life = this.maxLife;
        this.angle = Math.random() * Math.PI * 2;
        this.spin = (Math.random() - 0.5) * 0.04;

        if (trail === 'trail_spark') {
          // Shimmering gold leaf dust
          this.color = `rgba(${225 + Math.floor(Math.random() * 30)}, ${185 + Math.floor(Math.random() * 30)}, ${105 + Math.floor(Math.random() * 25)}, `;
        } else if (trail === 'trail_ink') {
          // Dilute charcoal ink wash
          this.color = `rgba(${40 + Math.floor(Math.random() * 10)}, ${40 + Math.floor(Math.random() * 10)}, ${40 + Math.floor(Math.random() * 10)}, `;
        } else if (trail === 'trail_petal') {
          // Spring peach blossom petals
          this.color = `rgba(${240 + Math.floor(Math.random() * 15)}, ${130 + Math.floor(Math.random() * 25)}, ${145 + Math.floor(Math.random() * 25)}, `;
        } else if (trail === 'trail_leaf') {
          // Willow / Pines deep emerald green
          this.color = `rgba(${70 + Math.floor(Math.random() * 20)}, ${150 + Math.floor(Math.random() * 20)}, ${90 + Math.floor(Math.random() * 20)}, `;
        } else if (trail === 'trail_bubble') {
          // Glazed tea-bowl sky-blue ripples
          this.color = `rgba(${110 + Math.floor(Math.random() * 30)}, ${180 + Math.floor(Math.random() * 35)}, ${170 + Math.floor(Math.random() * 20)}, `;
        } else if (trail === 'trail_flicker') {
          // Royal scholar indigo purple sparks
          this.color = `rgba(${140 + Math.floor(Math.random() * 25)}, ${100 + Math.floor(Math.random() * 25)}, ${190 + Math.floor(Math.random() * 35)}, `;
        } else {
          this.color = `rgba(${111 + Math.floor(Math.random() * 15)}, ${150 + Math.floor(Math.random() * 15)}, ${120 + Math.floor(Math.random() * 15)}, `;
        }
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life--;
        this.angle += this.spin;

        if (trail === 'trail_ink') {
          this.size += 0.35; // Ink spreads in water
          this.vx *= 0.98;
          this.vy *= 0.98;
        } else if (trail === 'trail_spark') {
          this.vy += 0.03; // Gold dust drifts downward
        } else if (trail === 'trail_petal') {
          this.vy += 0.02; // Drifts downward and sways
          this.vx += Math.sin(this.life * 0.1) * 0.06;
        } else if (trail === 'trail_leaf') {
          this.vy += 0.01; // Organic gentle fluttering
          this.vx += Math.sin(this.life * 0.05) * 0.04;
        } else if (trail === 'trail_bubble') {
          this.vy -= 0.04; // Bubbles float upwards!
          this.vx += (Math.random() - 0.5) * 0.1;
        } else if (trail === 'trail_flicker') {
          this.vy -= 0.02; // Mysterious incense fire rising
          this.size *= 0.96; // Shrinks quickly
        }
      }

      draw(c: CanvasRenderingContext2D) {
        const progress = this.life / this.maxLife;
        const alpha = progress * 0.6;
        if (alpha <= 0) return;

        c.save();
        c.translate(this.x, this.y);
        c.rotate(this.angle);

        c.beginPath();
        if (trail === 'trail_ink') {
          // Soft ink wash dot
          const rGrad = c.createRadialGradient(0, 0, 0, 0, 0, this.size);
          rGrad.addColorStop(0, this.color + alpha + ')');
          rGrad.addColorStop(1, this.color + '0)');
          c.fillStyle = rGrad;
          c.arc(0, 0, this.size, 0, Math.PI * 2);
          c.fill();
        } else if (trail === 'trail_petal') {
          // Delicate pink blossom petal
          c.fillStyle = this.color + alpha + ')';
          c.moveTo(0, -this.size);
          c.quadraticCurveTo(this.size * 0.8, -this.size * 0.2, this.size * 0.2, this.size);
          c.quadraticCurveTo(-this.size * 0.6, this.size * 0.4, 0, -this.size);
          c.fill();
        } else if (trail === 'trail_leaf') {
          // Fluid willow leaf outline
          c.fillStyle = this.color + alpha + ')';
          c.moveTo(0, -this.size);
          c.quadraticCurveTo(this.size * 0.6, -this.size * 0.1, 0, this.size);
          c.quadraticCurveTo(-this.size * 0.6, -this.size * 0.1, 0, -this.size);
          c.fill();
        } else if (trail === 'trail_bubble') {
          // Glowing translucent bubble with shiny highlight
          c.strokeStyle = this.color + (alpha * 0.8) + ')';
          c.lineWidth = 1;
          c.arc(0, 0, this.size, 0, Math.PI * 2);
          c.stroke();
          
          c.beginPath();
          c.fillStyle = `rgba(255, 255, 255, ${alpha * 0.95})`;
          c.arc(-this.size * 0.32, -this.size * 0.32, this.size * 0.18, 0, Math.PI * 2);
          c.fill();
        } else if (trail === 'trail_flicker') {
          // Elegant purple incense spirit spark
          const flareGrad = c.createRadialGradient(0, 0, 0, 0, 0, this.size);
          flareGrad.addColorStop(0, `rgba(254, 230, 255, ${alpha})`);
          flareGrad.addColorStop(0.3, this.color + alpha + ')');
          flareGrad.addColorStop(1, 'rgba(92, 45, 145, 0)');
          c.fillStyle = flareGrad;
          c.arc(0, 0, this.size, 0, Math.PI * 2);
          c.fill();
        } else {
          // Shimmering gold diamond flake
          c.fillStyle = this.color + alpha + ')';
          const sz = this.size;
          c.moveTo(0, -sz);
          c.lineTo(sz * 0.7, 0);
          c.lineTo(0, sz);
          c.lineTo(-sz * 0.7, 0);
          c.closePath();
          c.fill();

          // Small shining center spark
          c.beginPath();
          c.fillStyle = `rgba(255, 255, 230, ${alpha * 0.8})`;
          c.arc(0, 0, sz * 0.25, 0, Math.PI * 2);
          c.fill();
        }
        c.restore();
      }
    }

    const trailParticles: TrailParticle[] = [];
    let lastX = 0;
    let lastY = 0;
    let hasMovedYet = false;

    const handlePointerMove = (e: PointerEvent) => {
      const x = e.clientX;
      const y = e.clientY;

      if (!hasMovedYet) {
        lastX = x;
        lastY = y;
        hasMovedYet = true;
        return;
      }

      const dist = Math.hypot(x - lastX, y - lastY);
      if (dist > 5) {
        // Interpolate along the movement path
        const steps = Math.min(Math.floor(dist / 5), 8);
        for (let i = 1; i <= steps; i++) {
          const t = i / steps;
          const px = lastX + (x - lastX) * t;
          const py = lastY + (y - lastY) * t;
          trailParticles.push(new TrailParticle(px, py));
        }
        lastX = x;
        lastY = y;
      }
    };

    const handlePointerDown = (e: PointerEvent) => {
      const x = e.clientX;
      const y = e.clientY;
      const amount = trail === 'trail_ink' ? 8 : 12;
      for (let i = 0; i < amount; i++) {
        const p = new TrailParticle(x, y);
        // Fire particles out in all directions on click
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 2.5 + 1;
        p.vx = Math.cos(angle) * speed;
        p.vy = Math.sin(angle) * speed;
        trailParticles.push(p);
      }
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerdown', handlePointerDown);

    // Main animation loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Background particles
      particles.forEach((p) => {
        p.update();
        p.draw(ctx);
      });

      // Mouse trail particles
      for (let i = trailParticles.length - 1; i >= 0; i--) {
        const p = trailParticles[i];
        p.update();
        p.draw(ctx);
        if (p.life <= 0) {
          trailParticles.splice(i, 1);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      cancelAnimationFrame(animationFrameId);
    };
  }, [skin, trail]);

  // Skin styling classes mapping
  const skinBgClasses: { [key: string]: string } = {
    celadon: 'bg-gradient-to-b from-[#F2F7F3] via-[#EBF2EC] to-[#DEE8E0] text-[#3E5240]',
    ink: 'bg-gradient-to-b from-[#FAF4EC] via-[#F3EAD9] to-[#E8DCC4] text-[#2F2F2F]',
    palace: 'bg-gradient-to-b from-[#FAF2E6] via-[#F4E6CD] to-[#E9D5B3] text-[#5C462B]',
    sunset: 'bg-gradient-to-b from-[#FFF0E6] via-[#FFE2D1] to-[#FFD0B8] text-[#803810]',
    bamboo: 'bg-gradient-to-b from-[#EEF7EE] via-[#E2F0D9] to-[#CCE6BE] text-[#265313]',
    lavender: 'bg-gradient-to-b from-[#F2E6FF] via-[#EADBFF] to-[#D4C4FC] text-[#532D8C]',
  };

  const activeBg = skinBgClasses[skin] || skinBgClasses.celadon;

  return (
    <div className={`fixed inset-0 -z-20 w-full h-full transition-all duration-1000 overflow-hidden ${activeBg}`}>
      {/* Dynamic particles stage */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none w-full h-full" />

      {/* Decorative Traditional Watermarks */}
      <div className="absolute inset-0 pointer-events-none opacity-5 flex flex-col justify-between p-12 select-none select-none">
        <div className="flex justify-between items-start">
          {/* Classic seal stamp shape decoration */}
          <div className="w-16 h-16 border-2 border-current rounded-sm flex items-center justify-center font-serif text-lg font-bold p-1 leading-none text-center">
            清明
            <br />
            雅集
          </div>
          {/* Traditional cloud pattern representation in corner */}
          <div className="font-serif text-xs tracking-widest writing-vertical-lr text-current">
            汴京繁华 · 盛世风物
          </div>
        </div>

        {/* Minimalist mountain outlines for background atmosphere */}
        <div className="absolute bottom-0 left-0 right-0 h-40 opacity-10 pointer-events-none flex items-end justify-center">
          <svg className="w-full h-full" viewBox="0 0 1440 200" fill="none" preserveAspectRatio="none">
            <path
              d="M0 180 C 150 140, 200 130, 350 160 C 500 190, 600 110, 800 150 C 1000 190, 1100 120, 1250 170 C 1350 200, 1400 190, 1440 180 L 1440 200 L 0 200 Z"
              fill="currentColor"
            />
            <path
              d="M0 200 C 100 110, 300 90, 500 150 C 700 210, 850 140, 1100 160 C 1250 180, 1350 140, 1440 190 L 1440 200 L 0 200 Z"
              fill="currentColor"
              className="opacity-70"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};
