import {
  StoryFn,
  // StoryObj, // Use in conjunction with CSF3.
  Meta
} from '@storybook/react'
import { SCCounter } from './index'

/* ======================
        default
====================== */

const meta: Meta<typeof SCCounter> = {
  title: 'Components/SCCounter',
  component: SCCounter,
  // args: {}
  // argTypes: {},
  parameters: {
    componentSubtitle: 'An amazing SCCounter component!'
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

const Template: StoryFn<typeof SCCounter> = (args: any) => {
  return <SCCounter {...args} />
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
