import { Icon } from '@iconify/react'
import { Autocomplete } from './components/Autocomplete'

import { animated as a, useSprings } from '@react-spring/web'
import { useState } from 'react'
import CountUp from 'react-countup'

function App() {
  return (
    <div className="fixed h-full w-full">
      <Autocomplete
        openOnFocus={true}
        getSources={({ query }: { query: any }) => [
          {
            sourceId: 'products',
            async getItems() {
              return await fetch(
                `https://crates.io/api/v1/crates?q=${query}&sort=downloads`,
              ).then((res) => res.json())
            },
            templates: {
              // @ts-ignore
              item({ item, components }) {
                // @ts-ignore
                return <ProductItem hit={item} components={components} />
              },
            },
          },
        ]}
      />
    </div>
  )
}

export default App

// @ts-ignore
function ProductItem({ hit, components }) {
  const [iconSprings, iconSpringApi] = useSprings(
    hit.crates.length,
    () => ({
      opacity: 0,
      backgroundColor: 'rgba(0, 0, 0, 0)',
      width: '13rem',
    }),
    [],
  )

  const [focused, setFocused] = useState(false)

  const [copyId, setCopyId] = useState(0)

  return iconSprings.map((iconSpring, index, p) => {
    const crate = hit.crates[index]
    return (
      <div
        key={crate.id}
        onClick={(e) => {
          !focused &&
            window.open(`https://lib.rs/crates/${crate.name}`, '_blank')

          e.stopPropagation()
        }}
        className="w-full space-x-4 bg-zinc-600/20 p-2 transition-colors hover:bg-zinc-500"
      >
        <p className="text-xl font-bold">
          <Icon icon="mdi:package-variant-closed" className="inline" />
          <span className="ml-2">{crate.name}</span>
        </p>
        <p className="absolute right-12 my-2 inline w-32 rounded-lg bg-zinc-900 p-1 text-center">
          <Icon icon="mdi:downloads" className="inline" />
          {/* <span className="ml-2">{crate.downloads}</span> */}
          <CountUp
            preserveValue={true}
            useEasing={true}
            end={crate.downloads / 1000}
            // Format to million if downloads is greater than 1 million, else format to thousands, etc.
            suffix={
              crate.downloads > 1000000
                ? 'M'
                : crate.downloads > 1000
                ? 'K'
                : ''
            }
          />
        </p>
        <a.div
          onMouseEnter={() => {
            iconSpring.opacity.start(1)
            setFocused(true)
          }}
          onMouseLeave={() => {
            iconSpring.opacity.start(0)
            setFocused(false)
          }}
          onClick={async (e) => {
            navigator.clipboard.writeText(crate.max_version)
            e.stopPropagation()
            setCopyId(crate.id)
            await iconSpring.backgroundColor.start('rgba(0, 200, 0, 0.5)')
            await new Promise((r) => setTimeout(r, 1000))
            await iconSpring.backgroundColor.start('rgba(0, 0, 0, 0)')
            setCopyId(0)
          }}
          style={iconSpring}
          className="absolute z-20 my-[8px] h-[26px] w-52 rounded-lg p-1 text-center transition-colors hover:bg-zinc-900/50 hover:backdrop-blur-sm"
        >
          {copyId === crate.id ? (
            <>
              <Icon icon="mdi:clipboard-check-outline" className="inline" />
              <span className="text-sm font-bold text-zinc-300">
                Copied to clipboard!
              </span>
            </>
          ) : (
            <>
              <Icon icon="mdi:clipboard-outline" className="inline" />
              <span>Copy</span>
            </>
          )}
        </a.div>
        <p className="my-2 w-52 rounded-lg bg-zinc-900 p-1 text-center">
          <Icon icon="simple-icons:semver" className="inline" />
          <span className="ml-2">{crate.max_version}</span>
        </p>
        <p className="text-sm text-zinc-300">
          <Icon
            icon="mdi:information-slab-circle-outline"
            className="relative -top-[2px] inline"
          />
          <span className="ml-1">{crate.description}</span>
        </p>
        {crate.documentation || crate.homepage || crate.repository ? (
          <div className="flex space-x-2">
            {crate.documentation && (
              <a
                href={crate.documentation}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-sky-500 transition-colors hover:text-zinc-300"
              >
                <Icon
                  icon="mdi:file-document-multiple"
                  className="relative -top-[1px] inline"
                />
                Docs
              </a>
            )}
            {crate.homepage && (
              <a
                href={crate.homepage}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-sky-500 transition-colors hover:text-zinc-300"
              >
                <Icon
                  icon="material-symbols:home"
                  className="relative -top-[1px] inline"
                />
                Home
              </a>
            )}
            {crate.repository && (
              <a
                href={crate.repository}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-sky-500 transition-colors hover:text-zinc-300"
              >
                <Icon
                  icon="mdi:source-repository"
                  className="relative -top-[1px] inline"
                />
                Repo
              </a>
            )}
          </div>
        ) : null}
      </div>
    )
  })

  // return hit.crates.map((crate: any) => (
  //   <div
  //     key={crate.id}
  //     className="w-full space-x-4 bg-zinc-600/20 p-2 transition-colors hover:bg-zinc-500"
  //   >
  //     <a
  //       href={`https://crates.io/crates/${crate.name}`}
  //       target="_blank"
  //       rel="noopener noreferrer"
  //     >
  //       <p className="text-xl font-bold">
  //         <Icon icon="mdi:package-variant-closed" className="inline" />
  //         <span className="ml-2">{crate.name}</span>
  //       </p>
  //       <p className="absolute right-12 my-2 inline w-32 rounded-lg bg-zinc-900 p-1 text-center">
  //         <Icon icon="mdi:downloads" className="inline" />
  //         {/* <span className="ml-2">{crate.downloads}</span> */}
  //         <CountUp
  //           preserveValue={true}
  //           useEasing={true}
  //           end={crate.downloads / 1000}
  //           // Format to million if downloads is greater than 1 million, else format to thousands, etc.
  //           suffix={
  //             crate.downloads > 1000000
  //               ? 'M'
  //               : crate.downloads > 1000
  //               ? 'K'
  //               : ''
  //           }
  //         />
  //       </p>
  //       <a.div
  //         style={iconSpring}
  //         className="absolute my-2 h-7 w-52 rounded-lg p-1 text-center transition-colors hover:bg-zinc-300/20 hover:backdrop-blur-sm"
  //       >
  //         <Icon icon="mdi:star" className="inline" />
  //       </a.div>
  //       <p className="my-2 w-52 rounded-lg bg-zinc-900 p-1 text-center">
  //         <Icon icon="simple-icons:semver" className="inline" />
  //         <span className="ml-2">{crate.max_version}</span>
  //       </p>
  //       <p className="text-sm text-zinc-300">
  //         <Icon
  //           icon="mdi:information-slab-circle-outline"
  //           className="relative -top-[2px] inline"
  //         />
  //         <span className="ml-1">{crate.description}</span>
  //       </p>
  //       {crate.documentation || crate.homepage || crate.repository ? (
  //         <div className="flex space-x-2">
  //           {crate.documentation && (
  //             <a
  //               href={crate.documentation}
  //               target="_blank"
  //               rel="noopener noreferrer"
  //               className="font-bold text-sky-500 transition-colors hover:text-zinc-300"
  //             >
  //               <Icon
  //                 icon="mdi:file-document-multiple"
  //                 className="relative -top-[1px] inline"
  //               />
  //               Docs
  //             </a>
  //           )}
  //           {crate.homepage && (
  //             <a
  //               href={crate.homepage}
  //               target="_blank"
  //               rel="noopener noreferrer"
  //               className="font-bold text-sky-500 transition-colors hover:text-zinc-300"
  //             >
  //               <Icon
  //                 icon="material-symbols:home"
  //                 className="relative -top-[1px] inline"
  //               />
  //               Home
  //             </a>
  //           )}
  //           {crate.repository && (
  //             <a
  //               href={crate.repository}
  //               target="_blank"
  //               rel="noopener noreferrer"
  //               className="font-bold text-sky-500 transition-colors hover:text-zinc-300"
  //             >
  //               <Icon
  //                 icon="mdi:source-repository"
  //                 className="relative -top-[1px] inline"
  //               />
  //               Repo
  //             </a>
  //           )}
  //         </div>
  //       ) : null}
  //     </a>
  //   </div>
  // ))
}
