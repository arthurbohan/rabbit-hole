import ListenRow from './ListenRow.jsx'

export default function CratePanel({ open, crate, onClose, onRemove }) {
  return (
    <aside className={`rh-panel ${open ? 'is-open' : ''}`} data-testid='crate-panel'>
      <div className='rh-panel-head'>
        <div className='rh-panel-title'>Crate</div>
        <button className='rh-close' onClick={onClose}>
          Close
        </button>
      </div>
      {crate.length === 0 ? (
        <p className='rh-panel-empty'>
          Nothing here yet. Add anything worth coming back to.
        </p>
      ) : (
        crate.map((item) => (
          <div className='rh-crate-item' key={item.id}>
            <h3 className='rh-crate-name'>{item.name}</h3>
            {item.track && <p className='rh-crate-track'>{item.track}</p>}
            {item.relation && (
              <div className='rh-crate-from'>
                {item.relation} of {item.from}
              </div>
            )}
            <ListenRow name={item.name} track={item.track} />
            <button className='rh-remove' onClick={() => onRemove(item.id)}>
              Remove
            </button>
          </div>
        ))
      )}
    </aside>
  )
}
