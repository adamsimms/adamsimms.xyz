# Image Optimization Guide

This document explains the image optimization strategy implemented for this website.

## Overview

The site uses modern image formats and lazy loading to improve performance:
- **WebP format**: 25-35% smaller than JPEG/PNG with similar quality
- **AVIF format**: 50% smaller than JPEG (where supported)
- **Lazy loading**: Images load as they enter the viewport
- **Responsive images**: Multiple sizes for different screen sizes

## Current Images

### favicon.ico
- Purpose: Browser tab icon
- Size: 32KB
- Format: ICO (required for favicon)
- Optimization: Consider creating smaller 16x16 and 32x32 variants

### webclip.png
- Purpose: Apple touch icon, Open Graph image
- Size: 2KB
- Current size: 256x256px
- Format: PNG

## Generating Optimized Images

### Automated Generation

Run the build script to generate WebP and AVIF versions:

```bash
npm run build:images
```

Or manually:

```bash
./scripts/generate-responsive-images.sh
```

### Manual Generation with Sharp

If you have sharp-cli installed:

```bash
# Install sharp-cli globally
npm install -g sharp-cli

# Convert to WebP
sharp -i img/webclip.png -o img/webclip.webp --webp

# Convert to AVIF
sharp -i img/webclip.png -o img/webclip.avif --avif
```

## Adding New Images

When adding new images to the site:

1. **Place original in `img/` directory**
   - Use descriptive filenames (e.g., `profile-photo.jpg`)
   - Keep originals high quality

2. **Run optimization**
   ```bash
   npm run build:images
   ```

3. **Use picture element in HTML**
   ```html
   <picture>
     <source srcset="img/photo.avif" type="image/avif">
     <source srcset="img/photo.webp" type="image/webp">
     <img src="img/photo.jpg" alt="Description" loading="lazy">
   </picture>
   ```

4. **Add lazy loading** (for below-the-fold images)
   ```html
   <img 
     class="lazy"
     data-src="img/photo.jpg"
     data-srcset="img/photo.webp"
     alt="Description"
     loading="lazy"
   >
   ```

## Responsive Images

For images that need different sizes on different screens:

```html
<picture>
  <source 
    media="(min-width: 768px)"
    srcset="img/large.webp"
    type="image/webp"
  >
  <source 
    media="(min-width: 768px)"
    srcset="img/large.jpg"
  >
  <source 
    srcset="img/small.webp"
    type="image/webp"
  >
  <img 
    src="img/small.jpg" 
    alt="Description"
    loading="lazy"
  >
</picture>
```

## Best Practices

### Image Sizes
- **Hero images**: Max 1920px wide, compress to ~100-200KB
- **Thumbnails**: 300-500px wide, compress to ~20-50KB
- **Icons**: Use SVG when possible, or PNG for small sizes

### Compression
- **JPEG**: Quality 80-85 for photos
- **PNG**: Use tools like pngcrush or optipng
- **WebP**: Quality 80-85
- **AVIF**: Quality 65-75 (equivalent to JPEG 80-85)

### Alt Text
- Descriptive but concise
- Don't start with "Image of..."
- Include relevant keywords naturally

### Performance Tips
1. Lazy load all below-the-fold images
2. Use `loading="lazy"` attribute (browser native)
3. Provide width and height attributes to prevent layout shift
4. Use `fetchpriority="high"` for critical images

## Tools

### Online Tools
- [Squoosh](https://squoosh.app/) - Visual image compression
- [TinyPNG](https://tinypng.com/) - PNG/JPEG compression
- [AVIF.io](https://avif.io/) - AVIF converter

### CLI Tools
- `sharp-cli` - All-in-one image processing
- `cwebp` - Google's WebP encoder
- `avifenc` - AVIF encoder

## Browser Support

| Format | Support | Fallback |
|--------|---------|----------|
| AVIF | Chrome 85+, Firefox 93+ | WebP or JPEG |
| WebP | 95%+ of browsers | JPEG/PNG |
| JPEG | 100% | Native format |
| PNG | 100% | Native format |

## Monitoring

Track image performance:
- Lighthouse "Properly size images" audit
- Lighthouse "Next-gen formats" audit
- Chrome DevTools Network panel
- WebPageTest.org for real-world performance

## Troubleshooting

### Images not loading?
- Check file paths are correct
- Verify WebP/AVIF files were generated
- Check browser console for errors

### Images not lazy loading?
- Verify `loading="lazy"` attribute is present
- Check that lazy-load.js is loaded
- Test in browser DevTools Network panel (throttle connection)

### Build script failing?
- Ensure sharp-cli is installed: `npm install -g sharp-cli`
- Check that original images exist in `img/` directory
- Verify script has execute permissions: `chmod +x scripts/generate-responsive-images.sh`
