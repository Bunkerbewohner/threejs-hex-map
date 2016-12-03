//
// Vertex Shader for Land
//


precision highp float;

uniform float sineTime; // oscillating time [-1.0, 1.0]
uniform float zoom; // camera zoom factor
uniform float size; // quadratic map size (i.e. size=10 means 10x10 hexagons)
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform vec3 camera; // camera position in world space

// (width, height, cellSize, cellSpacing)
uniform vec4 textureAtlasMeta;

attribute vec3 position; // position of one of the hexagon's vertices
attribute vec2 offset; // world position offset for the entire hexagon (tile)
attribute vec2 uv; // texture coordinates
attribute float border; // border = distance from hexagon center (0.0 = center, 1.0 = border)

// style.x = texture atlas cell index
// style.y = "decimal bitmask" (fog=1xx, hills=x1x, clouds=xx1)
// style.z = coast texture index (0 - 64)
// style.w = river texture index (0 - 64)
attribute vec2 style;

varying vec3 vPosition;
varying vec2 vTexCoord;
varying float vExtra;
varying float vFogOfWar; // 1.0 = shadow, 0.0 = no shadow
varying float vHill;
varying float vHidden; // 1.0 = hidden, 0.0 = visible
varying vec2 vOffset;

vec2 cellIndexToUV(float idx) {
    float atlasWidth = textureAtlasMeta.x;
    float atlasHeight = textureAtlasMeta.y;
    float cellSize = textureAtlasMeta.z;
    float cols = atlasWidth / cellSize;
    float rows = atlasHeight / cellSize;
    float x = mod(idx, cols);
    float y = floor(idx / cols);

    return vec2(x / cols + uv.x / cols, 1.0 - (y / rows + uv.y / rows));
}

void main() {
    vec3 pos = vec3(offset.x + position.x, offset.y + position.y, 0);

    if (border < 0.95 && style.y < 100.0) {
        pos.z = 0.2 + (0.5 + sin(uv.s + pos.s * 2.0) * 0.5) * 0.5;
    }

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    vPosition = pos;
    vOffset = offset;

    vTexCoord = cellIndexToUV(style.x);

    vExtra = border;
    vFogOfWar = mod(style.y, 10.0) == 1.0 ? 1.0 : 0.0;   // style.y < 100.0 ? 10.0 : (style.y == 1.0 || style.y == 11.0 ? 1.0 : 0.0);
    vHidden = style.y >= 100.0 ? 1.0 : 0.0;
}