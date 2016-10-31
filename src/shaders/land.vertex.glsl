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
// style.y = bitmask
// style.z = coast texture index (0 - 64)
// style.w = river texture index (0 - 64)
attribute vec4 style;

varying vec3 vPosition;
varying vec2 vTexCoord;
varying vec2 vUV;
varying float vExtra;
varying float vFogOfWar; // 1.0 = tile is in fog of war, 0.0 otherwise
varying float vHill;
varying vec2 vOffset;
varying vec2 vCoastTextureCell;
varying vec2 vRiverTextureCell;

vec2 cellIndexToUV(float idx) {
    float atlasWidth = textureAtlasMeta.x;
    float atlasHeight = textureAtlasMeta.y;
    float cellSize = textureAtlasMeta.z;
    float cols = atlasWidth / cellSize;
    float rows = atlasHeight / cellSize;
    float x = mod(idx, cols);
    float y = floor(idx / cols);

    //return vec2(uv.x * w + u, 1.0 - (uv.y * h + v));
    return vec2(x / cols + uv.x / cols, 1.0 - (y / rows + (1.0 - uv.y) / rows));
}

void main() {
    vec3 pos = vec3(offset.x + position.x, offset.y + position.y, 0);

    if (style.y / 10.0 >= 1.0 && border < 0.75) { // hill
        pos.z = 0.1 + (0.5 + sin(uv.s + pos.s * 2.0) * 0.5) * 0.25;
        vHill = 1.0;
    } else {
        vHill = 0.0;
    }

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    vPosition = pos;
    vOffset = offset;

    vUV = uv;
    vTexCoord = cellIndexToUV(style.x);
    vCoastTextureCell = vec2(mod(style.z, 8.0), floor(style.z / 8.0));
    vRiverTextureCell = vec2(mod(style.w, 8.0), floor(style.w / 8.0));

    vExtra = border;
    vFogOfWar = style.y == 1.0 || style.y == 11.0 ? 1.0 : 0.0;
}