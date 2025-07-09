import {
  StoryFn,
  // StoryObj, // Use in conjunction with CSF3.
  Meta
} from '@storybook/react'
import { SassCounter } from './index'

/* ======================
        default
====================== */

const meta: Meta<typeof SassCounter> = {
  title: 'Components/SassCounter',
  component: SassCounter,
  // args: {}
  // argTypes: {},
  parameters: {
    componentSubtitle: 'An amazing SassCounter component!'
    // docs: {
    //   description: {
    //     component: `<div><p>...</p></div>`
    //   }
    // },
  }
}

export default meta

/* ======================
        Template
====================== */

const Template: StoryFn<typeof SassCounter> = (args: any) => {
  return <SassCounter {...args} />
}

//
/* ======================
      DefaultExample
====================== */

export const DefaultExample = Template.bind({})
DefaultExample.args = {}

// DefaultExample.parameters = {
//   docs: { storyDescription: `<p>...</p>` }
// }
// DefaultExample.decorators = [
//   (Story) => (<div style={{ minHeight: 200 }}><Story /></div>)
// ]
