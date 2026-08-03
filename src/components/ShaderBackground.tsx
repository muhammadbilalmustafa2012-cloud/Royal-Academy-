import React, { useEffect, useRef } from 'react';

export const ShaderBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl') as WebGLRenderingContext | null;
    if (!gl) return;

    const vs = `
      attribute vec2 a_position;
      varying vec2 v_texCoord;
      void main() {
        v_texCoord = a_position * 0.5 + 0.5;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fs = `
      precision highp float;
      uniform float u_time;
      uniform vec2 u_resolution;
      varying vec2 v_texCoord;

      void main() {
        vec2 uv = v_texCoord;
        
        // Deep Royal Navy & Gold shimmer theme
        vec3 color1 = vec3(0.0, 0.10, 0.22);   // Deep Royal Navy #001A38
        vec3 color2 = vec3(0.0, 0.14, 0.29);   // Navy #002349
        vec3 color3 = vec3(0.72, 0.52, 0.04);  // Royal Gold #B8860B accent
        
        float noise = sin(uv.x * 4.0 + u_time * 0.4) * cos(uv.y * 3.0 + u_time * 0.2);
        float wave = sin(uv.y * 6.0 + u_time * 0.6) * 0.05;
        
        vec3 finalColor = mix(color1, color2, uv.x + noise * 0.3);
        finalColor = mix(finalColor, color3 * 0.2, uv.y * 0.5 + wave);
        
        // Gold shimmer particles
        float shimmer = pow(sin(uv.x * 25.0 + u_time * 1.5) * cos(uv.y * 25.0 - u_time * 1.2), 12.0);
        finalColor += color3 * shimmer * 0.25;
        
        // Gold glint points
        float glint = pow(max(0.0, sin(uv.x * 50.0 + u_time * 2.0) * cos(uv.y * 50.0 + u_time * 2.0)), 50.0);
        finalColor += color3 * glint * 0.45;
        
        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;

    function createShader(glCtx: WebGLRenderingContext, type: number, source: string) {
      const shader = glCtx.createShader(type);
      if (!shader) return null;
      glCtx.shaderSource(shader, source);
      glCtx.compileShader(shader);
      if (!glCtx.getShaderParameter(shader, glCtx.COMPILE_STATUS)) {
        console.error(glCtx.getShaderInfoLog(shader));
        glCtx.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vertShader = createShader(gl, gl.VERTEX_SHADER, vs);
    const fragShader = createShader(gl, gl.FRAGMENT_SHADER, fs);
    if (!vertShader || !fragShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);
    gl.useProgram(program);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const positionLocation = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const timeLocation = gl.getUniformLocation(program, 'u_time');
    const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');

    let animationFrameId: number;

    function resize() {
      if (!canvas || !gl) return;
      const width = canvas.clientWidth || window.innerWidth;
      const height = canvas.clientHeight || 750;
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }
    }

    window.addEventListener('resize', resize);
    resize();

    function render(time: number) {
      if (!gl) return;
      gl.uniform1f(timeLocation, time * 0.001);
      if (canvas) {
        gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      }
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animationFrameId = requestAnimationFrame(render);
    }

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none"
    />
  );
};
