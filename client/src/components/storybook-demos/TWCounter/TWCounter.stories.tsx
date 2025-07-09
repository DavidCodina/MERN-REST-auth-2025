import { useState } from 'react'
import {
  Decorator,
  Meta,
  // CSF3 : Component Story Format 3
  // https://www.youtube.com/watch?v=P0WHt_L0-2g
  // https://www.youtube.com/watch?v=uH9_dfc-6Kc
  StoryObj,
  StoryFn
  // StoryContext
} from '@storybook/react'
import { userEvent /* , waitFor */, within, expect, fn } from '@storybook/test'
// import { withActions } from '@storybook/addon-actions/decorator'
// import { action } from '@storybook/addon-actions'
import { TWCounter, Props } from './index'

/* ========================================================================
                                meta
======================================================================== */

const meta: Meta<typeof TWCounter> = {
  // Id of the component (prefix of the story id) which is used for URLs.
  // By default is inferred from sanitizing the title
  //# id

  // includeStories: [],
  // Used to exclude certain named exports. Useful when you want to have
  // non-story exports such as mock data or ignore a few stories.
  // excludeStories: ['ClickTest'],

  // If title is omitted, the goup will be the parent folder: storybook-demos
  title: 'Components/TWCounter',
  component: TWCounter,

  //# subcomponents
  //# play
  //# globals // interface Globals { [name: string]: any; }

  args: {
    // Spying on the onClick will produce an action output of `onClick: (1) [1]`
    // It will essentially overwrite the argTypes.action string of `click` below.
    // Pesonally, I prefer using the simple argTypes.action over the fn() spy.
    onClick: fn(() => {
      console.log('Hello')
    }),
    onPointerDown: fn(),

    // Setting args here will add them to the Default column of the docs table.
    className: '',
    style: {}
  },

  // See here for the argTypes type:
  // https://storybook.js.org/docs/api/arg-types#argtypes

  // See here for controls: https://storybook.js.org/docs/essentials/controls#configuration
  argTypes: {
    // onMouseOver: {
    //   action: 'mouseover'
    // },
    onClick: {
      // name: 'THIS WILL OVERWRITE `onClick` AS THE NAME',
      description: 'A function that will be called when the button is clicked.',
      type: 'function',
      action: 'click',

      control: {
        type: 'select',
        // By default, labels derive from options unless explicitly defined.
        labels: {
          log: 'Log Function',
          alert: 'Alert Function'
        }
      },

      options: ['log', 'alert'],

      // The action:'clicked' spy will not work when switching to log or alert.
      mapping: {
        log: (newCount: number) => console.log(`The count is now: ${newCount}`),
        alert: (newCount: number) =>
          setTimeout(() => {
            alert(`The count is now: ${newCount}`)
          }, 500)
      }
    },
    // Tailwind classes will not necessarily work here because of the way
    // the just-in-time compiler works.
    className: {
      control: 'text',
      description: 'The className to apply to the button.'
    },
    style: {
      control: 'object',
      description: 'The CSSProperties style object to apply to the button.'
    },

    children: {
      // Unfortunately, HTML strings don't work for the name property.
      // ❌ name: "<code style='color:#ec4899;'>children</code>",
      description: `<p>Children can be <code style="color:#ec4899;">ReactNode</code> or:<br/>
      <code style="color:#ec4899;">(count: number) => ReactNode</code><br/>
      However, when the control is set to <code style="color:#ec4899;">'object'</code>, 
      it ends up breaking the example, so we have to limit it with a select or radio.</p>`,
      // control: 'select', // Shortand approach

      control: {
        type: 'select',
        // By default, labels derive from options unless explicitly defined.
        labels: {
          Text: 'Text children',
          JSX: 'JSX children'
        }
      },
      options: ['Text', 'JSX'],

      mapping: {
        Text: (count: number) => {
          return `Text: ${count}`
        },
        JSX: (count: number) => {
          return (
            <div>
              🤪 <i>Crazy Count</i>: {count}
            </div>
          )
        }
      }
    }
  },

  ///////////////////////////////////////////////////////////////////////////
  //
  // This decorator is a more verbose way of achieving the same behavior as
  // what `mapping` does above. Don't do this! It's just here for demonstration.
  //
  // decorators: [
  //   (Story, context) => {
  //     if (context.args.children === 'Text') {
  //       // Passing a function here works because TWCounter can actually be ReactNode or (count: number) => ReactNode
  //       context.args.children = (count: number) => {
  //         return `Text: ${count}`
  //       }
  //     }
  //
  //     if (context.args.children === 'JSX') {
  //       context.args.children = (count: number) => {
  //         return (
  //           <div>
  //             🤪 <i>Crazy Count</i>: {count}
  //           </div>
  //         )
  //       }
  //     }
  //     return <Story />
  //   }
  // ],
  //
  ///////////////////////////////////////////////////////////////////////////
  parameters: {
    componentSubtitle: 'An amazing TWCounter component!',
    // Optional parameter to center the component in the Canvas.
    // More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
    docs: {
      description: {
        component: `<div><p>This is the description...</p></div>`
      }
      ///////////////////////////////////////////////////////////////////////////
      //
      // DocBlocks:
      //
      // https://storybook.js.org/docs/writing-docs/doc-blocks
      // https://www.youtube.com/watch?v=uAA1JvLcl-w
      // https://www.youtube.com/watch?v=q8SY4yyNE6Q
      //
      // Use: import { Title, Description, Subtitle, Source, Primary, Canvas, ArgTypes, Stories, Story, Controls } from "@storybook/blocks"
      // Or use: import * as DocBlock from "@storybook/blocks"
      //
      // Note: While you can do this at a component level, it makes more sense to implement this
      // from within .storybook/preview.tsx (make sure to change to .tsx) parameters.docs.page.
      //
      //   page: () => {
      //     return <>{/* CUSTOM DOCS PAGE */}</>
      //   }
      //
      ///////////////////////////////////////////////////////////////////////////
    }
  }

  ///////////////////////////////////////////////////////////////////////////
  //
  // This component will have an automatically generated Autodocs entry:
  // https://storybook.js.org/docs/writing-docs/autodocs
  // This is configurable from .storybook/main.ts: docs: { autoddcs: "tag" }
  // However, I actaully set it to "autodocs": true
  // See here at 20:45: https://www.youtube.com/watch?v=CuGZgYo6-XY
  // tags: ['autodocs'],
  //! Update this in the library...
  //
  ///////////////////////////////////////////////////////////////////////////
}
// Using satisfies is an alternative to using :Meta<typeof TWCounter>
// Some examples in the docs use the :Meta<typeof TWCounter>
// However, the default stories/ use the satisfies approach
// satisfies Meta<typeof TWCounter>

export default meta
type Story = StoryObj<typeof meta>

/* ======================
       Template
====================== */
// This is an older way of writing stories that uses the Template + StoryFn pattern.
// This pattern uses a function to create a story, as you're currently doing. It’s more
// verbose but offers a lot of flexibility. See GreenButton below.
// That said, there's a new way of accomplishing a similar implementation using parameters.render.
// You should use that instead because StorFn may get deprecated (???).

const Template: StoryFn<typeof TWCounter> = (args) => {
  // Add state, or other contextual logic as needed...
  return (
    <>
      <TWCounter {...args} />
    </>
  )
}

/* ========================================================================
                                Stories
======================================================================== */

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
// See https://storybook.js.org/docs/writing-stories/play-function#working-with-the-canvas
// to learn more about using the canvasElement to query the DOM

/** The default example... */
export const Default: Story = {
  args: {
    className: 'my-default-button'
  }
  // parameters: {
  //   actions: {

  //     // Using handles + decorators: [withActions] is an alternate way of detecting actions/events.
  //     // https://storybook.js.org/docs/essentials/actions#action-event-handlers
  //     handles: ['mouseover', 'mousedown', 'pointerdown .my-default-button']
  //   }
  // },
  // decorators: [withActions]
}

/* ======================

====================== */

export const GreenButton = Template.bind({})
GreenButton.args = { className: 'bg-green-500 border-green-700' }
GreenButton.parameters = {
  // https://storybook.js.org/docs/writing-stories/parameters
  // https://www.youtube.com/watch?v=u32vmGVJY2U
  // You can also move this up from the story to the meta.
  // To include them at a global level, then add them to .storybook/preview.ts
  backgrounds: {
    default: 'white',
    values: [
      { name: 'black', value: '#000' },
      { name: 'white', value: '#fff' },
      { name: 'body color', value: 'rgb(237, 242, 249)' },
      { name: 'tan', value: 'tan' }
    ]
  },

  docs: {
    description: {
      story: `<p>This is the <b>description</b>...</p>`
    }
  }
}

// https://storybook.js.org/docs/writing-stories/decorators
GreenButton.decorators = [
  (Story, context) => {
    const [bg, setBg] = useState('#fff')

    context.args.onClick = () => {
      setBg((prev) => {
        return prev === '#fff' ? '#000' : '#fff'
      })
    }

    return (
      <div
        style={{
          backgroundColor: bg,
          border: '1px dashed #888',
          borderRadius: 5,
          padding: '25px 50px'
        }}
      >
        <Story />
      </div>
    )
  }
]

/* ======================

====================== */

export const PinkButton: Story = {
  args: { className: 'bg-pink-500 border-pink-700' },

  parameters: {
    docs: {
      description: {
        story: `<p>This is the pink <code>TWCounter</code>...</p>`
      }
    },

    // https://storybook.js.org/docs/essentials/viewport
    // https://www.youtube.com/watch?v=uydF1ltw7-g
    viewport: {
      defaultViewport: 'iphone6' // 'ipad' | 'responsive'  | ...
    }

    //# https://storybook.js.org/docs/essentials/actions
    //actions: {}

    // https://storybook.js.org/docs/configure/features-and-globals#globals
    // layout

    // https://storybook.js.org/docs/styling/css-preprocessors
    // themes

    //  https://storybook.js.org/addons/storybook-addon-a11y
    // a11y

    // https://www.chromatic.com/docs/storybook-integration/
    // chromatic
  },

  // This is an improvement on the Template pattern.
  // However, it's still not necessary to do this.
  // See NeutralCounter where we simply implement a decorator to create the surrounding context.
  render: (args) => {
    return (
      <>
        <TWCounter {...args} />
      </>
    )
  }
}

/* ======================
      NeutralButton
====================== */
// https://storybook.js.org/docs/writing-stories/decorators
// https://www.youtube.com/watch?v=4yi_yCTkgng

const withBGStateDecorator: Decorator = (Story, context) => {
  // const { args, argTypes, globals, hooks, parameters, viewMode } = context
  const [bg, setBg] = useState('#fff')

  context.args.onClick = (_newCount: number) => {
    setBg((v) => (v === '#fff' ? '#000' : '#fff'))
  }

  return (
    <div
      style={{
        backgroundColor: bg,
        border: '1px dashed #888',
        borderRadius: 5,
        padding: '25px 50px'
      }}
    >
      <Story />
    </div>
  )
}

export const NeutralCounter: Story = {
  args: {
    className: 'bg-neutral-500 border border-neutral-700',
    title: 'Button With Decorator',
    children: (count: any) => `Clicks: ${count}`
    // children: 'Toggle Background'
  },

  parameters: {
    docs: {
      description: {
        story: `<p>This is the neutral <code>TWCounter</code>...</p>`
      }
    }
  },

  decorators: [withBGStateDecorator]
}

/* ======================
      OrangeCounter
====================== */
// Here, I've completely omitted the Typescript typing. However,
//  it's beter to include it. This example is mainly just to demonstrate
// yet another way of creating a story...

/** This is a very simple story. It exports a function that directly returns the TWCounter component instance.
 * Despite its simplicity, this is still a valid way of creating a story.
 */
export const OrangeCounter /* : StoryFn<typeof TWCounter> */ = (
  args: Props
) => <TWCounter {...args} className='border-orange-700 bg-orange-500' />
//  ClassAttributes<HTMLButtonElement> & ButtonHTMLAttributes<HTMLButtonElement>

// This will still work even without the StoryFn  Typescript typing.
OrangeCounter.args = {
  style: { outline: '2px dashed #333' }
}

// This will still work even without the StoryFn Typescript typing.
// OrangeCounter.parameters = {
//   docs: {
//     description: {  story: `<p>This is the orange <code>TWCounter</code>...</p>` }
//   }
// }

/* ======================

====================== */

// Here is an alternate way of adding a description to a particular story.
// rather than going through parameters.docs.description.story

/** This story demos the testing feature of Storybook. */
export const ClickTest: Story = {
  args: {},

  // ✅ Marius Espejo : https://www.youtube.com/watch?v=Lg-hT0O2F7E
  play: async ({ /* args, */ canvasElement, step }) => {
    // The step function can be used to create labeled groups of interactions.

    // canvas is similar to the use of screen in nomral vitest/jest testing.
    const canvas = within(canvasElement)
    const button = canvas.getByRole('button')

    ///////////////////////////////////////////////////////////////////////////
    //
    // There's an important detail that's different when using the Storybook wrapper:
    // method invocations must be await-ed. It allows you to step back and forth through
    // your interactions using the debugger. In other words, while it wouldn't normally
    // be necessary to wait the following explectations, doing so allows you to move
    // backward/forward using the play controls in the UI.
    //
    //   await expect(button).toBeInTheDocument()
    //   await expect(button).toHaveTextContent('Count: 0')
    //
    // While not technically necessary, we can also use the step method to group
    // logic. This is kind of like test() because it allows you to name the test.
    //
    ///////////////////////////////////////////////////////////////////////////

    await step('should be in document.', async () => {
      // However, in cases like this where there's one single line, we wouldn't need
      // to await it. That said, it's still a good practice when working with storbyook
      // interaction testing.
      await expect(button).toBeInTheDocument()
    })

    await step('should be correct text content.', async () => {
      await expect(button).toHaveTextContent('Count: 0')
    })

    await step(
      "should update button text to 'Count: 1' when clicked.",
      async () => {
        const user = userEvent.setup()
        await user.click(button)
        await expect(button).toHaveTextContent('Count: 1')
      }
    )
  }
}
