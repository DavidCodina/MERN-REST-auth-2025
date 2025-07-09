import { Fragment, useState } from 'react'
import { RadixDropdown } from './'

// Used by Content and SubContent components.
const customContentClassName = `
[--radix-dropdown-color:#409]
[--radix-dropdown-border-color:#409]
[--radix-dropdown-highlighted-color:#fff]
[--radix-dropdown-highlighted-bg:#409]
[--radix-dropdown-separator-bg:#409]
`

const checkIcon = (
  <svg
    width='15'
    height='15'
    viewBox='0 0 15 15'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path
      d='M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z'
      fill='currentColor'
      fillRule='evenodd'
      clipRule='evenodd'
    ></path>
  </svg>
)

const dotFilledIcon = (
  <svg
    width='15'
    height='15'
    viewBox='0 0 15 15'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path
      d='M9.875 7.5C9.875 8.81168 8.81168 9.875 7.5 9.875C6.18832 9.875 5.125 8.81168 5.125 7.5C5.125 6.18832 6.18832 5.125 7.5 5.125C8.81168 5.125 9.875 6.18832 9.875 7.5Z'
      fill='currentColor'
    ></path>
  </svg>
)

/* ========================================================================
                                RadixDropdownDemo
======================================================================== */

export const RadixDropdownDemo = () => {
  const [check1Checked, setCheck1Checked] = useState(true)
  const [check2Checked, setCheck2Checked] = useState(false)
  const [radioValue, setRadioValue] = useState('radio1')

  /* ======================
    dropdownMenuContent
  ====================== */

  const dropdownMenuContent = (
    <Fragment>
      <RadixDropdown.Item className='radix-dropdown-item'>
        Item 1
      </RadixDropdown.Item>

      <RadixDropdown.Item className='radix-dropdown-item'>
        Item 2
      </RadixDropdown.Item>

      <RadixDropdown.Item className='radix-dropdown-item' disabled>
        Item 3 (disabled)
      </RadixDropdown.Item>

      {/* =====================
              Sub Menu
      ===================== */}
      {/* Gotcha: Initially I removed the submenu hover style because it seemed
      to work fine without it when I simply moved my cursor over it. However,
      things behave a little different if one using Tab, Enter, arrow keys, etc.
      That's why you also need the highlightedText and highlightedBackground. */}

      <RadixDropdown.Sub>
        <RadixDropdown.SubTrigger
          className='radix-dropdown-subtrigger'
          // disabled
        >
          Sub Menu
          <svg
            viewBox='0 0 15 15'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              d='M6.1584 3.13508C6.35985 2.94621 6.67627 2.95642 6.86514 3.15788L10.6151 7.15788C10.7954 7.3502 10.7954 7.64949 10.6151 7.84182L6.86514 11.8418C6.67627 12.0433 6.35985 12.0535 6.1584 11.8646C5.95694 11.6757 5.94673 11.3593 6.1356 11.1579L9.565 7.49985L6.1356 3.84182C5.94673 3.64036 5.95694 3.32394 6.1584 3.13508Z'
              fill='currentColor'
              fillRule='evenodd'
              clipRule='evenodd'
            ></path>
          </svg>
        </RadixDropdown.SubTrigger>
        {/* Gotcha: In the docs example, they use a second Portal to wrap the SubContent.
        The problem with that approach is that the Tailwind dropdownPlugin defines CSS
        custom properties on '.radix-dropdown-content' and if one uses a second portal, 
        then those CSS variables are outside of the scope. There are a couple of solutions
        for this:

          1. Omit the Portal because it's not really needed.
          2. ✅ Use '.radix-dropdown-content as the className to redefine 
             the CSS customvariables at this scope.
          3. Define the CSS variables at the scope of :root (less preferable).
        */}

        {/* <RadixDropdown.Portal> */}
        <RadixDropdown.SubContent
          className={`radix-dropdown-content ${customContentClassName}`}
          sideOffset={15}
        >
          <RadixDropdown.Item className='radix-dropdown-item'>
            Sub Item 1
          </RadixDropdown.Item>

          <RadixDropdown.Item className='radix-dropdown-item'>
            Sub Item 2
          </RadixDropdown.Item>

          <RadixDropdown.Item className='radix-dropdown-item'>
            Sub Item 3
          </RadixDropdown.Item>
        </RadixDropdown.SubContent>
        {/* </RadixDropdown.Portal> */}
      </RadixDropdown.Sub>

      <RadixDropdown.Separator className='radix-dropdown-separator' />

      {/* =====================
              Checkboxes
      ===================== */}

      <RadixDropdown.Label className='font-bold text-neutral-600'>
        Checks:
      </RadixDropdown.Label>

      <RadixDropdown.CheckboxItem
        className='radix-dropdown-item pl-6'
        checked={check1Checked}
        onCheckedChange={setCheck1Checked}
        // Event handler called when the user selects an item (via mouse or keyboard).
        // Calling event.preventDefault in this handler will prevent the dropdown menu from closing when selecting that item.
        onSelect={(e) => {
          e.preventDefault()
        }}
      >
        {/* An ItemIndicator is only visible when the parent CheckboxItem has checked={true} 
        The ItemIndicator is merely a container for whatever checkbox icon one chooses. */}
        <RadixDropdown.ItemIndicator className='radix-dropdown-item-indicator'>
          {checkIcon}
        </RadixDropdown.ItemIndicator>
        Check Item 1
      </RadixDropdown.CheckboxItem>

      <RadixDropdown.CheckboxItem
        className='radix-dropdown-item pl-6'
        checked={check2Checked}
        onCheckedChange={setCheck2Checked}
        onSelect={(e) => {
          e.preventDefault()
        }}
      >
        <RadixDropdown.ItemIndicator className='radix-dropdown-item-indicator'>
          {checkIcon}
        </RadixDropdown.ItemIndicator>
        Check Item 2
      </RadixDropdown.CheckboxItem>

      <RadixDropdown.Separator className='radix-dropdown-separator' />

      {/* =====================
      RadioGroup (for people)
      ===================== */}

      <RadixDropdown.Label className='font-bold text-neutral-600'>
        Radios:
      </RadixDropdown.Label>

      <RadixDropdown.RadioGroup
        value={radioValue}
        onValueChange={setRadioValue}
      >
        <RadixDropdown.RadioItem
          className='radix-dropdown-item pl-6'
          value='radio1'
          onSelect={(e) => {
            e.preventDefault()
          }}
        >
          <RadixDropdown.ItemIndicator className='radix-dropdown-item-indicator'>
            {dotFilledIcon}
          </RadixDropdown.ItemIndicator>
          Radio Item 1
        </RadixDropdown.RadioItem>

        <RadixDropdown.RadioItem
          className='radix-dropdown-item pl-6'
          value='radio2'
          onSelect={(e) => {
            e.preventDefault()
          }}
        >
          <RadixDropdown.ItemIndicator className='radix-dropdown-item-indicator'>
            {dotFilledIcon}
          </RadixDropdown.ItemIndicator>
          Radio Item 2
        </RadixDropdown.RadioItem>
      </RadixDropdown.RadioGroup>
    </Fragment>
  )

  /* ======================
          return
  ====================== */

  return (
    <RadixDropdown
      // defaultOpen
      trigger={
        <button className='btn-sky btn-sm mx-auto mb-6 block'>
          Dropdown Menu
        </button>
      }
      contentClassName={customContentClassName}
      // side='top'
      modal={false}
    >
      {dropdownMenuContent}
    </RadixDropdown>
  )
}
