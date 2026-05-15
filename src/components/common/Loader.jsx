export function Loader({ size = 'md' }) {
  const sizes = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' };
  return (
    <div className="flex items-center justify-center p-8">
      <div className={`${sizes[size]} border-3 border-primary-200 border-t-primary-600 rounded-full animate-spin`} style={{ borderWidth: '3px' }} />
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-5xl mb-4 animate-bounce">🌿</div>
        <p className="text-gray-500 font-medium">Loading FreshMart...</p>
      </div>
    </div>
  );
}
