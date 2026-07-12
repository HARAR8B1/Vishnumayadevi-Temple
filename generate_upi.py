import urllib.request
import os

font_path = "NotoSansTamil-Regular.ttf"
if not os.path.exists(font_path):
    print("Downloading Tamil font...")
    url = "https://github.com/googlefonts/noto-fonts/raw/main/hinted/ttf/NotoSansTamil/NotoSansTamil-Regular.ttf"
    try:
        urllib.request.urlretrieve(url, font_path)
    except Exception as e:
        print("Failed to download font:", e)

from PIL import Image, ImageDraw, ImageFont
import qrcode

width = 800
height = 1000
img = Image.new('RGB', (width, height), color='white')
draw = ImageDraw.Draw(img)

# Draw borders
draw.rectangle([10, 10, width-10, height-10], outline='green', width=5)
draw.rectangle([20, 20, width-20, height-20], outline='orange', width=15)

try:
    font_large = ImageFont.truetype(font_path, 40)
    font_medium = ImageFont.truetype(font_path, 30)
    font_small = ImageFont.truetype(font_path, 24)
except Exception as e:
    print("Could not load font:", e)
    font_large = font_medium = font_small = ImageFont.load_default()

color_dark_blue = (0, 51, 102)

qr = qrcode.QRCode(version=1, box_size=12, border=2)
qr.add_data("upi://pay?pa=8148692490@iob&pn=VISHNU MAYA DEVI AMMAN TEMPLE")
qr.make(fit=True)
qr_img = qr.make_image(fill_color="black", back_color="white").convert('RGB')

qr_w, qr_h = qr_img.size
qr_x = (width - qr_w) // 2
qr_y = 300
img.paste(qr_img, (qr_x, qr_y))

def draw_text_center(text, y, font, fill):
    bbox = draw.textbbox((0, 0), text, font=font)
    w = bbox[2] - bbox[0]
    x = (width - w) // 2
    draw.text((x, y), text, font=font, fill=fill)

draw_text_center("இந்தியன் ஓவர்சீஸ் வங்கி", 100, font_large, color_dark_blue)
draw_text_center("INDIAN OVERSEAS BANK", 160, font_medium, color_dark_blue)

draw_text_center("எந்தவொரு UPI செயலியிலிருந்தும் பணம் செலுத்த ஸ்கேன் செய்யவும்", 240, font_small, color_dark_blue)

draw_text_center("விஷ்ணு மாயா தேவி அம்மன் ஆலயம்", qr_y + qr_h + 40, font_large, color_dark_blue)
draw_text_center("VISHNU MAYA DEVI AMMAN TEMPLE", qr_y + qr_h + 100, font_medium, color_dark_blue)

draw_text_center("UPI ID: 8148692490@iob", qr_y + qr_h + 160, font_medium, color_dark_blue)

os.makedirs("pictures", exist_ok=True)
output_path = "pictures/UPI_Tamil.png"
img.save(output_path)
print("Image generated successfully at", output_path)
