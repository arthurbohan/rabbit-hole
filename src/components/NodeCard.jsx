import ListenRow from './ListenRow.jsx'

export default function NodeCard({
  node,
  deepText,
  isDeepLoading,
  isInCrate,
  onDigDeeper,
  onAddToCrate,
}) {
  return (
    <div className='rh-node-block'>
      <div className='rh-eyebrow'>Now at</div>
      <h1 className='rh-node-name' data-testid='node-name'>
        {node.name}
      </h1>
      <p className='rh-tagline'>{node.tagline}</p>
      <ListenRow name={node.name} />
      <div className='rh-actions'>
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
  )
}