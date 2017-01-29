export const MOUNTAINS_VERTEX_SHADER = `
//
// Vertex Shader for Land
//


precision highp float;

uniform float sineTime; // oscillating time [-1.0, 1.0]
uniform float zoom; // camera zoom factor
uniform float size; // quadratic map size (i.e. size=10 means 10x10 hexagons)
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat3 normalMatrix;
uniform mat4 modelMatrix;
uniform vec3 camera; // camera position in world space

uniform vec3 lightDir;

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

// type of terrain on surrounding tiles as texture atlas cell index (like style.x)
// is -1 if there is no neighbor (e.g. at the border of the map)
attribute vec3 neighborsEast; // x = NE, y = E, z = SE
attribute vec3 neighborsWest; // x = SW, y = W, z = NW 

varying vec3 vPosition;
varying vec2 vTexCoord;
varying float vExtra;
varying float vFogOfWar; // 1.0 = shadow, 0.0 = no shadow
varying float vHill;
varying float vHidden; // 1.0 = hidden, 0.0 = visible
varying vec2 vOffset;
varying vec3 vLightDirT;
varying vec3 vNeighborsEast;
varying vec3 vNeighborsWest;

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

mat3 tangentSpace(vec3 normal_ws, vec3 tangent, mat4 worldMatrix) {
    vec3 binormal = cross(tangent, normal_ws);
    mat3 M;
    M[0] = normalize(binormal);
    M[1] = normalize(tangent);
    M[2] = normalize(normal_ws);
    
    return mat3(modelMatrix) * M;
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
    
    vNeighborsEast = neighborsEast;
    vNeighborsWest = neighborsWest;
    
    mat3 T = tangentSpace(vec3(0.0, 1.0, 0.0), vec3(0.0, 0.0, 1.0), modelMatrix);
    vLightDirT = normalize(T * lightDir);
}
`