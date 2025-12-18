from PIL import Image
import os

def generate_icons(source_path, output_dir):
    try:
        img = Image.open(source_path)
        sizes = [48, 96, 144, 192]
        
        if not os.path.exists(output_dir):
            os.makedirs(output_dir)

        for size in sizes:
            new_img = img.resize((size, size), Image.Resampling.LANCZOS)
            output_path = os.path.join(output_dir, f"icon-{size}x{size}.png")
            new_img.save(output_path)
            print(f"Generated {output_path}")

    except Exception as e:
        print(f"Error: {e}")

source = "c:/xampp/htdocs/Yoga_Web/Frontend_Website/images/AdvayuLogo.png"
output = "c:/xampp/htdocs/Yoga_Web/Frontend_Website/images"
generate_icons(source, output)
