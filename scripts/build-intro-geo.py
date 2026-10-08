"""Builds public/geo/intro.json, the map data for the opening sequence.

The sequence flies from the world to India, Jharkhand and Ranchi. This script
turns Natural Earth data (public domain, naturalearthdata.com) into one small
file the page loads:

- dots: points spread evenly over the globe (a Fibonacci sphere), kept where
  there is land, as [lat x 10, lon x 10, flag] with flag 1 inside India;
- india: India's outline, from Natural Earth's India point-of-view countries,
  which follow India's official boundaries;
- jharkhand: the state's outline;
- ranchi: [lon, lat].

Run once, from the project root (needs Python 3 and `pip install shapely`):

    python3 scripts/build-intro-geo.py

It downloads about 55 MB of source data. Set GEO_CACHE to a folder to keep
the downloads between runs.
"""
import json
import math
import os
import tempfile
import urllib.request

from shapely.geometry import MultiPolygon, Point, Polygon, shape
from shapely.ops import unary_union
from shapely.prepared import prep

SOURCE = "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson"
FILES = {
    "land": "ne_50m_land.geojson",
    "countries": "ne_10m_admin_0_countries_ind.geojson",
    "states": "ne_10m_admin_1_states_provinces.geojson",
}
DOTS = 32000
RANCHI = (85.3096, 23.3441)
OUT = os.path.join(os.path.dirname(__file__), "..", "public", "geo", "intro.json")


def load(name: str, cache: str) -> dict:
    path = os.path.join(cache, FILES[name])
    if not os.path.exists(path):
        print("downloading", FILES[name])
        urllib.request.urlretrieve(f"{SOURCE}/{FILES[name]}", path)
    with open(path) as f:
        return json.load(f)


def rings(geometry, tolerance: float, min_area: float) -> list:
    """Outer rings of the polygons worth drawing, simplified, as [[lon, lat], ...]."""
    simple = geometry.simplify(tolerance, preserve_topology=True)
    polygons = list(simple.geoms) if isinstance(simple, MultiPolygon) else [simple]
    out = []
    for polygon in sorted(polygons, key=lambda p: -p.area):
        if isinstance(polygon, Polygon) and polygon.area >= min_area:
            out.append([[round(x, 3), round(y, 3)] for x, y in polygon.exterior.coords])
    return out


def main() -> None:
    cache = os.environ.get("GEO_CACHE") or tempfile.mkdtemp(prefix="geo-")
    land = prep(unary_union([shape(f["geometry"]) for f in load("land", cache)["features"]]))
    india = next(
        shape(f["geometry"]) for f in load("countries", cache)["features"] if f["properties"].get("ADM0_A3") == "IND"
    )
    jharkhand = next(
        shape(f["geometry"]) for f in load("states", cache)["features"] if f["properties"].get("name") == "Jharkhand"
    )
    in_india = prep(india)

    golden = math.pi * (3 - math.sqrt(5))
    dots = []
    for i in range(DOTS):
        lat = math.degrees(math.asin(1 - 2 * (i + 0.5) / DOTS))
        lon = math.degrees((golden * i) % (2 * math.pi)) - 180
        point = Point(lon, lat)
        if in_india.contains(point):
            dots += [round(lat * 10), round(lon * 10), 1]
        elif land.contains(point):
            dots += [round(lat * 10), round(lon * 10), 0]

    data = {
        "source": "Natural Earth (public domain); India's outline from its India point-of-view countries",
        "dots": dots,
        "india": rings(india, 0.04, 0.05),
        "jharkhand": rings(jharkhand, 0.005, 0.5)[0],
        "ranchi": list(RANCHI),
    }
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, "w") as f:
        json.dump(data, f, separators=(",", ":"))
    print(
        f"{len(dots) // 3} land dots ({sum(dots[2::3])} in India), "
        f"India {len(data['india'])} rings / {sum(len(r) for r in data['india'])} points, "
        f"Jharkhand {len(data['jharkhand'])} points -> {os.path.getsize(OUT) // 1024} KB"
    )


if __name__ == "__main__":
    main()
