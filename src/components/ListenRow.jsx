import { SERVICES, searchTerm } from '../music.js'

export default function ListenRow({ name, track }) {
  const term = searchTerm(name, track)
  return (
    <p className='rh-listen'>
      <span className='rh-listen-label'>Listen</span>
      {SERVICES.map((service) => (
        <a
          key={service.label}
          className='rh-listen-link'
          href={service.url(term)}
          target='_blank'
          rel='noopener noreferrer'
        >
          {service.label}
        </a>
      ))}
    </p>
  )
}
