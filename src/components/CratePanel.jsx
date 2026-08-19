import ListenRow from './ListenRow.jsx'

export default function CratePanel({ open, crate, user, onClose, onRemove, onExplore }) {
  return (
    <aside className={`rh-panel ${open ? 'is-open' : ''}`} data-testid='crate-panel'>
      <div className='rh-panel-head'>
        <div className='rh-panel-title'>Crate</div>
        <button className='rh-close' onClick={onClose}>
          Close
        </button>
      </div>
      {!user && (
        <p className='rh-panel-hint'>
          Saved in this browser only — sign in to sync across devices.
        </p>
      )}
      {crate.length === 0 ? (
        <p className='rh-panel-empty'>
          Nothing here yet. Add anything worth coming back to.
        </p>
      ) : (
        crate.map((item) => (
          <div className='rh-crate-item' key={item.id}>
            <div className='rh-crate-head'>
              <h3 className='rh-crate-name'>
                <button className='rh-crate-name-link' onClick={() => onExplore(item.name)}>
                  {item.name}
                </button>
              </h3>
              <button
                className='rh-remove'
                onClick={() => onRemove(item.id)}
                aria-label='Remove from crate'
              >
                <svg width='13' height='13' viewBox='0 0 24 24' fill='none'>
                  <path
                    d='M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14Z'
                    stroke='currentColor'
                    strokeWidth='1.6'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
              </button>
            </div>
            {item.track && <p className='rh-crate-track'>{item.track}</p>}
            {item.relation && (
              <div className='rh-crate-from'>
                {item.relation} of {item.from}
              </div>
            )}
            <ListenRow name={item.name} track={item.track} />
          </div>
        ))
      )}
    </aside>
  )
}
