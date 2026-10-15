import { useEffect, useRef } from "react";
import { codeGlyphs } from "../../data/codeGlyphs";
import styles from "./CodeField.module.css";

const FONT_SIZE = 11;
const LINE_HEIGHT = 16;
const REST_OPACITY = 0.035;
const BRIGHT_FACTOR = 2.2; // brighter stretches: REST_OPACITY × 2.2
const MIN_SPEED = 20; // pixels per second
const MAX_SPEED = 40;

// Gravitational lens ("black hole") around the pointer.
const LENS_RADIUS = 180; // the distortion fades out to nothing at this distance
const FULL_STRENGTH_SHARE = 0.5; // full effect up to half the radius, then a fade to the edge
const EINSTEIN_RADIUS = 34; // lines bend around this circle (first image outside, second image inside)
const SHADOW_RADIUS = 24; // opaque black-hole shadow, same size as the 48 px round buttons
const SECOND_IMAGE_OPACITY = 0.6; // the second image is fainter than the first
const LENS_OPACITY = 0.22; // characters brighten up to this value close to the sphere
const MAX_STRETCH = 3; // characters stretch along the sphere, up to 3 times their width
const RING_OPACITY = 0.18; // thin light ring around the shadow
const FOLLOW = 0.9; // share of the distance to the pointer covered each frame
const RETURN_DURATION = 1.4; // seconds to glide back to the resting letter when the mouse leaves
// Optical center of a lowercase letter: a bit below the middle of its box.
const ANCHOR_OFFSET_Y = 0.12; // share of the letter height
const FADE_SPEED = 4; // lens appears or disappears in 1 / 4 s
const MIN_VISIBLE_OPACITY = 0.01; // lens characters fainter than this are not drawn

// Reduced motion: no distortion, only a simple reveal around the pointer.
const REVEAL_OPACITY = 0.35;

type Line = {
  full: string;
  faint: string;
  bright: string;
  image: HTMLCanvasElement; // the line pre-drawn once, copied every frame
  halfWidth: number;
  offset: number;
  speed: number;
};

type Point = { x: number; y: number };

// A random line cut into stretches: hidden (25 %), faint (60 %) or brighter (15 %).
// Each layer keeps the other characters as spaces: with a monospace font,
// the layers stay aligned when drawn on top of each other.
function randomLine(length: number) {
  let full = "";
  let faint = "";
  let bright = "";
  while (full.length < length) {
    const stretch = 3 + Math.floor(Math.random() * 18);
    const roll = Math.random();
    const level = roll < 0.25 ? "hidden" : roll < 0.85 ? "faint" : "bright";
    for (let i = 0; i < stretch && full.length < length; i++) {
      const char = codeGlyphs[Math.floor(Math.random() * codeGlyphs.length)];
      full += char;
      faint += level === "faint" ? char : " ";
      bright += level === "bright" ? char : " ";
    }
  }
  return { full, faint, bright };
}

// "#d4a574" -> "212, 165, 116", to build rgba() colors with any opacity.
function hexToRgb(hex: string) {
  const color = hex.trim();
  const red = Number.parseInt(color.slice(1, 3), 16);
  const green = Number.parseInt(color.slice(3, 5), 16);
  const blue = Number.parseInt(color.slice(5, 7), 16);
  return `${red}, ${green}, ${blue}`;
}

// An offscreen canvas (never shown) at the screen pixel ratio, ready to draw text.
function createLayer(
  width: number,
  height: number,
  ratio: number,
  font: string,
) {
  const layer = document.createElement("canvas");
  layer.width = Math.ceil(width * ratio);
  layer.height = Math.ceil(height * ratio);
  const layerContext = layer.getContext("2d");
  if (layerContext) {
    layerContext.scale(ratio, ratio);
    layerContext.font = font;
    layerContext.textBaseline = "top";
  }
  return { layer, layerContext };
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
    let charWidth = 0;
    let ratio = 1;
    // Read once per setup, not every frame: getComputedStyle forces the browser to
    // recompute styles. A theme change remounts the component (key={theme}).
    let colors = { lens: "", hole: "" };
    let intensity = 1; // multiplies every opacity of the field (--code-intensity)
    // Every glyph drawn once in a strip, in the accent color: the lens copies a
    // piece of this strip for each character instead of laying out text again.
    let glyphs: HTMLCanvasElement | null = null;
    const glyphIndex = new Map<string, number>();
    // Letter of the name where the lens rests while the mouse is away.
    const anchor = hero.querySelector("[data-lens-anchor]");
    let pointerClient: Point | null = null; // mouse position in the window
    let pointer: Point | null = null; // mouse position in the canvas
    let lens: Point | null = null; // where the lens is: it follows the mouse with a delay
    let strength = 0; // 0 = no lens, 1 = full lens
    let returnFrom: Point | null = null; // where the lens was when the mouse left
    let returnStart = 0; // time when the mouse left
    let frame = 0;
    let lastTime = 0;

    // Each line is a random text: its image is drawn once here, then copied twice
    // side by side every frame. Once it has moved by its width, the offset is reset
    // to 0 and the jump is invisible (same idea as the carousel).
    function setup() {
      if (!canvas || !context) {
        return;
      }
      ratio = window.devicePixelRatio || 1;
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      if (width === 0 || height === 0) {
        return;
      }
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      const font = `${FONT_SIZE}px ${getComputedStyle(canvas).fontFamily}`;
      context.font = font;
      context.textBaseline = "top";

      const tokens = getComputedStyle(canvas);
      const gold = hexToRgb(tokens.getPropertyValue("--gold"));
      colors = {
        lens: hexToRgb(tokens.getPropertyValue("--lens")),
        hole: hexToRgb(tokens.getPropertyValue("--hole")),
      };
      intensity =
        Number.parseFloat(tokens.getPropertyValue("--code-intensity")) || 1;

      charWidth = context.measureText("M").width;

      const strip = createLayer(
        codeGlyphs.length * charWidth,
        LINE_HEIGHT,
        ratio,
        font,
      );
      glyphIndex.clear();
      if (strip.layerContext) {
        strip.layerContext.fillStyle = `rgb(${colors.lens})`;
        [...codeGlyphs].forEach((char, index) => {
          glyphIndex.set(char, index);
          strip.layerContext?.fillText(char, index * charWidth, 0);
        });
      }
      glyphs = strip.layer;

      const length = Math.ceil(width / charWidth) + 1;
      const halfWidth = length * charWidth;
      lines = Array.from({ length: Math.ceil(height / LINE_HEIGHT) }, () => {
        const half = randomLine(length);
        const { layer, layerContext } = createLayer(
          halfWidth,
          LINE_HEIGHT,
          ratio,
          font,
        );
        if (layerContext) {
          layerContext.fillStyle = `rgba(${gold}, ${REST_OPACITY * intensity})`;
          layerContext.fillText(half.faint, 0, 0);
          layerContext.fillStyle = `rgba(${gold}, ${REST_OPACITY * BRIGHT_FACTOR * intensity})`;
          layerContext.fillText(half.bright, 0, 0);
        }
        return {
          full: half.full + half.full,
          faint: half.faint + half.faint,
          bright: half.bright + half.bright,
          image: layer,
          halfWidth,
          offset: Math.random() * halfWidth,
          speed: MIN_SPEED + Math.random() * (MAX_SPEED - MIN_SPEED),
        };
      });
      draw();
    }

    function drawLines() {
      if (!context) {
        return;
      }
      lines.forEach((line, index) => {
        const y = index * LINE_HEIGHT;
        const imageWidth = line.image.width / ratio;
        context.drawImage(line.image, -line.offset, y, imageWidth, LINE_HEIGHT);
        context.drawImage(
          line.image,
          line.halfWidth - line.offset,
          y,
          imageWidth,
          LINE_HEIGHT,
        );
      });
    }

    // Reduced motion: the text near the pointer is redrawn with a radial
    // gradient as its color, bright at the pointer and transparent at the edge.
    function drawReveal(center: Point) {
      if (!context) {
        return;
      }
      const gradient = context.createRadialGradient(
        center.x,
        center.y,
        0,
        center.x,
        center.y,
        LENS_RADIUS,
      );
      gradient.addColorStop(
        0,
        `rgba(${colors.lens}, ${Math.min(1, REVEAL_OPACITY * intensity)})`,
      );
      gradient.addColorStop(1, `rgba(${colors.lens}, 0)`);
      context.fillStyle = gradient;
      lines.forEach((line, index) => {
        const y = index * LINE_HEIGHT;
        if (Math.abs(y + LINE_HEIGHT / 2 - center.y) < LENS_RADIUS) {
          context.fillText(line.full, -line.offset, y);
        }
      });
    }

    // Share of the lens effect at a given distance from the center: full from
    // mid-radius inward, then a smooth fade to 0 at LENS_RADIUS, so that the
    // lens joins the rest of the field without a seam.
    function lensWeight(distance: number) {
      const t = Math.max(0, 1 - distance / LENS_RADIUS);
      const fade = Math.min(1, t / (1 - FULL_STRENGTH_SHARE));
      return fade * fade * (3 - 2 * fade) * strength;
    }

    // Gravitational lens: a point of the background at distance d from the center
    // is seen twice. The first image is at (d + √(d² + 4E²)) / 2, pushed outward:
    // lines arch over and under the center. The second image is on the opposite
    // side at (√(d² + 4E²) − d) / 2, inside the circle of radius E: lines that pass
    // close to the center wrap tightly around the shadow, as in Interstellar.
    function lensPoint(center: Point, x: number, y: number, second: boolean) {
      const dx = x - center.x;
      const dy = y - center.y;
      const distance = Math.hypot(dx, dy) || 0.001;
      const root = Math.sqrt(distance * distance + 4 * EINSTEIN_RADIUS ** 2);
      const factor = second
        ? -(root - distance) / 2 / distance
        : (distance +
            ((distance + root) / 2 - distance) * lensWeight(distance)) /
          distance;
      return { x: center.x + dx * factor, y: center.y + dy * factor };
    }

    // Draws one character at its lensed position, turned along the curve of its
    // line and stretched along the circle: where it lands and where a point 1 px
    // to its right lands give the direction of the bent line and the stretch.
    function drawLensedChar(
      center: Point,
      char: string,
      x: number,
      y: number,
      second: boolean,
      opacity: number,
    ) {
      const index = glyphIndex.get(char);
      if (!context || !glyphs || index === undefined) {
        return;
      }
      const point = lensPoint(center, x, y, second);
      const next = lensPoint(center, x + 1, y, second);
      const angle = Math.atan2(next.y - point.y, next.x - point.x);
      const stretch = Math.min(
        MAX_STRETCH,
        Math.max(1, Math.hypot(next.x - point.x, next.y - point.y)),
      );
      // Stretched along the circle, squeezed toward it.
      const scaleX = stretch;
      const scaleY = 1 / Math.sqrt(stretch);
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      // One call instead of translate + rotate + scale (all times the pixel ratio).
      context.setTransform(
        ratio * cos * scaleX,
        ratio * sin * scaleX,
        -ratio * sin * scaleY,
        ratio * cos * scaleY,
        ratio * point.x,
        ratio * point.y,
      );
      context.globalAlpha = opacity;
      context.drawImage(
        glyphs,
        index * charWidth * ratio,
        0,
        charWidth * ratio,
        LINE_HEIGHT * ratio,
        -charWidth / 2,
        -LINE_HEIGHT / 2,
        charWidth,
        LINE_HEIGHT,
      );
    }

    function drawLens(center: Point) {
      if (!context) {
        return;
      }
      const secondOpacity = Math.min(
        1,
        LENS_OPACITY * SECOND_IMAGE_OPACITY * strength * intensity,
      );
      lines.forEach((line, index) => {
        const y = index * LINE_HEIGHT + LINE_HEIGHT / 2;
        if (Math.abs(y - center.y) >= LENS_RADIUS) {
          return;
        }
        const first = Math.max(
          0,
          Math.floor((center.x - LENS_RADIUS + line.offset) / charWidth),
        );
        const last = Math.min(
          line.full.length - 1,
          Math.ceil((center.x + LENS_RADIUS + line.offset) / charWidth),
        );
        for (let i = first; i <= last; i++) {
          const x = -line.offset + i * charWidth + charWidth / 2;
          const distance = Math.hypot(x - center.x, y - center.y);
          if (distance >= LENS_RADIUS) {
            continue;
          }
          const t = 1 - distance / LENS_RADIUS;
          const restOpacity =
            line.bright[i] !== " "
              ? REST_OPACITY * BRIGHT_FACTOR
              : line.faint[i] !== " "
                ? REST_OPACITY
                : 0;
          const lensOpacity = Math.max(restOpacity, LENS_OPACITY * t);
          const opacity = Math.min(
            1,
            (restOpacity + (lensOpacity - restOpacity) * strength) * intensity,
          );
          if (opacity >= MIN_VISIBLE_OPACITY) {
            drawLensedChar(center, line.full[i], x, y, false, opacity);
          }

          // Only characters close to the center have a second image outside the
          // shadow (farther ones land inside it and are hidden).
          if (
            distance < 2 * EINSTEIN_RADIUS &&
            secondOpacity >= MIN_VISIBLE_OPACITY
          ) {
            drawLensedChar(center, line.full[i], x, y, true, secondOpacity);
          }
        }
      });
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      context.globalAlpha = 1;

      // Opaque shadow, dark in both themes: it also hides the halos.
      context.beginPath();
      context.arc(center.x, center.y, SHADOW_RADIUS * strength, 0, Math.PI * 2);
      context.fillStyle = `rgb(${colors.hole})`;
      context.fill();

      // Thin light ring hugging the shadow.
      context.strokeStyle = `rgba(${colors.lens}, ${Math.min(1, RING_OPACITY * strength * intensity)})`;
      context.lineWidth = 1;
      context.stroke();
    }

    function draw() {
      if (!context) {
        return;
      }
      context.clearRect(0, 0, width, height);

      if (reducedMotion) {
        drawLines();
        if (pointer) {
          drawReveal(pointer);
        }
        return;
      }

      if (!lens || strength === 0) {
        drawLines();
        return;
      }

      // Lines everywhere except inside the lens circle (a rectangle with a hole),
      // then the distorted characters inside it.
      context.save();
      context.beginPath();
      context.rect(0, 0, width, height);
      context.arc(lens.x, lens.y, LENS_RADIUS, 0, Math.PI * 2, true);
      context.clip();
      drawLines();
      context.restore();
      drawLens(lens);
    }

    // The mouse position is stored as is; it is converted to canvas coordinates
    // once per frame, not on every mouse event (getBoundingClientRect has a cost).
    function updatePointer() {
      if (!canvas || !pointerClient) {
        pointer = null;
        return;
      }
      const rect = canvas.getBoundingClientRect();
      pointer = {
        x: pointerClient.x - rect.left,
        y: pointerClient.y - rect.top,
      };
    }

    // Center of the resting letter, in canvas coordinates.
    function anchorPoint() {
      if (!canvas || !anchor) {
        return null;
      }
      const letter = anchor.getBoundingClientRect();
      const rect = canvas.getBoundingClientRect();
      return {
        x: letter.left + letter.width / 2 - rect.left,
        y: letter.top + letter.height * (0.5 + ANCHOR_OFFSET_Y) - rect.top,
      };
    }

    function tick(time: number) {
      const elapsed = lastTime ? (time - lastTime) / 1000 : 0;
      lastTime = time;
      for (const line of lines) {
        line.offset = (line.offset + line.speed * elapsed) % line.halfWidth;
      }

      updatePointer();
      const anchorTarget = anchorPoint();
      if (pointer) {
        // Follows the mouse closely.
        returnFrom = null;
        lens = lens ?? { ...pointer };
        lens.x += (pointer.x - lens.x) * FOLLOW;
        lens.y += (pointer.y - lens.y) * FOLLOW;
        strength = Math.min(1, strength + FADE_SPEED * elapsed);
      } else if (anchorTarget) {
        // Mouse away: a trip of RETURN_DURATION to the resting letter, slow at
        // the start and at the end (ease-in-out), the same on every screen.
        if (lens && !returnFrom) {
          returnFrom = { ...lens };
          returnStart = time;
        }
        if (returnFrom) {
          const progress = Math.min(
            1,
            (time - returnStart) / 1000 / RETURN_DURATION,
          );
          const eased =
            progress < 0.5
              ? 4 * progress ** 3
              : 1 - (-2 * progress + 2) ** 3 / 2;
          lens = {
            x: returnFrom.x + (anchorTarget.x - returnFrom.x) * eased,
            y: returnFrom.y + (anchorTarget.y - returnFrom.y) * eased,
          };
        } else {
          lens = { ...anchorTarget }; // first frame: the lens starts on the letter
        }
        strength = Math.min(1, strength + FADE_SPEED * elapsed);
      } else {
        strength = Math.max(0, strength - FADE_SPEED * elapsed);
        if (strength === 0) {
          lens = null;
        }
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
      if (event.pointerType === "touch") {
        return;
      }
      pointerClient = { x: event.clientX, y: event.clientY };
      if (!frame) {
        updatePointer();
        draw();
      }
    }

    function handlePointerLeave() {
      pointerClient = null;
      if (!frame) {
        updatePointer();
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
