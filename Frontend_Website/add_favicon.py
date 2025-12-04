import os

directory = r'c:\xampp\htdocs\Yoga_Web\Frontend_Website'
favicon_tag = '<link rel="icon" type="image/png" href="images/AdvayuLogo.png">'

for filename in os.listdir(directory):
    if filename.endswith(".html"):
        filepath = os.path.join(directory, filename)
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        if '<link rel="icon"' not in content:
            if '</head>' in content:
                new_content = content.replace('</head>', f'  {favicon_tag}\n</head>')
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"Updated {filename}")
            else:
                print(f"Skipped {filename} (no </head> tag)")
        else:
            print(f"Skipped {filename} (already has favicon)")
