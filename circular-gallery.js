/**
 * Circular Gallery — vanilla port of React Bits (DavidHDev/react-bits)
 * https://reactbits.dev/components/circular-gallery
 */
let Camera;
let Mesh;
let Plane;
let Program;
let Renderer;
let Texture;
let Transform;

function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

function lerp(p1, p2, t) {
  return p1 + (p2 - p1) * t;
}

function autoBind(instance) {
  const proto = Object.getPrototypeOf(instance);
  Object.getOwnPropertyNames(proto).forEach((key) => {
    if (key !== 'constructor' && typeof instance[key] === 'function') {
      instance[key] = instance[key].bind(instance);
    }
  });
}

function parseFontSizePx(font) {
  const match = String(font).match(/(\d+(?:\.\d+)?)px/);
  return match ? Number.parseFloat(match[1]) : 30;
}

function createTextTexture(gl, text, font = 'bold 30px monospace', color = 'black') {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context || !text) return null;

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const fontSize = parseFontSizePx(font);
  const fontSpec = font.includes('px') ? font : `600 ${fontSize}px "PingFang SC", "Hiragino Sans GB", sans-serif`;

  context.font = fontSpec;
  const metrics = context.measureText(text);
  const textWidth = Math.max(1, Math.ceil(metrics.width || text.length * fontSize * 0.9));
  const textHeight = Math.max(1, Math.ceil(fontSize * 1.25));
  const padX = 16;
  const padY = 10;
  const cssWidth = textWidth + padX * 2;
  const cssHeight = textHeight + padY * 2;

  canvas.width = Math.ceil(cssWidth * dpr);
  canvas.height = Math.ceil(cssHeight * dpr);
  context.scale(dpr, dpr);
  context.font = fontSpec;
  context.textBaseline = 'middle';
  context.textAlign = 'center';

  const radius = Math.min(10, cssHeight / 2);
  context.fillStyle = 'rgba(4, 19, 42, 0.72)';
  context.beginPath();
  if (typeof context.roundRect === 'function') {
    context.roundRect(0, 0, cssWidth, cssHeight, radius);
  } else {
    context.rect(0, 0, cssWidth, cssHeight);
  }
  context.fill();

  context.fillStyle = color;
  context.fillText(text, cssWidth / 2, cssHeight / 2);

  const texture = new Texture(gl, { generateMipmaps: false });
  texture.image = canvas;
  return { texture, width: cssWidth, height: cssHeight };
}

class Title {
  constructor({ gl, plane, renderer, text, textColor = '#545050', font = '30px sans-serif' }) {
    autoBind(this);
    this.gl = gl;
    this.plane = plane;
    this.renderer = renderer;
    this.text = text;
    this.textColor = textColor;
    this.font = font;
    this.createMesh();
  }

  createMesh() {
    const textData = createTextTexture(this.gl, this.text, this.font, this.textColor);
    if (!textData) return;

    const { texture, width, height } = textData;
    this.textureWidth = width;
    this.textureHeight = height;
    const geometry = new Plane(this.gl);
    const program = new Program(this.gl, {
      depthTest: false,
      depthWrite: false,
      vertex: `
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragment: `
        precision highp float;
        uniform sampler2D tMap;
        varying vec2 vUv;
        void main() {
          vec4 color = texture2D(tMap, vUv);
          if (color.a < 0.1) discard;
          gl_FragColor = color;
        }
      `,
      uniforms: { tMap: { value: texture } },
      transparent: true,
    });
    this.mesh = new Mesh(this.gl, { geometry, program });
    this.layoutTitle();
    this.mesh.setParent(this.plane);
  }

  layoutTitle() {
    if (!this.mesh || !this.plane) return;
    const aspect = this.textureWidth / this.textureHeight;
    const textHeight = this.plane.scale.y * 0.14;
    const textWidth = textHeight * aspect;
    this.mesh.scale.set(textWidth, textHeight, 1);
    this.mesh.position.y = -this.plane.scale.y * 0.5 + textHeight * 0.5 + 0.05;
    this.mesh.position.z = 0.03;
  }
}

class Media {
  constructor({
    geometry,
    gl,
    image,
    index,
    length,
    renderer,
    scene,
    screen,
    text,
    viewport,
    bend,
    textColor,
    borderRadius = 0,
    font,
  }) {
    this.extra = 0;
    this.geometry = geometry;
    this.gl = gl;
    this.image = image;
    this.index = index;
    this.length = length;
    this.renderer = renderer;
    this.scene = scene;
    this.screen = screen;
    this.text = text;
    this.viewport = viewport;
    this.bend = bend;
    this.textColor = textColor;
    this.borderRadius = borderRadius;
    this.font = font;
    this.createShader();
    this.createMesh();
    this.onResize();
  }

  createShader() {
    const texture = new Texture(this.gl, { generateMipmaps: true });
    this.program = new Program(this.gl, {
      depthTest: false,
      depthWrite: false,
      vertex: `
        precision highp float;
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        uniform float uTime;
        uniform float uSpeed;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          vec3 p = position;
          float motion = abs(uSpeed) * 0.5;
          p.z = (sin(p.x * 4.0 + uTime) * 1.5 + cos(p.y * 2.0 + uTime) * 1.5) * motion;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
        }
      `,
      fragment: `
        precision highp float;
        uniform vec2 uImageSizes;
        uniform vec2 uPlaneSizes;
        uniform sampler2D tMap;
        uniform float uBorderRadius;
        varying vec2 vUv;

        float roundedBoxSDF(vec2 p, vec2 b, float r) {
          vec2 d = abs(p) - b;
          return length(max(d, vec2(0.0))) + min(max(d.x, d.y), 0.0) - r;
        }

        void main() {
          vec2 ratio = vec2(
            min((uPlaneSizes.x / uPlaneSizes.y) / (uImageSizes.x / uImageSizes.y), 1.0),
            min((uPlaneSizes.y / uPlaneSizes.x) / (uImageSizes.y / uImageSizes.x), 1.0)
          );
          vec2 uv = vec2(
            vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
            vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
          );
          vec4 color = texture2D(tMap, uv);

          float d = roundedBoxSDF(vUv - 0.5, vec2(0.5 - uBorderRadius), uBorderRadius);
          float edgeSmooth = 0.002;
          float alpha = 1.0 - smoothstep(-edgeSmooth, edgeSmooth, d);

          gl_FragColor = vec4(color.rgb, alpha);
        }
      `,
      uniforms: {
        tMap: { value: texture },
        uPlaneSizes: { value: [0, 0] },
        uImageSizes: { value: [0, 0] },
        uSpeed: { value: 0 },
        uTime: { value: 100 * Math.random() },
        uBorderRadius: { value: this.borderRadius },
      },
      transparent: true,
    });
    const img = new Image();
    const src = this.image;
    if (
      /^https?:\/\//i.test(src)
      && (window.location.protocol === 'http:' || window.location.protocol === 'https:')
    ) {
      img.crossOrigin = 'anonymous';
    }
    img.src = src;
    img.onload = () => {
      texture.image = img;
      this.program.uniforms.uImageSizes.value = [img.naturalWidth, img.naturalHeight];
    };
  }

  createMesh() {
    this.plane = new Mesh(this.gl, {
      geometry: this.geometry,
      program: this.program,
    });
    this.plane.setParent(this.scene);
  }

  createTitle() {}

  updateTitleLayout() {}

  update(scroll, direction) {
    this.plane.position.x = this.x - scroll.current - this.extra;

    const x = this.plane.position.x;
    const H = this.viewport.width / 2;

    if (this.bend === 0) {
      this.plane.position.y = 0;
      this.plane.rotation.z = 0;
    } else {
      const B_abs = Math.abs(this.bend);
      const R = (H * H + B_abs * B_abs) / (2 * B_abs);
      const effectiveX = Math.min(Math.abs(x), H);

      const arc = R - Math.sqrt(R * R - effectiveX * effectiveX);
      if (this.bend > 0) {
        this.plane.position.y = -arc;
        this.plane.rotation.z = -Math.sign(x) * Math.asin(effectiveX / R);
      } else {
        this.plane.position.y = arc;
        this.plane.rotation.z = Math.sign(x) * Math.asin(effectiveX / R);
      }
    }

    this.speed = scroll.current - scroll.last;
    if (Math.abs(this.speed) > 0.0005) {
      this.program.uniforms.uTime.value += 0.04;
    }
    this.program.uniforms.uSpeed.value = this.speed;

    const planeOffset = this.plane.scale.x / 2;
    const viewportOffset = this.viewport.width / 2;
    this.isBefore = this.plane.position.x + planeOffset < -viewportOffset;
    this.isAfter = this.plane.position.x - planeOffset > viewportOffset;
    if (direction === 'right' && this.isBefore) {
      this.extra -= this.widthTotal;
      this.isBefore = false;
      this.isAfter = false;
    }
    if (direction === 'left' && this.isAfter) {
      this.extra += this.widthTotal;
      this.isBefore = false;
      this.isAfter = false;
    }
  }

  onResize({ screen, viewport } = {}) {
    if (screen) this.screen = screen;
    if (viewport) {
      this.viewport = viewport;
      if (this.plane.program.uniforms.uViewportSizes) {
        this.plane.program.uniforms.uViewportSizes.value = [this.viewport.width, this.viewport.height];
      }
    }
    this.scale = this.screen.height / 1500;
    const card = (this.viewport.height * (680 * this.scale)) / this.screen.height;
    this.plane.scale.x = card;
    this.plane.scale.y = card;
    this.plane.program.uniforms.uPlaneSizes.value = [this.plane.scale.x, this.plane.scale.y];
    this.padding = 2;
    this.width = this.plane.scale.x + this.padding;
    this.widthTotal = this.width * this.length;
    this.x = this.width * this.index;
    this.updateTitleLayout();
  }
}

class CircularGalleryApp {
  constructor(
    container,
    {
      items,
      bend = 3,
      textColor = '#ffffff',
      borderRadius = 0.05,
      font = 'bold 30px Figtree',
      scrollSpeed = 2,
      scrollEase = 0.05,
      onSelectItem = null,
    } = {},
  ) {
    this.container = container;
    this.scrollSpeed = scrollSpeed;
    this.onSelectItem = typeof onSelectItem === 'function' ? onSelectItem : null;
    this.scroll = { ease: scrollEase, current: 0, target: 0, last: 0 };
    this.onCheckDebounce = debounce(this.onCheck, 200);
    autoBind(this);
    this.createRenderer();
    this.createCamera();
    this.createScene();
    this.onResize();
    this.createGeometry();
    this.uniqueItems = items && items.length ? items : [];
    this.createMedias(items, bend, textColor, borderRadius, font);
    this.createCaptions();
    this.update();
    this.addEventListeners();
  }

  createRenderer() {
    this.renderer = new Renderer({
      alpha: true,
      antialias: true,
      dpr: Math.min(window.devicePixelRatio || 1, 2),
    });
    this.gl = this.renderer.gl;
    this.gl.clearColor(0, 0, 0, 0);
    this.container.appendChild(this.gl.canvas);
  }

  createCamera() {
    this.camera = new Camera(this.gl);
    this.camera.fov = 45;
    this.camera.position.z = 20;
  }

  createScene() {
    this.scene = new Transform();
    this.scene.position.y = 0.72;
  }

  createGeometry() {
    this.planeGeometry = new Plane(this.gl, {
      heightSegments: 50,
      widthSegments: 100,
    });
  }

  createMedias(items, bend = 1, textColor, borderRadius, font) {
    const galleryItems = items && items.length ? items : [];
    this.mediasImages = galleryItems.concat(galleryItems);
    this.medias = this.mediasImages.map((data, index) => new Media({
      geometry: this.planeGeometry,
      gl: this.gl,
      image: data.image,
      index,
      length: this.mediasImages.length,
      renderer: this.renderer,
      scene: this.scene,
      screen: this.screen,
      text: data.text,
      viewport: this.viewport,
      bend,
      textColor,
      borderRadius,
      font,
    }));
  }

  onTouchDown(e) {
    this.isDown = true;
    this.scroll.position = this.scroll.current;
    const point = e.touches ? e.touches[0] : e;
    this.start = point.clientX;
    this.startY = point.clientY;
    this.hasDragged = false;
  }

  onTouchMove(e) {
    if (!this.isDown) return;
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    const distance = (this.start - x) * (this.scrollSpeed * 0.025);
    const y = e.touches ? e.touches[0].clientY : e.clientY;
    if (Math.abs(this.start - x) > 8 || Math.abs(this.startY - y) > 8) {
      this.hasDragged = true;
    }
    this.scroll.target = this.scroll.position + distance;
  }

  onTouchUp(e) {
    const wasTap = this.isDown && !this.hasDragged;
    this.isDown = false;
    this.onCheck();
    if (wasTap) {
      const point = e?.changedTouches ? e.changedTouches[0] : e;
      if (point) this.selectMediaFromPoint(point.clientX, point.clientY);
    }
  }

  onWheel(e) {
    e.preventDefault();
    const delta = e.deltaY || e.wheelDelta || e.detail;
    this.scroll.target += (delta > 0 ? this.scrollSpeed : -this.scrollSpeed) * 0.2;
    this.onCheckDebounce();
  }

  onCheck() {
    if (!this.medias || !this.medias[0]) return;
    const width = this.medias[0].width;
    const itemIndex = Math.round(Math.abs(this.scroll.target) / width);
    const item = width * itemIndex;
    this.scroll.target = this.scroll.target < 0 ? -item : item;
  }

  createCaptions() {
    this.captionLayer = document.createElement('div');
    this.captionLayer.className = 'gallery-captions';
    this.container.style.position = 'relative';
    this.container.appendChild(this.captionLayer);

    this.captionNodes = this.medias.map((media, index) => {
      const label = document.createElement('span');
      label.className = 'gallery-caption';
      const itemIndex = index % this.uniqueItems.length;
      const item = this.uniqueItems[itemIndex];
      const track = document.createElement('span');
      track.className = 'gallery-caption-track';
      track.textContent = `TRACK ${itemIndex + 1}`;
      const title = document.createElement('span');
      title.className = 'gallery-caption-title';
      title.textContent = item?.text || media.text || '';
      label.append(track, title);
      this.captionLayer.appendChild(label);
      return label;
    });
  }

  updateCaptions() {
    if (!this.captionNodes || !this.medias) return;

    this.medias.forEach((media, index) => {
      const label = this.captionNodes[index];
      if (!label) return;

      const xRatio = (media.plane.position.x / this.viewport.width) + 0.5;
      const x = xRatio * this.screen.width;
      const cardHeight = (media.plane.scale.y / this.viewport.height) * this.screen.height;
      const arcOffset = (-media.plane.position.y / this.viewport.height) * this.screen.height;
      const centerY = (this.screen.height * 0.5) + arcOffset;
      const y = centerY + cardHeight * 0.52;
      const focus = Math.max(0.2, 1 - Math.abs(media.plane.position.x) / (this.viewport.width * 0.62));

      label.style.left = `${x}px`;
      label.style.top = `${y}px`;
      label.style.opacity = String(focus);
      label.style.visibility = focus < 0.22 ? 'hidden' : 'visible';
    });
  }

  mediaScreenRect(media) {
    if (!media?.plane || !this.viewport || !this.screen) return null;
    const x = (media.plane.position.x / this.viewport.width + 0.5) * this.screen.width;
    const cardWidth = (media.plane.scale.x / this.viewport.width) * this.screen.width;
    const cardHeight = (media.plane.scale.y / this.viewport.height) * this.screen.height;
    const arcOffset = (-media.plane.position.y / this.viewport.height) * this.screen.height;
    const y = (this.screen.height * 0.5) + arcOffset;

    return {
      x,
      y,
      width: cardWidth,
      height: cardHeight,
    };
  }

  selectMediaFromPoint(clientX, clientY) {
    if (!this.onSelectItem || !this.medias?.length || !this.uniqueItems?.length) return;

    const containerRect = this.container.getBoundingClientRect();
    const x = clientX - containerRect.left;
    const y = clientY - containerRect.top;
    let bestMatch = null;

    this.medias.forEach((media, mediaIndex) => {
      const rect = this.mediaScreenRect(media);
      if (!rect) return;

      const dx = Math.abs(x - rect.x);
      const dy = Math.abs(y - rect.y);
      const hitPadding = 18;
      if (dx > rect.width / 2 + hitPadding || dy > rect.height / 2 + hitPadding) return;

      const distance = dx / Math.max(rect.width, 1) + dy / Math.max(rect.height, 1);
      if (!bestMatch || distance < bestMatch.distance) {
        const itemIndex = mediaIndex % this.uniqueItems.length;
        bestMatch = {
          distance,
          itemIndex,
          item: this.uniqueItems[itemIndex],
        };
      }
    });

    if (bestMatch) {
      this.onSelectItem(bestMatch.item, bestMatch.itemIndex);
    }
  }

  onResize() {
    this.screen = {
      width: this.container.clientWidth,
      height: this.container.clientHeight,
    };
    this.renderer.setSize(this.screen.width, this.screen.height);
    this.camera.perspective({
      aspect: this.screen.width / this.screen.height,
    });
    const fov = (this.camera.fov * Math.PI) / 180;
    const height = 2 * Math.tan(fov / 2) * this.camera.position.z;
    const width = height * this.camera.aspect;
    this.viewport = { width, height };
    if (this.medias) {
      this.medias.forEach((media) => media.onResize({ screen: this.screen, viewport: this.viewport }));
    }
    this.updateCaptions();
  }

  update() {
    this.scroll.current = lerp(this.scroll.current, this.scroll.target, this.scroll.ease);
    const direction = this.scroll.current > this.scroll.last ? 'right' : 'left';
    if (this.medias) {
      this.medias.forEach((media) => media.update(this.scroll, direction));
    }
    this.updateCaptions();
    this.renderer.render({ scene: this.scene, camera: this.camera });
    this.scroll.last = this.scroll.current;
    this.raf = window.requestAnimationFrame(this.update);
  }

  addEventListeners() {
    const el = this.container;
    this.boundOnResize = this.onResize.bind(this);
    this.boundOnWheel = this.onWheel.bind(this);
    this.boundOnTouchDown = this.onTouchDown.bind(this);
    this.boundOnTouchMove = this.onTouchMove.bind(this);
    this.boundOnTouchUp = this.onTouchUp.bind(this);
    window.addEventListener('resize', this.boundOnResize);
    el.addEventListener('wheel', this.boundOnWheel, { passive: false });
    el.addEventListener('mousedown', this.boundOnTouchDown);
    window.addEventListener('mousemove', this.boundOnTouchMove);
    window.addEventListener('mouseup', this.boundOnTouchUp);
    el.addEventListener('touchstart', this.boundOnTouchDown, { passive: true });
    el.addEventListener('touchmove', this.boundOnTouchMove, { passive: true });
    el.addEventListener('touchend', this.boundOnTouchUp);
  }

  destroy() {
    window.cancelAnimationFrame(this.raf);
    window.removeEventListener('resize', this.boundOnResize);
    const el = this.container;
    el.removeEventListener('wheel', this.boundOnWheel);
    el.removeEventListener('mousedown', this.boundOnTouchDown);
    window.removeEventListener('mousemove', this.boundOnTouchMove);
    window.removeEventListener('mouseup', this.boundOnTouchUp);
    el.removeEventListener('touchstart', this.boundOnTouchDown);
    el.removeEventListener('touchmove', this.boundOnTouchMove);
    el.removeEventListener('touchend', this.boundOnTouchUp);
    if (this.renderer?.gl?.canvas?.parentNode) {
      this.renderer.gl.canvas.parentNode.removeChild(this.renderer.gl.canvas);
    }
  }
}

function initCircularGallery(container, options = {}) {
  return new CircularGalleryApp(container, options);
}

const galleryLabels = ['色盲', '瑞贝卡'];

function buildGalleryItems() {
  if (typeof PLAYLIST !== 'undefined' && PLAYLIST.length) {
    return PLAYLIST.map((ep) => ({
      image: ep.cover,
      text: ep.title,
    }));
  }
  return galleryLabels.map((text, index) => ({
    image: galleryImage(text, index),
    text,
  }));
}

function resolveAssetPath(path) {
  try {
    return new URL(path, window.location.href).href;
  } catch {
    return path;
  }
}

function findLoadedCoverImage(path) {
  const resolved = resolveAssetPath(path);
  for (const img of document.querySelectorAll('img[src]')) {
    if (!img.complete || !img.naturalWidth) continue;
    try {
      const src = new URL(img.currentSrc || img.src, window.location.href).href;
      if (src === resolved) return img;
    } catch {
      // ignore bad URLs
    }
  }
  return null;
}

function loadImageElement(path) {
  return new Promise((resolve, reject) => {
    const cached = findLoadedCoverImage(path);
    if (cached) {
      resolve(cached);
      return;
    }
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('image load failed'));
    img.src = resolveAssetPath(path);
  });
}

function squareTextureSourceFromImage(img) {
  const crop = Math.min(img.naturalWidth, img.naturalHeight) || 512;
  const sx = (img.naturalWidth - crop) / 2;
  const sy = (img.naturalHeight - crop) / 2;
  const canvas = document.createElement('canvas');
  canvas.width = crop;
  canvas.height = crop;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, sx, sy, crop, crop, 0, 0, crop, crop);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(URL.createObjectURL(blob));
          return;
        }
        try {
          resolve(canvas.toDataURL('image/jpeg', 0.92));
        } catch (error) {
          reject(error);
        }
      },
      'image/jpeg',
      0.92,
    );
  });
}

async function loadSquareCoverBlob(path) {
  const img = await loadImageElement(path);
  return squareTextureSourceFromImage(img);
}

function isFileProtocol() {
  return window.location.protocol === 'file:';
}

async function resolveCoverUrl(path, fallbackText, index) {
  if (isFileProtocol()) {
    return resolveAssetPath(path);
  }

  const onHttp = window.location.protocol === 'http:' || window.location.protocol === 'https:';
  if (onHttp) {
    try {
      const response = await fetch(path);
      if (!response.ok) throw new Error('fetch failed');
      return URL.createObjectURL(await response.blob());
    } catch {
      // fall through to image loader
    }
  }

  try {
    return await loadSquareCoverBlob(path);
  } catch {
    return galleryImage(fallbackText, index);
  }
}

function galleryImage(text, index) {
  const palettes = [
    ['#0647ff', '#33b8ff'],
    ['#0a2fbf', '#89d8ff'],
    ['#03216f', '#4aa8ff'],
    ['#0753c7', '#f3c567'],
    ['#0081f7', '#d9894a'],
  ];
  const [a, b] = palettes[index % palettes.length];
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="900" height="900" viewBox="0 0 900 900">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${a}"/>
          <stop offset="100%" stop-color="${b}"/>
        </linearGradient>
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/>
          <feColorMatrix type="saturate" values="0"/>
          <feComponentTransfer>
            <feFuncA type="table" tableValues="0 0.18"/>
          </feComponentTransfer>
        </filter>
      </defs>
      <rect width="900" height="900" fill="url(#g)"/>
      <rect width="900" height="900" filter="url(#grain)" opacity="0.5"/>
      <circle cx="720" cy="120" r="170" fill="rgba(255,255,255,0.18)"/>
      <circle cx="110" cy="610" r="220" fill="rgba(0,0,0,0.16)"/>
      <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle"
        font-family="Avenir Next, PingFang SC, sans-serif" font-size="76"
        font-weight="800" fill="rgba(245,249,255,0.94)">${text}</text>
    </svg>
  `;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

async function bootCircularGallery() {
  const galleryContainer = document.getElementById('circularGallery');
  if (!galleryContainer) return;

  if (isFileProtocol()) {
    console.warn(
      '[CircularGallery] file:// pages cannot load local assets reliably in Chrome. '
      + 'Run `npm run dev` in radio-prototype and open the localhost URL printed in the terminal.',
    );
  }

  try {
    ({ Camera, Mesh, Plane, Program, Renderer, Texture, Transform } = await import('https://cdn.jsdelivr.net/npm/ogl@1.0.11/src/index.js'));
  } catch (error) {
    console.error('[CircularGallery] Failed to load OGL', error);
    return;
  }

  const rawItems = buildGalleryItems();
  const uniqueCovers = [...new Set(rawItems.map((item) => item.image))];
  await Promise.all(uniqueCovers.map((path) => loadImageElement(path).catch(() => null)));

  const items = await Promise.all(
    rawItems.map((item, index) => resolveCoverUrl(
      item.image,
      galleryLabels[index % galleryLabels.length],
      index,
    ).then((image) => ({ ...item, image }))),
  );

  initCircularGallery(galleryContainer, {
    items,
    bend: 3,
    textColor: '#ffffff',
    borderRadius: 0.06,
    font: '600 24px "PingFang SC", "Hiragino Sans GB", sans-serif',
    scrollSpeed: 2,
    scrollEase: 0.05,
    onSelectItem: (_item, index) => {
      window.dispatchEvent(new CustomEvent('radio:selectEpisode', {
        detail: { index },
      }));
    },
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootCircularGallery);
} else {
  bootCircularGallery();
}
