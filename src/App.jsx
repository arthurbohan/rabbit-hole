import { useCrate } from './hooks/useCrate.js'
import { useExplorer } from './hooks/useExplorer.js'
import { useDeepDive } from './hooks/useDeepDive.js'
import { deepPrompt, nodePrompt } from './api.js'
import SearchBar from './components/SearchBar.jsx'
import Trail from './components/Trail.jsx'
import BranchCard from './components/BranchCard.jsx'
import CratePanel from './components/CratePanel.jsx'
import ListenRow from './components/ListenRow.jsx'

export default function App() {
  const deepDive = useDeepDive()
  const explorer = useExplorer({ onExploreStart: deepDive.reset })
  const {
    crate,
    crateOpen,
    setCrateOpen,
    inCrate,
    addToCrate,
    removeFromCrate,
  } = useCrate()

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
  } = explorer
  const { deep, deepLoading, digDeeper } = deepDive

  return (
    <div className='rh'>
      <div className='rh-wrap'>
        <header className='rh-top'>
          <div className='rh-mark'>
            Rabbit <span>Hole</span>
          </div>
          <button
            className='rh-crate-btn'
            data-testid='crate-toggle'
            onClick={() => setCrateOpen(true)}
          >
            Crate · {crate.length}
          </button>
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
            <div className='rh-node-block'>
              <div className='rh-eyebrow'>Now at</div>
              <h1 className='rh-node-name' data-testid='node-name'>
                {current.name}
              </h1>
              <p className='rh-tagline'>{current.tagline}</p>
              <ListenRow name={current.name} />
              <div className='rh-actions'>
                <button
                  className={`rh-act ${deep.node ? 'is-on' : ''}`}
                  onClick={() => digDeeper('node', nodePrompt(current.name))}
                >
                  {deepLoading === 'node'
                    ? 'Reading…'
                    : deep.node
                      ? 'Close notes'
                      : 'Dig deeper'}
                </button>
                <button
                  className={`rh-act ${inCrate(current) ? 'is-on' : ''}`}
                  onClick={() => addToCrate(current)}
                >
                  {inCrate(current) ? 'In crate' : 'Add to crate'}
                </button>
              </div>
              {deep.node && <div className='rh-deep'>{deep.node}</div>}
            </div>

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
        onClose={() => setCrateOpen(false)}
        onRemove={removeFromCrate}
      />
    </div>
  )
}
