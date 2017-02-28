export const TREES_FRAGMENT_SHADER = `
precision mediump float;

uniform sampler2D texture;
uniform float alphaTest;
uniform float spritesheetSubdivisions;

varying vec3 vParams;
varying vec3 vColor;

vec2 spriteIndexToUV(float idx, vec2 uv) {
    float cols = spritesheetSubdivisions - 1e-6; // subtract small epsilon to avoid edge cases that cause flickering
    float rows = spritesheetSubdivisions;
    
    float x = mod(idx, cols);
    float y = floor(idx / cols);

    return vec2(x / cols + uv.x / cols, 1.0 - (y / rows + (uv.y) / rows));
}

void main() {
    vec2 uv = spriteIndexToUV(vParams.x, gl_PointCoord);
    vec4 diffuse = texture2D(texture, uv);
    
    float alpha = diffuse.w * vParams.z;
    
    if (alpha < alphaTest) discard;
    
    gl_FragColor = vec4(diffuse.xyz, alpha);
}
`