import ListenRow from './ListenRow.jsx'

export default function BranchCard({
  branch,
  deepText,
  isDeepLoading,
  isInCrate,
  onGoTo,
  onDigDeeper,
  onAddToCrate,
}) {
  return (
    <article className='rh-branch' data-testid='branch'>
      <div className='rh-rel'>{branch.relation}</div>
      <div>
        <h2 className='rh-b-name'>{branch.name}</h2>
        <p className='rh-why'>{branch.why}</p>
        <p className='rh-entry'>
          <span className='rh-entry-label'>Way in</span>
          {branch.track}
        </p>
        <ListenRow name={branch.name} track={branch.track} />
        <div className='rh-actions'>
          <button className='rh-act' onClick={onGoTo}>
            Go here
          </button>
          <button
            className={`rh-act ${deepText ? 'is-on' : ''}`}
            onClick={onDigDeeper}
          >
            {isDeepLoading ? 'Reading…' : deepText ? 'Close notes' : 'Dig deeper'}
          </button>
          <button
            className={`rh-act ${isInCrate ? 'is-on' : ''}`}
            onClick={onAddToCrate}
          >
            {isInCrate ? 'In crate' : 'Add to crate'}
          </button>
        </div>
        {deepText && <div className='rh-deep'>{deepText}</div>}
      </div>
    </article>
  )
}
