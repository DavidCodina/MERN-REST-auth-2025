import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  stories: [
    '../src/**/*.mdx',
    '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'
    // Gotcha: Initially, I did this, which could be okay.
    // However, if/when we add in the example app, it breaks storybook.
    // '../**/*.stories.@(js|jsx|ts|tsx)',
    // '../**/story.@(js|jsx|ts|tsx)'

    ///////////////////////////////////////////////////////////////////////////
    //
    // Gotcha: this is no longer working: " Unable to index files..."
    //
    //   '../src/**/story.@(js|jsx|ts|tsx)'
    //
    // For some dumb reason this is related to storyStoreV7: true below.
    // TL;DR do storyStoreV7: false,
    //
    // https://github.com/storybookjs/storybook/issues/21414
    // In August of 2023 yannbf gave a detailed explanation of why it's important
    // to now name your files *.stories.*
    //
    // Long story short, it's probably a bad idea to set storyStoreV7: false
    // People are definitely annoyed, and also note that Storybook is notoriously
    // buggy when it comes to installation. In any case, just name the stories
    // according to the convention.
    //
    ///////////////////////////////////////////////////////////////////////////
  ],
  addons: [
    '@storybook/addon-onboarding',
    '@storybook/addon-links',
    '@storybook/addon-essentials', //  '@storybook/addon-actions'
    '@chromatic-com/storybook',
    '@storybook/addon-interactions',
    '@storybook/addon-themes'
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {}
  },

  // By default it was docs: { autodocs: 'tag'}
  // That setting would mean that any .stories.tsx file that had tags: ['autodocs'],
  // in the meta would get docs. However, I actually always want the docs.
  docs: {
    autodocs: true // 'tag'
  }
}
export default config
