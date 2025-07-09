import { Placeholder } from './'

const CardPlaceholder = ({
  animation = 'wave',
  style = {},
  className = ''
}: any) => {
  return (
    <section
      className={`border border-neutral-400 bg-white dark:border-(--dark-primary-color) dark:bg-(--dark-bg-color) ${className ? ` ${className}` : ''} `}
      style={{
        borderRadius: 10,
        padding: 15,
        ...style
      }}
    >
      {/* Header */}

      <div
        style={{
          alignItems: 'center',
          display: 'flex',
          gap: '0px 5px',
          marginBottom: 5
        }}
      >
        <Placeholder
          animation={animation}
          style={{
            borderRadius: '50%',
            height: 60,
            width: 60
          }}
        />

        <div style={{ flex: 1 }}>
          <Placeholder
            animation={animation}
            size='lg'
            style={{ marginBottom: 5, width: '70%' }}
          />
          <Placeholder
            animation={animation}
            size='xs'
            style={{ marginBottom: 5 }}
          />
          <Placeholder
            animation={animation}
            size='xs'
            style={{ fontSize: 0, width: '75%' }}
          />
        </div>

        <Placeholder
          animation={animation}
          style={{
            alignSelf: 'flex-start',
            backgroundColor: '#00b5e2',
            borderRadius: 6,
            height: 25,
            width: 60
          }}
        />
      </div>

      {/* Paragraph 1*/}

      <Placeholder
        animation={animation}
        style={{ marginLeft: '5%', width: '95%' }}
      />
      <Placeholder animation={animation} />
      <Placeholder animation={animation} />
      <Placeholder
        animation={animation}
        style={{ marginBottom: 20, width: '75%' }}
      />

      {/* Paragraph 2 */}
      <Placeholder
        animation={animation}
        style={{ marginLeft: '5%', width: '95%' }}
      />

      <Placeholder animation={animation} />
      <Placeholder animation={animation} />
      <Placeholder animation={animation} />
      <Placeholder animation={animation} style={{ width: '35%' }} />

      {/* Bottom Buttons */}
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
        <Placeholder
          animation={animation}
          style={{
            backgroundColor: '#dc3545',
            borderRadius: 6,
            marginBottom: 0,
            marginTop: 15,
            height: 30,
            width: 90
          }}
        />

        <Placeholder
          animation={animation}
          style={{
            backgroundColor: '#409',
            borderRadius: 6,
            marginBottom: 0,
            marginTop: 15,
            height: 30,
            width: 90
          }}
        />
      </div>
    </section>
  )
}

/* ========================================================================
                                PlaceholderDemo
======================================================================== */

export const PlaceholderDemo = () => {
  /* ======================
          return
  ====================== */

  return (
    <div
      className='relative'
      style={{
        margin: '120px auto',
        display: 'table',
        width: 350
      }}
    >
      <CardPlaceholder
        animation='shine'
        style={{
          top: -25,
          left: -50,
          transform: 'rotate(-20deg)'
        }}
        className='absolute w-full [--placeholder-opacity:0.25]'
      />

      <CardPlaceholder
        animation='shine'
        style={{
          top: -12.5,
          left: -25,
          transform: 'rotate(-10deg)'
        }}
        className='absolute w-full [--placeholder-opacity:0.25]'
      />

      <CardPlaceholder
        animation='shine' // 'glow' | 'shine' | 'white-wave' | 'wave'
        style={
          {
            // Each Placeholder sets the background-color: currentcolor;
            // This means we can change the color of the placeholder by setting
            // the normal color (i.e., text color). The strength of the color is
            // determinted by the opacity for each placeholder. However, we can
            // set it for all of them using: className='[--placeholder-opacity:0.25]'
            // color: 'black',
            // backgroundColor: '#333',
            // maxWidth: 350
          }
        }
        // Demure:  https://manuarora.in/boxshadows

        // [--placeholder-bg:#333]
        className={`relative shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] [--placeholder-min-height:15px] [--placeholder-opacity:0.25]`}
      />
    </div>
  )
}
