import React, { useEffect, useRef } from 'react';
import { useThemeStore } from "../store/useThemeStore";

const AuthImagePattern = () => {
  const canvasRef = useRef(null);
  // Use a ref for mouse position to avoid unnecessary re-renders
  const mousePositionRef = useRef({ x: 0, y: 0 });
  
  // Get the current theme from your theme store
  const { theme } = useThemeStore();

  // Mapping from theme names to background colors
  const themeBackgroundMapping = {
    light: "#ffffff",
    dark: "#1e2329",
    cupcake: "#fce7f3",
    bumblebee: "#fef3c7",
    emerald: "#d1fae5",
    corporate: "#f3f4f6",
    synthwave: "#0d0d0d",
    retro: "#f9fafb",
    cyberpunk: "#1f2937",
    valentine: "#fce7f3",
    halloween: "#f87171",
    garden: "#bbf7d0",
    forest: "#a7f3d0",
    aqua: "#cffafe",
    lofi: "#e0f2fe",
    pastel: "#fdfd96",
    fantasy: "#f5e0dc",
    wireframe: "#e2e8f0",
    black: "#000000",
    luxury: "#f3f4f6",
    dracula: "#282a36",
    cmyk: "#f9fafb",
    autumn: "#fef9c3",
    business: "#f3f4f6",
    acid: "#d1fae5",
    lemonade: "#fef08a",
    night: "#1e293b",
    coffee: "#f3e9d2",
    winter: "#e0e7ff",
    dim: "#f3f4f6",
    nord: "#eceff4",
    sunset: "#fdba74",
  };

  // Fallback background color if the theme is not found in our mapping
  const backgroundColor = themeBackgroundMapping[theme] || 'rgba(30, 35, 41, 1)';

  // Determine text color: simple approach where a list of dark themes uses white text.
  const darkThemes = ["dark", "dracula", "nord", "night", "black"];
  const textColorClass = darkThemes.includes(theme) ? "text-white" : "text-black";

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    const particles = [];
    let objects = [];

    const dpr = window.devicePixelRatio || 1;

    // Set canvas size
    const setCanvasSize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
    };
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    // Define an array of hues for multiple colors (electro look)
    const hues = [200, 260, 320, 20, 80];

    // Initialize particles with multiple color hues
    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: 2 + Math.random() * 3,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        hue: hues[Math.floor(Math.random() * hues.length)],
      });
    }

    // Isometric Object Class
    class IsometricObject {
      constructor() {
        this.reset();
        this.x = Math.random() * (canvas.width / dpr);
        this.y = Math.random() * (canvas.height / dpr);
        this.z = Math.random() * 200;
      }

      reset() {
        this.x = -100 + Math.random() * (canvas.width / dpr + 200);
        this.y = -100 + Math.random() * (canvas.height / dpr + 200);
        this.z = Math.random() * 200;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.vz = (Math.random() - 0.5) * 0.5;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.02;
        this.size = 20 + Math.random() * 30;
        this.color = ['#6B46C1', '#4299E1', '#38B2AC', '#ECC94B'][Math.floor(Math.random() * 4)];
        this.type = Math.random() > 0.5 ? 0 : 1;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.z += this.vz;
        this.rotation += this.rotationSpeed;
        if (
          this.x < -100 ||
          this.x > canvas.width / dpr + 100 ||
          this.y < -100 ||
          this.y > canvas.height / dpr + 100 ||
          this.z < 0 ||
          this.z > 300
        ) {
          this.reset();
        }
      }

      draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        const isoScale = 1 - this.z / 1000;
        ctx.scale(isoScale, isoScale);
        // Add subtle shadow for a nicer look
        ctx.shadowColor = "rgba(0, 0, 0, 0.25)";
        ctx.shadowBlur = 4;
        if (this.type === 0) {
          this.drawCube(ctx);
        } else {
          this.drawRectangle(ctx);
        }
        ctx.restore();
      }

      drawCube(ctx) {
        const s = this.size;
        ctx.fillStyle = this.color;
        ctx.globalAlpha = 0.8;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(s * Math.cos(Math.PI / 6), -s * Math.sin(Math.PI / 6));
        ctx.lineTo(s * Math.cos(Math.PI / 6), -s * (1 + Math.sin(Math.PI / 6)));
        ctx.lineTo(0, -s);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = this.lightenColor(this.color, 20);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -s);
        ctx.lineTo(-s * Math.cos(Math.PI / 6), -s * (1 + Math.sin(Math.PI / 6)));
        ctx.lineTo(-s * Math.cos(Math.PI / 6), -s * Math.sin(Math.PI / 6));
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = this.darkenColor(this.color, 20);
        ctx.beginPath();
        ctx.moveTo(0, -s);
        ctx.lineTo(s * Math.cos(Math.PI / 6), -s * (1 + Math.sin(Math.PI / 6)));
        ctx.lineTo(0, -s * (1 + 2 * Math.sin(Math.PI / 6)));
        ctx.lineTo(-s * Math.cos(Math.PI / 6), -s * (1 + Math.sin(Math.PI / 6)));
        ctx.closePath();
        ctx.fill();
      }

      drawRectangle(ctx) {
        const s = this.size;
        ctx.fillStyle = this.color;
        ctx.globalAlpha = 0.8;
        ctx.beginPath();
        ctx.moveTo(-s / 2, -s / 2);
        ctx.lineTo(s / 2, -s / 2);
        ctx.lineTo(s / 2, s / 2);
        ctx.lineTo(-s / 2, s / 2);
        ctx.closePath();
        ctx.fill();
      }

      lightenColor(color, percent) {
        const num = parseInt(color.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        let R = (num >> 16) + amt;
        let G = ((num >> 8) & 0x00ff) + amt;
        let B = (num & 0x0000ff) + amt;
        R = R > 255 ? 255 : R;
        G = G > 255 ? 255 : G;
        B = B > 255 ? 255 : B;
        return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B)
          .toString(16)
          .slice(1)}`;
      }

      darkenColor(color, percent) {
        const num = parseInt(color.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        let R = (num >> 16) - amt;
        let G = ((num >> 8) & 0x00ff) - amt;
        let B = (num & 0x0000ff) - amt;
        R = R < 0 ? 0 : R;
        G = G < 0 ? 0 : G;
        B = B < 0 ? 0 : B;
        return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B)
          .toString(16)
          .slice(1)}`;
      }
    }

    // Reduce the number of isometric objects by 1/4th (from 30 to ~22)
    objects = Array.from({ length: 22 }, () => new IsometricObject());

    // Animation Loop
    const animate = () => {
      // Clear canvas with the theme-based background color
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, canvas.width / dpr, canvas.height / dpr);

      // Animate particles
      particles.forEach((particle, i) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        // Use the mouse position from our ref
        const dx = mousePositionRef.current.x - particle.x;
        const dy = mousePositionRef.current.y - particle.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          particle.x += (dx / dist) * 8;
          particle.y += (dy / dist) * 8;
        }

        // Draw only the central dot (no halo)
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = `hsl(${particle.hue}, 100%, 70%)`;
        ctx.fill();

        // Draw connecting lines between particles
        particles.forEach((other, j) => {
          if (i === j) return;
          const dxLine = other.x - particle.x;
          const dyLine = other.y - particle.y;
          const distLine = Math.sqrt(dxLine * dxLine + dyLine * dyLine);
          if (distLine < 100) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = `hsla(${particle.hue}, 100%, 70%, ${1 - distLine / 100})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        });
      });

      // Update and draw isometric objects (sorted by depth)
      objects.sort((a, b) => b.z - a.z);
      objects.forEach((obj) => {
        obj.update();
        obj.draw(ctx);
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    // Mouse move handler
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mousePositionRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    animationFrameId = requestAnimationFrame(animate);

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', setCanvasSize);
    };
  }, [theme]); // Re-run effect when theme changes

  return (
    <div className="relative h-full w-full">
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 z-0 w-full h-full"
      ></canvas>
      <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 text-center ${textColorClass}`}>
        <h1 className="text-5xl font-bold">Let's Chat!</h1>
        <p className="mt-4 text-2xl">Your words bring out the magic</p>
      </div>
    </div>
  );
};

export default AuthImagePattern;













//with slow down effect:
/* 
import React, { useEffect, useRef } from 'react';
import { useThemeStore } from "../store/useThemeStore";

// Helper: Convert a hex color (e.g. "#ffffff") to an rgba string with the given alpha.
const hexToRgba = (hex, alpha = 0.3) => {
  // Remove the leading '#' if present
  hex = hex.replace(/^#/, "");
  // Parse r, g, b values
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const AuthImagePattern = () => {
  const canvasRef = useRef(null);
  const mousePositionRef = useRef({ x: 0, y: 0 });
  
  // Get the current theme from your theme store
  const { theme } = useThemeStore();

  // Mapping from theme names to background colors
  const themeBackgroundMapping = {
    light: "#ffffff",
    dark: "#1e2329",
    cupcake: "#fce7f3",
    bumblebee: "#fef3c7",
    emerald: "#d1fae5",
    corporate: "#f3f4f6",
    synthwave: "#0d0d0d",
    retro: "#f9fafb",
    cyberpunk: "#1f2937",
    valentine: "#fce7f3",
    halloween: "#f87171",
    garden: "#bbf7d0",
    forest: "#a7f3d0",
    aqua: "#cffafe",
    lofi: "#e0f2fe",
    pastel: "#fdfd96",
    fantasy: "#f5e0dc",
    wireframe: "#e2e8f0",
    black: "#000000",
    luxury: "#f3f4f6",
    dracula: "#282a36",
    cmyk: "#f9fafb",
    autumn: "#fef9c3",
    business: "#f3f4f6",
    acid: "#d1fae5",
    lemonade: "#fef08a",
    night: "#1e293b",
    coffee: "#f3e9d2",
    winter: "#e0e7ff",
    dim: "#f3f4f6",
    nord: "#eceff4",
    sunset: "#fdba74",
  };

  // Fallback background color if the theme is not found in our mapping
  const backgroundColor = themeBackgroundMapping[theme] || '#1e2329';
  
  // Use a transparent version of the background color for the canvas clear
  const transparentBackground = hexToRgba(backgroundColor, 0.15);

  // Determine text color for overlay: use white for dark themes, black otherwise.
  const darkThemes = ["dark", "dracula", "nord", "night", "black"];
  const textColorClass = darkThemes.includes(theme) ? "text-white" : "text-black";

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    const particles = [];
    let objects = [];

    const dpr = window.devicePixelRatio || 1;

    // Set canvas size
    const setCanvasSize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
    };
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    // Array of hues for particle colors
    const hues = [200, 260, 320, 20, 80];

    // Initialize particles
    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: 2 + Math.random() * 3,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        hue: hues[Math.floor(Math.random() * hues.length)],
      });
    }

    // Isometric Object Class (boxes/rectangles)
    class IsometricObject {
      constructor() {
        this.reset();
        this.x = Math.random() * (canvas.width / dpr);
        this.y = Math.random() * (canvas.height / dpr);
        this.z = Math.random() * 200;
      }

      reset() {
        this.x = -100 + Math.random() * (canvas.width / dpr + 200);
        this.y = -100 + Math.random() * (canvas.height / dpr + 200);
        this.z = Math.random() * 200;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.vz = (Math.random() - 0.5) * 0.5;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.02;
        this.size = 20 + Math.random() * 30;
        this.color = ['#6B46C1', '#4299E1', '#38B2AC', '#ECC94B'][Math.floor(Math.random() * 4)];
        this.type = Math.random() > 0.5 ? 0 : 1;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.z += this.vz;
        this.rotation += this.rotationSpeed;
        if (
          this.x < -100 ||
          this.x > canvas.width / dpr + 100 ||
          this.y < -100 ||
          this.y > canvas.height / dpr + 100 ||
          this.z < 0 ||
          this.z > 300
        ) {
          this.reset();
        }
      }

      draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        const isoScale = 1 - this.z / 1000;
        ctx.scale(isoScale, isoScale);
        // Subtle shadow for refinement
        ctx.shadowColor = "rgba(0, 0, 0, 0.15)";
        ctx.shadowBlur = 3;
        if (this.type === 0) {
          this.drawCube(ctx);
        } else {
          this.drawRectangle(ctx);
        }
        ctx.restore();
      }

      drawCube(ctx) {
        const s = this.size;
        ctx.fillStyle = this.color;
        ctx.globalAlpha = 0.8;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(s * Math.cos(Math.PI / 6), -s * Math.sin(Math.PI / 6));
        ctx.lineTo(s * Math.cos(Math.PI / 6), -s * (1 + Math.sin(Math.PI / 6)));
        ctx.lineTo(0, -s);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = this.lightenColor(this.color, 20);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -s);
        ctx.lineTo(-s * Math.cos(Math.PI / 6), -s * (1 + Math.sin(Math.PI / 6)));
        ctx.lineTo(-s * Math.cos(Math.PI / 6), -s * Math.sin(Math.PI / 6));
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = this.darkenColor(this.color, 20);
        ctx.beginPath();
        ctx.moveTo(0, -s);
        ctx.lineTo(s * Math.cos(Math.PI / 6), -s * (1 + Math.sin(Math.PI / 6)));
        ctx.lineTo(0, -s * (1 + 2 * Math.sin(Math.PI / 6)));
        ctx.lineTo(-s * Math.cos(Math.PI / 6), -s * (1 + Math.sin(Math.PI / 6)));
        ctx.closePath();
        ctx.fill();
      }

      drawRectangle(ctx) {
        const s = this.size;
        ctx.fillStyle = this.color;
        ctx.globalAlpha = 0.8;
        ctx.beginPath();
        ctx.moveTo(-s / 2, -s / 2);
        ctx.lineTo(s / 2, -s / 2);
        ctx.lineTo(s / 2, s / 2);
        ctx.lineTo(-s / 2, s / 2);
        ctx.closePath();
        ctx.fill();
      }

      lightenColor(color, percent) {
        const num = parseInt(color.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        let R = (num >> 16) + amt;
        let G = ((num >> 8) & 0x00ff) + amt;
        let B = (num & 0x0000ff) + amt;
        R = R > 255 ? 255 : R;
        G = G > 255 ? 255 : G;
        B = B > 255 ? 255 : B;
        return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B)
          .toString(16)
          .slice(1)}`;
      }

      darkenColor(color, percent) {
        const num = parseInt(color.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        let R = (num >> 16) - amt;
        let G = ((num >> 8) & 0x00ff) - amt;
        let B = (num & 0x0000ff) - amt;
        R = R < 0 ? 0 : R;
        G = G < 0 ? 0 : G;
        B = B < 0 ? 0 : B;
        return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B)
          .toString(16)
          .slice(1)}`;
      }
    }

    // Reduce the number of isometric objects by about 25% (from 30 to 22)
    objects = Array.from({ length: 22 }, () => new IsometricObject());

    // Animation Loop
    const animate = () => {
      // Clear canvas with our semi-transparent background color
      ctx.fillStyle = transparentBackground;
      ctx.fillRect(0, 0, canvas.width / dpr, canvas.height / dpr);

      // Animate particles
      particles.forEach((particle, i) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        const dx = mousePositionRef.current.x - particle.x;
        const dy = mousePositionRef.current.y - particle.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          particle.x += (dx / dist) * 8;
          particle.y += (dy / dist) * 8;
        }

        // Draw only the central dot (no halo)
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = `hsl(${particle.hue}, 100%, 70%)`;
        ctx.fill();

        // Draw connecting lines between particles
        particles.forEach((other, j) => {
          if (i === j) return;
          const dxLine = other.x - particle.x;
          const dyLine = other.y - particle.y;
          const distLine = Math.sqrt(dxLine * dxLine + dyLine * dyLine);
          if (distLine < 100) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = `hsla(${particle.hue}, 100%, 70%, ${1 - distLine / 100})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        });
      });

      // Update and draw isometric objects (sorted by depth)
      objects.sort((a, b) => b.z - a.z);
      objects.forEach((obj) => {
        obj.update();
        obj.draw(ctx);
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mousePositionRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', setCanvasSize);
    };
  }, [theme]);

  return (
    <div className="relative h-full w-full">
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 z-0 w-full h-full"
      ></canvas>
      <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 text-center ${textColorClass}`}>
        <h1 className="text-5xl font-bold">Let's Chat!</h1>
        <p className="mt-4 text-2xl">Your words bring out the magic</p>
      </div>
    </div>
  );
};

export default AuthImagePattern;
 */