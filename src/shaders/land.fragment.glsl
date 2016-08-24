//
// Fragment Shader for Land
//

precision highp float;
uniform float sineTime;
uniform float zoom;
uniform sampler2D terrainTex;

varying vec2 vTexCoord;
varying vec3 vPosition;
varying float vExtra;
varying float vOcean;
varying float vMountain;
varying float vFogOfWar;
varying float vClouds;

void main() {
    if (vMountain > 0.0)
    {
        // MOUNTAIN
        vec4 textureColor = texture2D(terrainTex, vTexCoord);
        gl_FragColor = textureColor;
    }
    else if (vOcean > 0.0)
    {
        // OCEAN
        vec4 texColor = texture2D(terrainTex, vTexCoord);
        gl_FragColor = vec4(texColor.x, texColor.y, texColor.z, 1.0);
    }
    else
    {
        // LAND
        vec4 texColor = texture2D(terrainTex, vTexCoord);
        gl_FragColor = texColor;
    }

    if (vExtra > 0.94 && true) {
        // hex border
        float f = clamp(0.5 * vExtra - zoom * 0.005, 0.0, 1.0); //0.8;
        gl_FragColor = mix(vec4(0.9, 0.9, 0.7, 1.0), gl_FragColor, 1.0 - f);
    }

    // FOW
    gl_FragColor = gl_FragColor * (vFogOfWar > 0.0 ? 0.66 : 1.0);

    // Clouds
    if (vClouds > 0.0) {
        gl_FragColor = vec4(0.9, 0.9, 0.9, 1.0);
    }
}