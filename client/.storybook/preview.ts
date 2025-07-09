import { Preview } from '@storybook/react'
import { withThemeByClassName } from '@storybook/addon-themes'
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import '../src/styles/main.css'

const preview: Preview = {
  decorators: [
    withThemeByClassName({
      themes: {
        light: '',
        ///////////////////////////////////////////////////////////////////////////
        //
        // This is for switching the Tailwind theme to 'dark' for components.
        // It is NOT for switching the Storybook theme.
        // https://github.com/storybookjs/storybook/issues/26242
        // The themes addon is concerned with theming your components, not theming the docs.
        //
        //   "[Themeing Storybook itself...] is more of a feature request than a bug, but I agree
        //   that this is annoying shortcoming of Storybook today and something the themes addon could fix.
        //   We are discussing possible theming improvements as part of 8.x, so this could be a good area to invest in."
        //
        ///////////////////////////////////////////////////////////////////////////
        dark: 'dark'
      },
      defaultTheme: 'light'
    })
  ],

  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    },
    viewport: {
      viewports: INITIAL_VIEWPORTS
    },
    options: {
      // https://storybook.js.org/docs/react/writing-stories/naming-components-and-hierarchy
      // Stories can also be sorted usign a sort function, but that look kind of complicated.
      storySort: {
        // method: '',
        // stories that don't match an item in the order list will appear after the items in the list.
        order: ['Example', 'Components', ['TWCounter']]
        // locales: '',
      }
    }
  }
}

export default preview
