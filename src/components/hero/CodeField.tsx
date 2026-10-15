import { useEffect, useRef } from "react";
import { codeGlyphs } from "../../data/codeGlyphs";
import styles from "./CodeField.module.css";

const FONT_SIZE = 14;
const LINE_HEIGHT = 22;
const REST_OPACITY = 0.06;
const REVEAL_OPACITY = 0.35;
const REVEAL_RADIUS = 160;
const MIN_SPEED = 10; // pixels per second
const MAX_SPEED = 25;

type Line = {
  text: string;
  halfWidth: number;
  offset: number;
  speed: number;
};

function randomText(length: number) {
  let text = "";
  for (let i = 0; i < length; i++) {
    text += codeGlyphs[Math.floor(Math.random() * codeGlyphs.length)];
  }
  return text;
}

// "#d4a574" -> "rgba(212, 165, 116, 0.35)": canvas gradients need the opacity in the color.
function hexToRgba(hex: string, alpha: number) {
  const color = hex.trim();
  const red = Number.parseInt(color.slice(1, 3), 16);
  const green = Number.parseInt(color.slice(3, 5), 16);
  const blue = Number.parseInt(color.slice(5, 7), 16);
  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

export default function CodeField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const hero = canvas?.closest("section");
    const context = canvas?.getContext("2d");
    if (!canvas || !hero || !context) {
      return;
    }

    const reducedMotion = matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    let lines: Line[] = [];
    let width = 0;
    let height = 0;
    let pointer: { x: number; y: number } | null = null;
    let frame = 0;
    let lastTime = 0;

    // Each line is a random text written twice: once it has moved by half its
    // width, it is reset to 0 and the jump is invisible (same idea as the carousel).
    function setup() {
      if (!canvas || !context) {
        return;
      }
      const ratio = window.devicePixelRatio || 1;
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      if (width === 0 || height === 0) {
        return;
      }
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      context.font = `${FONT_SIZE}px ${getComputedStyle(canvas).fontFamily}`;
      context.textBaseline = "top";

      const charWidth = context.measureText("M").width;
      const length = Math.ceil(width / charWidth) + 1;
      lines = Array.from({ length: Math.ceil(height / LINE_HEIGHT) }, () => {
        const half = randomText(length);
        const halfWidth = context.measureText(half).width;
        return {
          text: half + half,
          halfWidth,
          offset: Math.random() * halfWidth,
          speed: MIN_SPEED + Math.random() * (MAX_SPEED - MIN_SPEED),
        };
      });
      draw();
    }

    function draw() {
      if (!canvas || !context) {
        return;
      }
      const tokens = getComputedStyle(canvas);
      context.clearRect(0, 0, width, height);

      context.fillStyle = hexToRgba(
        tokens.getPropertyValue("--gold"),
        REST_OPACITY,
      );
      lines.forEach((line, index) => {
        context.fillText(line.text, -line.offset, index * LINE_HEIGHT);
      });

      // Second pass, only near the pointer: a radial gradient used as the text
      // color, bright at the pointer and transparent at the edge of the circle.
      const current = pointer;
      if (current) {
        const accent = tokens.getPropertyValue("--accent");
        const gradient = context.createRadialGradient(
          current.x,
          current.y,
          0,
          current.x,
          current.y,
          REVEAL_RADIUS,
        );
        gradient.addColorStop(0, hexToRgba(accent, REVEAL_OPACITY));
        gradient.addColorStop(1, hexToRgba(accent, 0));
        context.fillStyle = gradient;
        lines.forEach((line, index) => {
          const y = index * LINE_HEIGHT;
          if (Math.abs(y + LINE_HEIGHT / 2 - current.y) < REVEAL_RADIUS) {
            context.fillText(line.text, -line.offset, y);
          }
        });
      }
    }

    function tick(time: number) {
      const elapsed = lastTime ? (time - lastTime) / 1000 : 0;
      lastTime = time;
      for (const line of lines) {
        line.offset = (line.offset + line.speed * elapsed) % line.halfWidth;
      }
      draw();
      frame = requestAnimationFrame(tick);
    }

    function start() {
      if (reducedMotion || frame) {
        return;
      }
      lastTime = 0;
      frame = requestAnimationFrame(tick);
    }

    function stop() {
      cancelAnimationFrame(frame);
      frame = 0;
    }

    // Touch has no hover: the field stays at rest.
    function handlePointerMove(event: PointerEvent) {
      if (!canvas || event.pointerType === "touch") {
        return;
      }
      const rect = canvas.getBoundingClientRect();
      pointer = { x: event.clientX - rect.left, y: event.clientY - rect.top };
      if (!frame) {
        draw();
      }
    }

    function handlePointerLeave() {
      pointer = null;
      if (!frame) {
        draw();
      }
    }

    // Runs the animation only while the hero is on screen.
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        start();
      } else {
        stop();
      }
    });

    // The hero can change size without the window resizing (text wrapping after a
    // language switch, fonts loading): watch the canvas itself.
    const resizeObserver = new ResizeObserver(setup);

    observer.observe(canvas);
    resizeObserver.observe(canvas);
    hero.addEventListener("pointermove", handlePointerMove);
    hero.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      stop();
      observer.disconnect();
      resizeObserver.disconnect();
      hero.removeEventListener("pointermove", handlePointerMove);
      hero.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, []);

  return (
    <div aria-hidden="true" className={styles.field}>
      <canvas ref={canvasRef} className={styles.canvas} />
    </div>
  );
}
