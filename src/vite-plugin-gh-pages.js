// Custom plugin to help with GitHub Pages deployment
export default function ghPagesPlugin() {
  return {
    name: 'vite-plugin-gh-pages',
    transformIndexHtml(html) {
      // Add base path to all assets
      return html.replace(
        /(href|src)="\/(?!\/)/g,
        '$1="/MemoryGame/'
      );
    }
  };
} 