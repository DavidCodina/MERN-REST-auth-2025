import { Fragment } from 'react'
import { SimpleTable } from './'

const rows: any = [
  { id: '1', firstName: 'David', lastName: 'Codina', age: 45 },
  { id: '2', firstName: 'Holly', lastName: 'Grant', age: 42 },
  { id: '3', firstName: 'Muffy', lastName: 'Fluffer', age: 13 },
  { id: '4', firstName: 'Ginger', lastName: 'Bread', age: 18 },
  { id: '5', firstName: 'Punkin', lastName: 'Pie', age: 10 },
  { id: '6', firstName: 'Wally', lastName: 'Wallingford', age: 20 },
  { id: '7', firstName: 'Paddy', lastName: 'The Baddy', age: 1 }
]

const cols = [
  { key: 'id', label: '' },
  { key: 'firstName', label: 'First' },
  { key: 'lastName', label: 'Last' },
  { key: 'age', label: 'Age' }
]
const colStyles = [
  { minWidth: 20 },
  { minWidth: 100 },
  { minWidth: 100 },
  { minWidth: 100 }
]

/* ========================================================================

======================================================================== */
// The <caption> tag must be inserted immediately after the <table> tag.
// That said, it tends to mess up the scrollbar and other stuff when used
// inside of .table container. Thus, in the component version make it sr-only,
// and put a quasi caption outside of the .table-container.

export const TableDemo = () => {
  /* ======================
          return
  ====================== */

  const renderData = () => {
    return (
      <Fragment>
        <caption className='relative bg-stone-100 px-2 py-2 text-base font-black text-[#333] uppercase duration-300 group-hover:tracking-widest group-hover:text-violet-800 before:absolute before:bottom-2 before:left-2/4 before:h-0.5 before:w-24 before:-translate-x-2/4 before:bg-[#333] before:transition-all before:content-[""] before:group-hover:w-11/12 group-hover:before:bg-violet-800'>
          User Data
        </caption>
        <thead className='bg-stone-100 text-center align-middle uppercase'>
          <tr role='row'>
            {cols.map((col, index) => {
              return (
                <th key={col.key} style={colStyles[index]}>
                  {col.label}
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody
          className='text-center align-middle' // 'table-group-divider'
        >
          {/* The 'no rows' fallback is a nice feature. It's actually baked into the
           NextUI table in conjunction with the emptyContent prop.
          https://nextui.org/docs/components/table#empty-state
          However, SimpleTable is not quite as fancy as all of the mapping and row/col 
          creatiion happens on the consuming side.

          We could fix this by having a <TableBody> component that checks if children is
          null, and if it is render this content when emptyContent={"No rows to display."}
          For now, I'm not going to go down that road, and just keep it simple. */}
          {!Array.isArray(rows) || rows.length === 0 ? (
            <tr role='row'>
              <td
                className='pointer-events-none h-40 text-center align-middle font-medium'
                colSpan={cols.length}
                role='gridcell'
              >
                No rows to display!
              </td>
            </tr>
          ) : (
            rows.map((row: any, index: number) => {
              return (
                <tr
                  className={index === 1 ? 'table-active-data' : ''}
                  key={row.id}
                >
                  <th className='border-r border-neutral-400 bg-stone-100 font-mono font-medium text-pink-500'>
                    {row.id}
                  </th>
                  <td>{row.firstName}</td>
                  <td>{row.lastName}</td>
                  <td>{row.age}</td>
                </tr>
              )
            })
          )}
        </tbody>

        {/* <tfoot>
          <tr>
            <th colSpan={4}>
              <div className='flex justify-center'>This is the footer</div>
            </th>
          </tr>
        </tfoot> */}
      </Fragment>
    )
  }

  /* ======================
          return
  ====================== */

  return (
    <Fragment>
      {/* <section
        className='rounded-xl border border-stone-400 bg-[#fafafa] p-6 py-12'
        // style={{ minHeight: 400 }}
      > */}
      <SimpleTable
        size='sm'
        // bordered
        // borderless
        striped
        stripedData
        hover
        // hoverData
        rounded={15}
        useContainer
        // className='[--table-border-color:theme(colors.blue.800)]'
        className='group bg-white' // 'table-fixed'
        //style={{ minWidth: 600 }}
        containerClassName='mx-auto max-w-lg mb-6 border border-neutral-400 shadow-lg'
        // headerFooterAccent
        containerStyle={{}}
        captionTop
      >
        {renderData()}
      </SimpleTable>
      {/* </section> */}
    </Fragment>
  )
}
