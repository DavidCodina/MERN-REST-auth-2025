export default {
  plugins: {
    // https://tailwindcss.com/docs/using-with-preprocessors
    // Before v4.0, if you wanted to inline other CSS files using
    // @import you’d have to configure another plugin like postcss-import to handle it for you.
    // This is now baked into @tailwindcss/postcss.
    // ❌ 'postcss-import': {},
    // You no longer need to install @tailwindcss/nesting.
    // This works out of the box:
    // ❌  '@tailwindcss/nesting': {},
    //^ At least for a basic Vite build, it doesn't seem like we even need @tailwindcss/postcss@next postcss postcss-import.
    //^ Even when main.css uses the alternate syntax:
    //^
    //^   @layer theme, base, components, utilities;
    //^   @import 'tailwindcss/theme' layer(theme);
    //^   @theme {}
    //^   @import 'tailwindcss/preflight' layer(base);
    //^   @layer base { }
    //^   @layer components {}
    //^   @import 'tailwindcss/utilities' layer(utilities);
    //^
    //^ Moreover, there seems to be an issue where Vite isn't recompiling:
    //^ https://github.com/tailwindlabs/tailwindcss/issues/14800
    //^ However, this seems to be a postcss issue...
    //^
    //^ '@tailwindcss/postcss': {}
    // ❌ tailwindcss: {}
    // When building for production, Tailwind CSS v4.0 runs your CSS through Lightning CSS automatically,
    // which handles things like vendor prefixes, modern feature transpilation, minification, and more.
    // ❌ autoprefixer: {}
  }
}
