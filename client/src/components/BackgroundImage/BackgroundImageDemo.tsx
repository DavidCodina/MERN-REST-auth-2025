import { Fragment } from 'react'
import { BackgroundImage } from './index'
import teaTime from './tea-time.jpeg'

/* ========================================================================
                      
======================================================================== */

export const BackgroundImageDemo = () => {
  /* ======================
          return
  ====================== */

  return (
    <Fragment>
      <BackgroundImage
        src={teaTime} //'https://via.placeholder.com/500'
        className='mx-auto mb-12 aspect-[2/1] overflow-auto rounded-2xl border-2 border-neutral-600 p-4 text-lg leading-relaxed text-neutral-800'
        style={{
          backgroundBlendMode: 'overlay',
          backgroundColor: 'rgba(255,255,255,0.75)'
        }}
      >
        <p>
          In some cases we may want to separate the background color to be
          white, and then have a semi-opaque background image on top of that.
          This would allow the text to be more prominent. In order to do this
          you'd need a separate div for the background image in order to make it
          opaque without affecting the other content. We could do add a
          conditional return within the component that renders a different
          implementation:
        </p>

        <pre className='mx-auto w-11/12 rounded-xl border border-neutral-500 bg-white text-xs leading-normal font-normal shadow-lg'>
          <code>{`
  if (useContainer === true) {
    return (
      <div className={containerClassName} style={{ position: 'relative', ...containerStyle }}>
        <div
          className={className}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: \`url(\${src})\`,
            backgroundSize: size,
            backgroundPosition: position,
            backgroundRepeat: repeat,
            backgroundAttachment: attachment,
            ...style
          }}
        />
        <div className='relative h-full w-full overflow-auto'>{children}</div>
      </div>
    )
  }    
          `}</code>
        </pre>

        <p>
          At this point you're making it more complicated than it needs to be.
          Instead, all you need to do is use{' '}
          <code className='text-pink-500'>backgroundBlendMode:'overlay'</code>{' '}
          in conjunction with an <code className='text-pink-500'>rgba()</code>{' '}
          background color:
        </p>

        <pre className='mx-auto w-11/12 rounded-xl border border-neutral-500 bg-white text-xs leading-normal font-normal shadow-lg'>
          <code>{`
  <BackgroundImage
    src={teaTime} 
    className='mx-auto mb-12 aspect-[2/1] overflow-auto rounded-2xl border-2 border-neutral-600 p-4 text-xl leading-relaxed text-neutral-800'
    style={{ backgroundBlendMode: 'overlay', backgroundColor: 'rgba(255,255,255,0.75)' }}
  >...</BackgroundImage>
          `}</code>
        </pre>
      </BackgroundImage>

      <section className='relative mx-auto mb-12 aspect-[2/1] overflow-auto rounded-2xl border-2 border-neutral-600 text-lg leading-relaxed text-neutral-800'>
        <BackgroundImage
          src={teaTime}
          className='absolute inset-0'
          style={{
            backgroundBlendMode: 'overlay',
            backgroundColor: 'rgba(255,255,255,0.6)',
            filter: 'blur(2px) grayscale(100%)'
          }}
        />

        <div className='relative h-full w-full overflow-auto p-4'>
          <p>
            What if we want to apply a filter like{' '}
            <code className='text-pink-500'>blur()</code> or{' '}
            <code className='text-pink-500'>grayscale()</code>? In that case,{' '}
            <code className='text-pink-500'>{`<BackgroundImage/>`}</code> should
            be{' '}
            <span className='font-bold italic'>independent of the content</span>
            . Here we would use the quasi-fixed content trick, but rather than
            baking it into{' '}
            <code className='text-pink-500'>{`<BackgroundImage/>`}</code> , we
            build it around it.
          </p>

          <pre className='mx-auto w-11/12 rounded-xl border border-neutral-500 bg-white text-xs leading-normal font-normal shadow-lg'>
            <code>{`
  <section className='relative mx-auto mb-12 aspect-[2/1] overflow-auto rounded-2xl border-2 border-neutral-600 text-lg leading-relaxed text-neutral-800'>
    <BackgroundImage
      src={teaTime}
      className='absolute inset-0'
      style={{ 
        backgroundBlendMode: 'overlay', 
        backgroundColor: 'rgba(255,255,255,0.6)',
        filter: 'blur(2px) grayscale(100%)' 
      }}
    />

    <div className='relative h-full w-full overflow-auto p-4'>
      <p>...</p>
    </div>
  </section>
          `}</code>
          </pre>

          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus
            libero, doloribus magnam mollitia alias perspiciatis quae sit
            expedita soluta dicta, modi quisquam placeat nesciunt nisi quas
            veniam maxime consequuntur vel odio dolorem. Doloribus, aliquam
            corrupti. Velit, nulla ipsa commodi quos consectetur minima, odio
            veniam sint modi facilis ut deleniti natus maiores molestias,
            accusamus blanditiis omnis corporis atque doloremque beatae vel
            voluptatem. Libero, perspiciatis iusto praesentium, est
            reprehenderit quisquam natus, excepturi porro obcaecati esse
            consequuntur totam? Eum modi magni animi voluptatem ad praesentium!
            Amet tempore, voluptate nulla cum, inventore obcaecati non culpa
            consequatur a optio praesentium aliquam delectus labore earum
            perferendis.
          </p>
        </div>
      </section>

      <BackgroundImage
        src={teaTime} //'https://via.placeholder.com/500'
        style={
          {
            // backgroundImage: `linear-gradient(to right, rgb(109, 40, 217), rgb(56, 189, 248)), url(${teaTime})`,
            // backgroundBlendMode: 'color'
            // Or
            // backgroundBlendMode: 'overlay',
            // backgroundColor: 'rgba(0,0,255,0.25)'
          }
        }
        className='mx-auto aspect-[2/1] rounded-2xl border-2 border-neutral-600 p-4 text-3xl font-bold'
      >
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Animi iste,
        quaerat tempora harum fugiat quia fuga qui ab, consectetur, dolorem
        dignissimos odio! Nam quas similique libero sint quam odit laudantium,
        illo cumque numquam ab, maxime officiis accusantium? Vitae alias eveniet
        quae corrupti aut deleniti suscipit adipisci iure. Animi delectus,
        explicabo nobis corrupti iusto quis in doloribus quidem unde quas alias
        laboriosam vel. Dignissimos pariatur sequi dolor assumenda nam est,
        voluptate harum consectetur incidunt ex voluptas cupiditate, rerum
        debitis quae consequatur perspiciatis earum neque maxime ducimus atque
        accusantium! Vel consectetur neque, alias totam ipsum error quam aliquam
        eaque aut animi aperiam?
      </BackgroundImage>
    </Fragment>
  )
}
