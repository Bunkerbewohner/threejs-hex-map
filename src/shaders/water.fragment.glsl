//
// Fragment Shader for Water
//

precision highp float;
uniform float sineTime;
uniform float zoom;
uniform sampler2D texture;
uniform sampler2D hillsNormal;

varying vec2 vTexCoord;
varying vec3 vPosition;
varying float vExtra;
varying float vFogOfWar;
varying float vHill;
varying vec2 vOffset;

const vec3 cameraPos = vec3(0, -25.0, 25.0);
const vec3 lightPos = vec3(1000.0, 1000.0, 1000.0);
const vec3 lightAmbient = vec3(0.1, 0.1, 0.1);
const vec3 lightDiffuse = vec3(1.3, 1.3, 1.3);

void main() {
    // LAND
    vec4 texColor = texture2D(texture, vTexCoord);
    vec3 normal = vec3(0.0, 1.0, 0.0);

    if (vHill > 0.0) {
        normal = normalize((texture2D(hillsNormal, vTexCoord * 1.0 + vOffset * 0.5).xyz * 2.0) - 1.0);
    }

    vec3 lightDir = normalize(lightPos - vPosition);
    float lambertian = max(dot(lightDir, normal), 0.0);

    vec3 color = lightAmbient + lambertian * texColor.xyz * lightDiffuse;
    gl_FragColor = vec4(color, 1.0);

    if (vExtra > 0.96 && true) { // hex border
        float f = clamp(0.5 * vExtra - zoom * 0.005, 0.0, 1.0); //0.8;
        gl_FragColor = mix(vec4(0.9, 0.9, 0.7, 1.0), gl_FragColor, 1.0 - f);
    }

    // FOW
    //gl_FragColor = gl_FragColor * (vFogOfWar > 0.0 ? 0.66 : 1.0);

    //gl_FragColor = vec4(vTexCoord.x, vTexCoord.y, 0, 1.0);
}