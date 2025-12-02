import os

path = r'c:\xampp\htdocs\Yoga_Web\Frontend_Website\gallarysection.html'
try:
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    split_point = '<script src="script.js"></script>'
    parts = content.split(split_point)

    if len(parts) > 1:
        # Keep the first part, add the new script, and close the file
        # We discard the old inline script which was in parts[1]
        new_content = parts[0] + split_point + '\n  <script src="js/dynamic-gallery.js"></script>\n</body>\n</html>'
        
        with open(path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print("File updated successfully.")
    else:
        print("Could not find split point.")
except Exception as e:
    print(f"Error: {e}")
