export const TREES_VERTEX_SHADER = `
precision mediump float;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform float size;
uniform float scale;

attribute vec3 position;
attribute vec3 params; // x = spritesheet x, y = spritesheet y, z = alpha
attribute vec3 color;

varying vec3 vParams; // x = sprite index, y = size, z = visible?
varying vec3 vColor;

void main() {
    vParams = params;

    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = params.y * ( scale / - mvPosition.z );
    
    vColor = color;
}
`