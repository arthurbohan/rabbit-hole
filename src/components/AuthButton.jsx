export default function AuthButton({ user, onLogout }) {
  if (!user) {
    return (
      <a className='rh-crate-btn' data-testid='login' href='/api/auth/google'>
        Sign in
      </a>
    )
  }

  return (
    <button className='rh-crate-btn' data-testid='logout' onClick={onLogout}>
      {user.name || user.email} · Log out
    </button>
  )
}
