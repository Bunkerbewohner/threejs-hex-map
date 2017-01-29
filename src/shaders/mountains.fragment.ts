export const MOUNTAINS_FRAGMENT_SHADER = `
//
// Fragment Shader for Land
//

precision highp float;
uniform float sineTime;
uniform float showGrid;
uniform float zoom;
uniform sampler2D texture;
uniform sampler2D hillsNormal;
uniform sampler2D mapTexture;

uniform vec3 gridColor;
uniform float gridWidth;
uniform float gridOpacity;

varying vec2 vTexCoord;
varying vec3 vPosition;
varying float vExtra;
varying float vFogOfWar;
varying float vHill;
varying float vHidden;
varying vec2 vOffset;
varying vec3 vLightDirT;
varying vec3 vNeighborsEast;
varying vec3 vNeighborsWest;

const vec3 cameraPos = vec3(0, -25.0, 25.0);
const vec3 lightPos = vec3(1000.0, 1000.0, 1000.0);
const vec3 lightAmbient = vec3(0.08, 0.08, 0.08);
const vec3 lightDiffuse = vec3(1.3, 1.3, 1.3);

void main() {
    // LAND
    vec4 texColor = texture2D(texture, vTexCoord);
    vec3 normal = vec3(0.0, 1.0, 0.0);

    normal = normalize((texture2D(hillsNormal, vTexCoord * 1.5 + vOffset * 0.5).xyz * 2.0) - 1.0);

    //vec3 lightDir = normalize(lightPos - vPosition);
    vec3 lightDir = vLightDirT;
    float lambertian = max(dot(lightDir, normal), 0.0);

    vec3 color = lightAmbient + lambertian * texColor.xyz * lightDiffuse;
    gl_FragColor = vec4(color, 1.0);

    if (showGrid > 0.0 && vExtra > 1.0 - gridWidth) { // hex border
        gl_FragColor = mix(vec4(gridColor, 1.0), gl_FragColor, 1.0 - gridOpacity);
    }

    // FOW
    gl_FragColor = gl_FragColor * (vFogOfWar > 0.0 ? 0.66 : 1.0);

    // Map Texture for hidden tiles
    if (vHidden > 0.0) {
        gl_FragColor = texture2D(mapTexture, vec2(vPosition.x * 0.05, vPosition.y * 0.05));
    } 
}
`