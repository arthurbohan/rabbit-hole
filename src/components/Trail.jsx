export default function Trail({ trail, currentName, onJumpBack }) {
  if (trail.length === 0) return null

  return (
    <nav className='rh-trail' aria-label='Path so far' data-testid='trail'>
      {trail.map((hop, i) => (
        <div className='rh-hop' key={`${hop.name}-${i}`}>
          <button className='rh-hop-name' onClick={() => onJumpBack(i)}>
            {hop.name}
          </button>
          <span className='rh-conn'>
            <span className='rh-conn-label'>{hop.relation}</span>
            <span className='rh-conn-line' />
          </span>
        </div>
      ))}
      <span className='rh-hop-name rh-hop-current'>{currentName}</span>
    </nav>
  )
}
