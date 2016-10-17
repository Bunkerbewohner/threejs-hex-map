import sys
import re
import os.path
import math

from glob import glob
from PIL import Image

folder = sys.argv[1]

# list PNGs matching the pattern
files = [file for file in glob(folder + "\\*.png") if re.search(r".*[10]{6}\.png", file)]

image_size = 2048
cell_size = 256

img = Image.new("RGBA", (image_size, image_size), None)

print("Found %s images" % len(files))

for file in files:
    bits = os.path.basename(file).replace(".png", "")
    index = int(bits, 2)
    col = int(index % (image_size / cell_size))
    row = int(math.floor(index / (image_size / cell_size)))

    texture = Image.open(file)
    img.paste(texture, (col * cell_size, row * cell_size))

img.save("coast-diffuse.png")