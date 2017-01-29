export const LAND_VERTEX_SHADER = `
//
// Vertex Shader for Land
//
precision mediump float;

uniform float sineTime; // oscillating time [-1.0, 1.0]
uniform float zoom; // camera zoom factor
uniform float size; // quadratic map size (i.e. size=10 means 10x10 hexagons)
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat3 normalMatrix;
uniform mat4 modelMatrix;
uniform vec3 camera; // camera position in world space

// (width, height, cellSize, cellSpacing)
uniform vec4 textureAtlasMeta;

uniform vec3 lightDir;

attribute vec3 position; // position of one of the hexagon's vertices
attribute vec2 offset; // world position offset for the entire hexagon (tile)
attribute vec2 uv; // texture coordinates
attribute float border; // border = distance from hexagon center (0.0 = center, 1.0 = border)

// style.x = texture atlas cell index
// style.y = "decimal bitmask" (fog=1xx, hills=x1x, clouds=xx1)
// style.z = coast texture index (0 - 64)
// style.w = river texture index (0 - 64)
attribute vec4 style;

// type of terrain on surrounding tiles as texture atlas cell index (like style.x)
// is -1 if there is no neighbor (e.g. at the border of the map)
attribute vec3 neighborsEast; // x = NE, y = E, z = SE
attribute vec3 neighborsWest; // x = SW, y = W, z = NW 

varying vec3 vPosition;
varying vec2 vTexCoord;
varying vec2 vUV;
varying float vExtra;
varying float vTerrain; // texture cell
varying float vFogOfWar; // 1.0 = shadow, 0.0 = visible
varying float vHidden; // 1.0 = hidden, 0.0 = visible
varying float vHill;
varying vec2 vOffset;
varying vec2 vCoastTextureCell;
varying vec2 vRiverTextureCell;
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

    //return vec2(uv.x * w + u, 1.0 - (uv.y * h + v));
    return vec2(x / cols + uv.x / cols, 1.0 - (y / rows + (1.0 - uv.y) / rows));
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

    // its a hill if style's 2nd decimal is 1, i.e. any number matching x1x, e.g. 10, 11, 110
    float hill = floor(mod(style.y / 10.0, 10.0)); // 0 = no, 1 = yes

    if (hill > 0.0 && border < 0.75) { // hill
        //pos.z = 0.1 + (0.5 + sin(uv.s + pos.s * 2.0) * 0.5) * 0.25;
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
    vFogOfWar = mod(style.y, 10.0) == 1.0 ? 1.0 : 0.0;   // style.y < 100.0 ? 10.0 : (style.y == 1.0 || style.y == 11.0 ? 1.0 : 0.0);
    vHidden = style.y >= 100.0 ? 1.0 : 0.0;
    
    mat3 T = tangentSpace(vec3(0.0, -1.0, 0.0), vec3(0.0, 0.0, 1.0), modelMatrix);
    vLightDirT = normalize(T * lightDir);
    
    vNeighborsEast = neighborsEast;
    vNeighborsWest = neighborsWest;
    
    vTerrain = style.x;
}
`