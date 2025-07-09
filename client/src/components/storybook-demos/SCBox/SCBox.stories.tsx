import { useState } from 'react'
import {
  // StoryFn,
  StoryObj, // Use in conjunction with CSF3.
  Meta
} from '@storybook/react'
import { SCBox } from './index'
import { fn } from '@storybook/test'

/* ======================
          meta
====================== */

const meta /* : Meta<typeof SCBox> */ = {
  title: 'Components/SCBox',
  component: SCBox,

  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  // This can also be set in main.ts as docs: { autodocs: true }, then we don't need to manually specificy it in every file.
  // tags: ['autodocs'],
  // args: {}
  parameters: {
    componentSubtitle: 'A box that uses the styled components css prop.',
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered'
    // docs: {  description: { component: `<div><p>...</p></div>` }},
  },

  // https://storybook.js.org/docs/api/arg-types
  // argTypes allow us to manually implement controls that are not automatically generated.
  // This is useful for props that are implied (e.g., ComponentProps<'div'>), but not
  // explicitly stated by the component props.
  argTypes: {
    style: {
      control: 'object',
      description: 'An object of CSS Properties.'
    },

    css: { control: 'text' }
    // This is already inferred because it's explicitly stated in the prop destructuring.
    // className: { control: 'text' }
  },

  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: { onClick: fn() }
} satisfies Meta<typeof SCBox>

export default meta

/* ======================
        Story
====================== */

type Story = StoryObj<typeof meta>

/* ======================
        Stories
====================== */

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default: Story = {
  args: {}
}

export const GreenHover: Story = {
  args: {
    hoverColor: '#66FF66',
    style: {
      outline: '2px dashed #333'
    },
    className: ''
  }
}

///////////////////////////////////////////////////////////////////////////
//
// The old way of doing things:
//
//   const Template: StoryFn<typeof SCBox> = (args: any) => {
//     return <SCBox {...args} />
//   }
//   export const DefaultExample = Template.bind({})
//   DefaultExample.args = {}
//
//   DefaultExample.parameters = {
//     docs: { storyDescription: `<p>...</p>` }
//   }
//
//   DefaultExample.decorators = [
//     (Story) => (<div style={{ minHeight: 200 }}><Story /></div>)
//   ]
//
// In some cases, it may still be useful to implement StoryFn. Why?
// What if we needed to create an example that had state in the consuming
// environment that was fed into the component. Then we would need to create
// a component around the actual component that we are writing a story for.
//
//   const Template: StoryFn<typeof SCBox> = (args: any) => {
//     const [hoverColor, setHoverColor] = useState('orange')
//
//     return (
//       <SCBox
//         {...args}
//         hoverColor={hoverColor}
//         onClick={() => {
//           setHoverColor((prev) => {
//             if (prev === 'orange') { return 'pink' }
//             return 'orange'
//           })
//         }}
//       />
//     )
//   }
//
//   export const Changeable = Template.bind({})
//   Changeable.args = {}
//
//   Changeable.parameters = { docs: { storyDescription: `<p>...</p>` }}
//   Changeable.decorators = [(Story) => (<div style={{ minHeight: 200 }}><Story /></div>) ]
//
///////////////////////////////////////////////////////////////////////////

// But actually, instead of doing what we just did above, we can do this:

/** This is the Changeable description!!! */
export const Changeable: Story = {
  args: {},
  render: (args) => {
    const [hoverColor, setHoverColor] = useState('orange')
    return (
      <SCBox
        {...args}
        hoverColor={hoverColor}
        onClick={() => {
          setHoverColor((prev) => {
            if (prev === 'orange') {
              return 'pink'
            }
            return 'orange'
          })
        }}
      />
    )
  }
}
