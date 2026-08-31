import '../styles/skeleton.css'

export function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton skeleton-title"></div>
      <div className="skeleton skeleton-text"></div>
      <div className="skeleton skeleton-text" style={{ width: '80%' }}></div>
      <div className="skeleton-footer">
        <div className="skeleton skeleton-badge"></div>
        <div className="skeleton skeleton-badge"></div>
      </div>
    </div>
  )
}

export function SkeletonList() {
  return (
    <div className="skeleton-list">
      {[...Array(5)].map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}

export function SkeletonText({ lines = 3, width = '100%' }) {
  return (
    <div className="skeleton-text-block">
      {[...Array(lines)].map((_, i) => (
        <div
          key={i}
          className="skeleton skeleton-text"
          style={{
            width: i === lines - 1 ? width : '100%',
            marginBottom: i < lines - 1 ? '8px' : '0'
          }}
        ></div>
      ))}
    </div>
  )
}

export function LoadingSpinner() {
  return (
    <div className="loading-spinner">
      <div className="spinner"></div>
      <p>Loading...</p>
    </div>
  )
}
