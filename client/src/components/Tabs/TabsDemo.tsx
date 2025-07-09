// Third-party imports
import { Fragment, useEffect, useState, useRef } from 'react'

import { Tabs } from './'
// import { TabList } from './TabList'
// import { Tab } from './Tab'
// import { TabPanel } from './TabPanel'

const Content1 = () => {
  useEffect(() => {
    console.log('Content1 mounted.')
  }, [])
  return (
    <p>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic, fugit fuga
      praesentium rerum commodi iste, deleniti facere exercitationem explicabo
      fugiat quod! Quia dolor repudiandae modi recusandae minima asperiores
      labore architecto eligendi voluptate obcaecati aspernatur temporibus unde
      ratione ipsa totam similique suscipit quis commodi doloremque,
      voluptatibus dolore, aliquid qui veniam! Quaerat totam vero natus, iure id
      sapiente optio unde mollitia earum ratione architecto aspernatur provident
      cum cumque doloremque sed? Consectetur sint nulla ex vel iste suscipit
      esse ab blanditiis possimus recusandae, omnis, quo fugit soluta odit
      aperiam magni quia consequuntur adipisci, incidunt cumque. Atque fugit
      similique ex nemo? Enim, voluptate cupiditate.
    </p>
  )
}
/* ========================================================================
                                  TabsDemo
======================================================================== */

export const TabsDemo = () => {
  const tabsRef = useRef<HTMLDivElement | null>(null)
  const tabListRef = useRef<HTMLElement | null>(null)
  const tabRef = useRef<HTMLButtonElement | null>(null)
  const tabPanelRef = useRef<HTMLDivElement | null>(null)

  const [value, setValue] = useState('tab1')

  /* ======================
          useEffect()
  ====================== */

  useEffect(() => {
    console.log('tabs:', tabsRef.current)
    console.log('tabList:', tabListRef.current)
    console.log('tab:', tabRef.current)
    console.log('tabPanel:', tabPanelRef.current)
  }, [])

  /* ======================
          return
  ====================== */

  return (
    <Fragment>
      <div className='mb-6 flex justify-center gap-2'>
        <button
          className='btn-blue flex min-w-[100px] items-center justify-center gap-2'
          onClick={() => setValue('tab1')}
        >
          Tab 1{' '}
          <div
            className={`h-4 w-4 rounded-full border border-white bg-[#66FF66] ${
              value === 'tab1' ? 'opacity-100' : 'opacity-50'
            }`}
          />
        </button>
        <button
          className='btn-blue flex min-w-[100px] items-center justify-center gap-2'
          onClick={() => setValue('tab2')}
        >
          Tab 2{' '}
          <div
            className={`h-4 w-4 rounded-full border border-white bg-[#66FF66] ${
              value === 'tab2' ? 'opacity-100' : 'opacity-50'
            }`}
          />
        </button>
      </div>

      <Tabs
        ref={tabsRef} // ✅
        // defaultValue='tab2'
        onChange={(activeTabKey) => {
          setValue(activeTabKey)
        }}
        value={value}
        // vertical
        // style={{}} // ✅
        className='shadow-lg' // ✅
      >
        <Tabs.List
          ref={tabListRef} // ✅
          // center
          // right
          // navFill
          // navJustified
          // style={{ }} // ✅
          // className=''// ✅
        >
          <Tabs.Tab
            ref={tabRef} // ✅
            tabKey='tab1'
            // style={{}} // ✅
            // className='' // ✅
          >
            My Tab 1 With a Much Longer name.
          </Tabs.Tab>

          <Tabs.Tab tabKey='tab2'>My Tab 2</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel
          ref={tabPanelRef} // ✅
          // style={{ }} // ✅
          // className='' // ✅
          tabKey='tab1'
          // style={{ border: '2px dashed red' }}
          // className=''
        >
          <Content1 />
        </Tabs.Panel>

        <Tabs.Panel tabKey='tab2' loading>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic, fugit
          fuga praesentium rerum commodi iste, deleniti facere exercitationem
          explicabo fugiat quod! Quia dolor repudiandae modi recusandae minima
          asperiores labore architecto eligendi voluptate obcaecati aspernatur
          temporibus unde ratione ipsa totam similique suscipit quis commodi
          doloremque, voluptatibus dolore...
        </Tabs.Panel>
      </Tabs>
    </Fragment>
  )
}
