import { ExtrudeGeometry, Shape, ShapeGeometry, type BufferGeometry } from "three";

/** A rectangle with round corners, centred on the origin. */
export function roundedRect(width: number, height: number, radius: number): Shape {
  const x = -width / 2;
  const y = -height / 2;
  const r = Math.min(radius, width / 2, height / 2);
  const shape = new Shape();
  shape.moveTo(x + r, y);
  shape.lineTo(x + width - r, y);
  shape.absarc(x + width - r, y + r, r, -Math.PI / 2, 0, false);
  shape.lineTo(x + width, y + height - r);
  shape.absarc(x + width - r, y + height - r, r, 0, Math.PI / 2, false);
  shape.lineTo(x + r, y + height);
  shape.absarc(x + r, y + height - r, r, Math.PI / 2, Math.PI, false);
  shape.lineTo(x, y + r);
  shape.absarc(x + r, y + r, r, Math.PI, Math.PI * 1.5, false);
  return shape;
}

/** A flat shape whose UVs run 0 to 1 across its bounds, for textures. */
export function flatShape(shape: Shape, width: number, height: number, segments = 16): ShapeGeometry {
  const geometry = new ShapeGeometry(shape, segments);
  const position = geometry.attributes.position;
  const uv = geometry.attributes.uv;
  for (let i = 0; i < position.count; i++) {
    uv.setXY(i, position.getX(i) / width + 0.5, position.getY(i) / height + 0.5);
  }
  uv.needsUpdate = true;
  return geometry;
}

/** A shape pushed into 3D with soft, rounded edges, centred on all axes. */
export function puffy(shape: Shape, depth: number, bevel: number, curveSegments = 24): BufferGeometry {
  const geometry = new ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel * 0.9,
    bevelSegments: 6,
    curveSegments,
  });
  geometry.center();
  geometry.computeVertexNormals();
  return geometry;
}
