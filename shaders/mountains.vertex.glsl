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
uniform vec3 viewCenter; // world position on Z plane that camera is looking at

attribute vec3 position; // position of one of the hexagon's vertices
attribute vec2 offset; // world position offset for the entire hexagon (tile)
attribute vec2 uv; // texture coordinates
attribute float extra; // extra = distance from hexagon center (0.0 = center, 1.0 = border)

// style.x = linearized 2D texture atlas offset (X = style.x & 10^0, Y = style.x & 10^1)
// style.y = 1.0 = fog of war, 0.0 otherwise
// style.z = 1.0 = clouds, 0.0 otherwise
attribute vec3 style;

varying vec3 vPosition;
varying vec2 vTexCoord;
varying float vExtra;
varying float vOcean; // 1.0 = tile is ocean, 0.0 otherwise
varying float vMountain; // 1.0 = tile is mountain, 0.0 otherwise
varying float vFogOfWar; // 1.0 = tile is in fog of war, 0.0 otherwise
varying float vClouds; // 1.0 = tile is under clouds, 0.0 otherwise

void main() {
    float uvShiftX = 10.0 * (style.x / 10.0 - floor(style.x / 10.0));
    float uvShiftY = floor(style.x / 10.0);

    vOcean = (style.x == 12.0 ? 1.0 : 0.0);
    vMountain = (style.x == 20.0) ? 1.0 : 0.0;
    float clouds = style.z > 0.0 ? 1.0 : 0.0;

    vec3 pos = vec3(offset.x + position.x, offset.y + position.y, 0);

    if (vMountain > 0.0 && extra < 0.95 && clouds == 0.0) {
        pos.z = mod(uv.s + pos.s * 0.2, 1.0);
    }

    if (clouds > 0.0) {
        pos.z += 1.0;
    }

    bool wrapAround = false;

    if (wrapAround) {
        float mapWidth = size * sqrt(3.0);
        float wrapAroundX = mod(pos.x - viewCenter.x, mapWidth);
        float center = viewCenter.x - mapWidth / 2.0;
        pos.x = center + wrapAroundX;
    }

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    vPosition = pos;

    vTexCoord = uv;
    vTexCoord.x /= 4.0;
    vTexCoord.y = 1.0 - vTexCoord.y / 4.0;
    vTexCoord.x += uvShiftX * (1.0 / 4.0);
    vTexCoord.y -= uvShiftY * (1.0 / 4.0);

    vExtra = extra;
    vFogOfWar = style.y;
    vClouds = style.z;
}