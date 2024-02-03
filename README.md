# Intro to Computer Graphics Final Project

This was our final project for Intro to Computer Graphics. Here's what it looks like:

https://github.com/JulianHeuser/intro-to-graphics-final/assets/25406449/8734747b-b2eb-4a72-a954-73c3df641cae

This runs in the web browser through WebGL. Here are some tidbits about it:
- Shaders are inside script tags in the main HTML file. ([scene.html](https://github.com/JulianHeuser/intro-to-graphics-final/blob/main/scene.html))
- Perlin noise is used as a hightmap for the terrain, and all terrain height is done in the vertex shader.
- [Normal data is determined by taking four samples of the heightmap](https://github.com/JulianHeuser/intro-to-graphics-final/blob/main/scene.html#L80).
