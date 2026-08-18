export default function SearchBar({ query, onQueryChange, onStart, onSurprise }) {
  return (
    <div className='rh-search'>
      <input
        className='rh-input'
        data-testid='search-input'
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onStart(query)}
        placeholder='An artist, album, genre or track'
        aria-label='Starting point'
      />
      <button className='rh-go' data-testid='follow' onClick={() => onStart(query)}>
        Follow
      </button>
      <button className='rh-shuffle' data-testid='surprise' onClick={onSurprise}>
        Surprise me
      </button>
    </div>
  )
}
