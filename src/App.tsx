import { Autocomplete } from './components/Autocomplete'

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
  console.log(hit)
  return hit.crates.map((crate: any) => (
    <div key={crate.id}>
      <div className="w-full space-x-4 bg-zinc-600/20 p-2 transition-colors hover:bg-zinc-500">
        <div>
          <p className="font-bold">{crate.name}</p>
          <p className="my-2 w-20 rounded-lg bg-zinc-900 p-1 text-center">
            {crate.newest_version}
          </p>
          <p className="text-sm text-zinc-400">{crate.description}</p>
          {crate.documentation || crate.homepage || crate.repository ? (
            <div className="flex space-x-2">
              {crate.documentation && (
                <a
                  href={crate.documentation}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-sky-500 transition-colors hover:text-zinc-300"
                >
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
                  Repo
                </a>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  ))
}
