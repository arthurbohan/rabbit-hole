import { useCrate, useExplorer, useDeepDive, useAuth } from './hooks/index.js'
import { deepPrompt, nodePrompt } from './api.js'
import { SearchBar, Trail, BranchCard, NodeCard, CratePanel, AuthButton } from './components/index.js'

export default function App() {
  const deepDive = useDeepDive()
  const { user, logout } = useAuth()
  const explorer = useExplorer({ onExploreStart: deepDive.reset, user })
  const {
    crate,
    crateOpen,
    setCrateOpen,
    inCrate,
    addToCrate,
    removeFromCrate,
  } = useCrate(user)

  const {
    query,
    setQuery,
    current,
    branches,
    trail,
    loading,
    error,
    start,
    surprise,
    goTo,
    jumpBack,
    retry,
  } = explorer
  const { deep, deepLoading, digDeeper } = deepDive

  return (
    <div className='rh'>
      <div className='rh-wrap'>
        <header className='rh-top'>
          <div className='rh-mark'>
            Rabbit <span>Hole</span>
          </div>
          <div className='rh-top-actions'>
            <AuthButton user={user} onLogout={logout} />
            <button
              className='rh-crate-btn'
              data-testid='crate-toggle'
              onClick={() => setCrateOpen(true)}
            >
              Crate · {crate.length}
            </button>
          </div>
        </header>

        <SearchBar
          query={query}
          onQueryChange={setQuery}
          onStart={start}
          onSurprise={surprise}
        />

        <Trail trail={trail} currentName={current?.name} onJumpBack={jumpBack} />

        {loading && (
          <div className='rh-state' data-testid='loading'>
            Tracing the connections
            <span className='rh-dot'>.</span>
            <span className='rh-dot'>.</span>
            <span className='rh-dot'>.</span>
          </div>
        )}

        {error && !loading && (
          <div className='rh-state' data-testid='error'>
            {error}
            <button className='rh-retry' data-testid='retry' onClick={retry}>
              Try again
            </button>
          </div>
        )}

        {!loading && !current && !error && (
          <div className='rh-empty'>
            <p>
              Type in something you already love, or let it pick for you. Every
              stop opens five more doors.
            </p>
          </div>
        )}

        {!loading && current && (
          <main>
            <NodeCard
              node={current}
              deepText={deep.node}
              isDeepLoading={deepLoading === 'node'}
              isInCrate={inCrate(current)}
              onDigDeeper={() => digDeeper('node', nodePrompt(current.name))}
              onAddToCrate={() => addToCrate(current)}
            />

            {branches.map((branch, i) => (
              <BranchCard
                key={`${branch.name}-${i}`}
                branch={branch}
                deepText={deep[i]}
                isDeepLoading={deepLoading === i}
                isInCrate={inCrate(branch)}
                onGoTo={() => goTo(branch)}
                onDigDeeper={() => digDeeper(i, deepPrompt(branch.name, current.name))}
                onAddToCrate={() => addToCrate(branch, current.name)}
              />
            ))}
          </main>
        )}
      </div>

      <CratePanel
        open={crateOpen}
        crate={crate}
        user={user}
        onClose={() => setCrateOpen(false)}
        onRemove={removeFromCrate}
        onExplore={(name) => {
          start(name)
          setCrateOpen(false)
        }}
      />
    </div>
  )
}
