To convert a PNG image to a base64-encoded string suitable for use in a CSS file, you can use a command-line tool like `base64`. Here's how you can do it:

## Batch download images

E.g. by running: `curl -s https://vampire-survivors.fandom.com/wiki/Weapons#Base_Weapons | grep -Eo '/vampire-survivors/images/[0-9]+/[0-9]+/[^"]+\.png' | sed 's|^|https://static.wikia.nocookie.net|' | xargs -n 1 -P 5 wget -P ~/Downloads`

### Using the Command Line

1. **Open your terminal.**

2. **Run the following command:**

   ```bash
   base64 -w 0 your-image.png
   ```

   - Replace `your-image.png` with the path to your PNG file.
   - The `-w 0` option ensures that the output is a single line, which is useful for embedding in CSS.

3. **Add the necessary prefix to the output:**

   Once you have the base64 string, you need to prepend it with `data:image/png;base64,` to use it in a CSS file.

### Example

Suppose you have a file named `icon.png`. You would run:

```bash
base64 -w 0 icon.png
```

This will output a long string. You would then prepend this string with `data:image/png;base64,` to use it in your CSS:

```css
.icon-example {
    background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADYAAAA6BAMAAAAJqbeVAAAABGdBTUEAALG...");
}
```

### Using Online Tools

Alternatively, you can use online tools to convert images to base64. Simply upload your image, and the tool will provide you with the base64 string, which you can then use in your CSS.
