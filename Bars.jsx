import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { Reflector } from 'three/addons/objects/Reflector.js';
export default function Bars({
  values,
  paused,
  angle,
  dark,
  onState
}) {
  const host = useRef(null),
    state = useRef({
      values,
      paused,
      angle,
      dark
    });
  state.current = {
    values,
    paused,
    angle,
    dark
  };
  useEffect(() => {
    const wrap = host.current;
    let renderer,
      pmrem,
      env,
      floor,
      texture,
      resizeObserver,
      intersection,
      frame = 0,
      disposed = false,
      visible = true,
      dirty = true;
    const materials = [],
      geometries = [],
      reduced = matchMedia('(prefers-reduced-motion: reduce)');
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'low-power',
        preserveDrawingBuffer: true
      });
      renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.12;
      wrap.appendChild(renderer.domElement);
      renderer.domElement.setAttribute('aria-hidden', 'true');
      const scene = new THREE.Scene(),
        camera = new THREE.PerspectiveCamera(24, 1, .1, 80);
      camera.position.set(5.5, 7.2, 17);
      camera.lookAt(0, 2.55, 0);
      // The reflection studio's softboxes and dark gaps give each face a distinct value.
      const studio = new THREE.Scene();
      studio.background = new THREE.Color(0x343d4c);
      const panel = (position, width, height, intensity) => {
        const geometry = new THREE.PlaneGeometry(width, height),
          material = new THREE.MeshBasicMaterial({
            color: new THREE.Color().setScalar(intensity),
            side: THREE.DoubleSide
          });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(...position);
        mesh.lookAt(0, 3, 0);
        studio.add(mesh);
        geometries.push(geometry);
        materials.push(material);
      };
      panel([-6, 1, 12], 15, 9, 1.5);
      panel([-3, -2, 14], 2.2, 8, 4);
      panel([-11, 2, 10], 2, 22, 5);
      panel([5, 2, 12], 2, 20, .08);
      panel([-6, 10, -22], 18, 16, .65);
      panel([12, -4, -24], 18, 12, .32);
      panel([10, 3, -20], 1, 19, 1);
      pmrem = new THREE.PMREMGenerator(renderer);
      env = pmrem.fromScene(studio, .025);
      scene.environment = env.texture;
      texture = new THREE.TextureLoader().load('./brushed-metal.webp', () => {
        dirty = true;
      });
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(1.5, 3);
      texture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
      const silver = new THREE.MeshPhysicalMaterial({
        color: 0xcbd2da,
        metalness: .94,
        roughness: .34,
        map: texture,
        bumpMap: texture,
        bumpScale: .035,
        roughnessMap: texture,
        envMapIntensity: 1,
        clearcoat: .2,
        clearcoatRoughness: .25
      });
      const cobalt = new THREE.MeshPhysicalMaterial({
        color: 0x0640ff,
        metalness: .7,
        roughness: .24,
        bumpMap: texture,
        bumpScale: .012,
        envMapIntensity: 1.3,
        clearcoat: .1,
        clearcoatRoughness: .15
      });
      materials.push(silver, cobalt);
      const group = new THREE.Group();
      scene.add(group);
      const bars = [];
      for (let i = 0; i < 5; i++) {
        const geometry = new RoundedBoxGeometry(1.25, 1, 1.5, 3, .04);
        geometries.push(geometry);
        const mesh = new THREE.Mesh(geometry, i === 3 ? cobalt : silver);
        mesh.position.x = (i - 2) * 1.9;
        mesh.scale.y = Math.max(.02, (state.current.values[i] || 0) / Math.max(1, ...state.current.values) * 5.2);
        mesh.position.y = mesh.scale.y / 2;
        group.add(mesh);
        bars.push(mesh);
        // Soft geometric contact shadows stay anchored as the chart rotates.
        const shadowGeometry = new THREE.PlaneGeometry(4.4, 4.4),
          shadowMaterial = new THREE.ShaderMaterial({
            transparent: true,
            depthWrite: false,
            vertexShader: 'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
            fragmentShader: 'varying vec2 vUv;void main(){vec2 p=(vUv-.5)*4.4;vec2 d=max(abs(p)-vec2(.5,.65),0.);float a=exp(-dot(d,d)*3.5)*.2;gl_FragColor=vec4(.08,.12,.20,a);}'
          });
        const shadow = new THREE.Mesh(shadowGeometry, shadowMaterial);
        shadow.rotation.x = -Math.PI / 2;
        shadow.position.set(mesh.position.x, -.015, .18);
        group.add(shadow);
        geometries.push(shadowGeometry);
        materials.push(shadowMaterial);
      }
      scene.add(new THREE.HemisphereLight(0xffffff, 0x606b82, .8));
      const key = new THREE.DirectionalLight(0xffffff, 3);
      key.position.set(-5, 12, 8);
      scene.add(key);
      const fill = new THREE.DirectionalLight(0xa8c1ff, 1.4);
      fill.position.set(6, 5, -3);
      scene.add(fill);
      const floorGeometry = new THREE.PlaneGeometry(24, 18);
      geometries.push(floorGeometry);
      const shader = {
        uniforms: THREE.UniformsUtils.clone(Reflector.ReflectorShader.uniforms),
        vertexShader: Reflector.ReflectorShader.vertexShader.replace('varying vec4 vUv;', 'varying vec4 vUv; varying vec2 vSurface;').replace('vUv = textureMatrix', 'vSurface = position.xy; vUv = textureMatrix'),
        fragmentShader: `uniform sampler2D tDiffuse;varying vec4 vUv;varying vec2 vSurface;
    void main(){vec2 uv=vUv.xy/vUv.w;vec4 r=texture2D(tDiffuse,uv)*.28;
    r+=texture2D(tDiffuse,uv+vec2(.002,.006))*.22;r+=texture2D(tDiffuse,uv-vec2(.002,.006))*.22;
    r+=texture2D(tDiffuse,uv+vec2(.004,.012))*.14;r+=texture2D(tDiffuse,uv-vec2(.004,.012))*.14;
    float fade=exp(-vSurface.y*vSurface.y*.55-vSurface.x*vSurface.x*.014);
    gl_FragColor=vec4(r.rgb,r.a*fade*.34);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
    }`
      };
      floor = new Reflector(floorGeometry, {
        textureWidth: 768,
        textureHeight: 384,
        multisample: 0,
        clipBias: .003,
        shader
      });
      floor.rotation.x = -Math.PI / 2;
      floor.material.transparent = true;
      floor.material.depthWrite = false;
      scene.add(floor);
      const resize = () => {
        const {
          width,
          height
        } = wrap.getBoundingClientRect();
        if (!width || !height) return;
        renderer.setSize(width, height);
        // Extend only the lower camera frustum for the reflected floor; bars stay put.
        const chartHeight = wrap.parentElement.getBoundingClientRect().height;
        const ratio = width / chartHeight;
        camera.aspect = ratio;
        camera.fov = Math.max(20, THREE.MathUtils.radToDeg(2 * Math.atan(5.4 / (18 * ratio))));
        camera.setViewOffset(width, chartHeight, 0, 0, width, height);
        camera.updateProjectionMatrix();
        renderer.render(scene, camera);
      };
      resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(wrap);
      resize();
      intersection = new IntersectionObserver(([e]) => {
        visible = e.isIntersecting;
      });
      intersection.observe(wrap);
      let last = 0,
        phase = 0,
        lastKey = '';
      function render(time) {
        if (disposed) return;
        frame = requestAnimationFrame(render);
        if (!visible || document.hidden || time - last < 33) return;
        const c = state.current,
          key = c.values.join(',') + '|' + c.angle + '|' + c.dark;
        if (key !== lastKey) {
          lastKey = key;
          dirty = true;
        }
        const moving = !c.paused && !reduced.matches,
          max = Math.max(1, ...c.values);
        let settling = false;
        bars.forEach((b, i) => {
          b.visible = i < c.values.length;
          const target = Math.max(.02, (c.values[i] || 0) / max * 5.2),
            height = reduced.matches ? target : THREE.MathUtils.lerp(b.scale.y, target, .14);
          settling ||= Math.abs(height - target) > .004;
          b.scale.y = height;
          b.position.y = height / 2;
        });
        if (moving) {
          phase += .012;
          dirty = true;
        }
        if (dirty || settling) {
          group.rotation.y = c.angle * Math.PI / 180 + (moving ? Math.sin(phase) * .035 : 0);
          renderer.toneMappingExposure = c.dark ? .9 : 1.12;
          renderer.render(scene, camera);
          dirty = false;
        }
        last = time;
      }
      renderer.domElement.addEventListener('webglcontextlost', e => {
        e.preventDefault();
        onState('fallback');
      });
      frame = requestAnimationFrame(render);
      onState('ready');
    } catch {
      onState('fallback');
    }
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      resizeObserver?.disconnect();
      intersection?.disconnect();
      floor?.dispose();
      geometries.forEach(g => g.dispose());
      materials.forEach(m => m.dispose());
      texture?.dispose();
      env?.dispose();
      pmrem?.dispose();
      renderer?.dispose();
      renderer?.domElement.remove();
    };
  }, []);
  return <div className="bars-canvas" ref={host} aria-hidden="true" />;
}
