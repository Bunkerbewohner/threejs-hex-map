//
// Fragment Shader for Land
//

precision highp float;
uniform float sineTime;
uniform float zoom;
uniform sampler2D texture;
uniform sampler2D hillsNormal;
uniform sampler2D coastAtlas;
uniform sampler2D riverAtlas;

varying vec2 vUV;
varying vec2 vTexCoord;
varying vec3 vPosition;
varying float vExtra;
varying float vFogOfWar;
varying float vHill;
varying vec2 vOffset;
varying vec2 vCoastTextureCell;
varying vec2 vRiverTextureCell;

const vec3 cameraPos = vec3(0, -25.0, 25.0);
//const vec3 lightPos = vec3(500.0, 1000.0, 500.0);
const vec3 lightPos = vec3(1000.0, 1000.0, 1000.0);
const vec3 lightAmbient = vec3(0.3, 0.3, 0.3);
const vec3 lightDiffuse = vec3(1.3, 1.3, 1.3);

void main() {
    // LAND
    vec4 texColor = texture2D(texture, vTexCoord);
    vec3 normal = vec3(0.0, 1.0, 0.0);

    if (vHill > 0.0) {
        normal = normalize((texture2D(hillsNormal, vTexCoord * 0.75 + vOffset * 0.5).xyz * 2.0) - 1.0);

        normal = mix(normal, vec3(0.0, 1.0, 0.0), vExtra * vExtra);
    }

    vec3 lightDir = normalize(lightPos - vPosition);
    float lambertian = max(dot(lightDir, normal), 0.0);
    //lambertian = sqrt(lambertian);

    vec3 color = lightAmbient * texColor.xyz + lambertian * texColor.xyz * lightDiffuse;
    gl_FragColor = vec4(color, 1.0);    

    // Coast
    vec2 coastUv = vec2(vCoastTextureCell.x / 8.0 + vUV.x / 8.0, 1.0 - (vCoastTextureCell.y / 8.0 + vUV.y / 8.0));
    vec4 coastColor = texture2D(coastAtlas, coastUv);

    if (coastColor.w > 0.0) {
        vec3 coast = lightAmbient * coastColor.xyz + lambertian * coastColor.xyz * lightDiffuse;
        gl_FragColor = mix(gl_FragColor, vec4(coast, 1.0), coastColor.w);
    }

    // River
    vec2 riverUv = vec2(vRiverTextureCell.x / 8.0 + vUV.x / 8.0, 1.0 - (vRiverTextureCell.y / 8.0 + vUV.y / 8.0));
    vec4 riverColor = texture2D(riverAtlas, riverUv);

    if (riverColor.w > 0.0) {
        vec3 river = lightAmbient * riverColor.xyz + lambertian * riverColor.xyz * lightDiffuse;
        //gl_FragColor = mix(gl_FragColor, vec4(river, 1.0), riverColor.w);
        gl_FragColor = mix(gl_FragColor, vec4(river, 1.0), riverColor.w);
    }

    if (vExtra > 0.97 && true) { // hex border
        float f = clamp(0.5 * vExtra - zoom * 0.005, 0.0, 1.0); //0.8;
        f = 0.34;
        gl_FragColor = mix(vec4(.9, .9, .7, 1.0), gl_FragColor, 1.0 - f);
    }

    // FOW
    //gl_FragColor = gl_FragColor * (vFogOfWar > 0.0 ? 0.66 : 1.0);

    //gl_FragColor = vec4(vTexCoord.x, vTexCoord.y, 0, 1.0);
}