"""
CLI Entrypoint for Planetary Terrestrial-Lunar Analog Pipeline
NASA Space Apps Challenge 2026
"""

import sys
import os
import argparse

# Add repository root to path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from src.pipeline import PlanetaryAnalogPipeline


def main():
    parser = argparse.ArgumentParser(
        description="Discover and characterize terrestrial analog sites on Earth matching lunar base topography."
    )
    parser.add_argument(
        "--earth_dem",
        type=str,
        default="Data/Earth_Data/s01w047.hgt",
        help="Path to Earth elevation data model (SRTM HGT or GeoTIFF)"
    )
    parser.add_argument(
        "--moon_dem",
        type=str,
        default="Data/Moon_Data/ldem_16_float.img",
        help="Path to Moon elevation data model (LOLA LDEM float32 IMG)"
    )
    parser.add_argument(
        "--output_dir",
        type=str,
        default="outputs",
        help="Directory to save generated CSV deliverable and figures"
    )

    args = parser.parse_args()

    pipeline = PlanetaryAnalogPipeline(
        earth_hgt_path=args.earth_dem,
        moon_dem_path=args.moon_dem,
        output_dir=args.output_dir
    )
    pipeline.run()


if __name__ == "__main__":
    main()
