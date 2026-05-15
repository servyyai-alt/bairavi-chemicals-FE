import ProductCard from './ProductCard';

function RecommendationSkeleton() {
  return (
    <div className="flex gap-4 overflow-x-auto pb-2">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="min-w-[220px] sm:min-w-[240px] lg:min-w-0 lg:flex-1 rounded-2xl border border-gray-200 p-4 animate-pulse bg-white"
        >
          <div className="aspect-square rounded-xl bg-gray-200 mb-4" />
          <div className="h-4 rounded bg-gray-200 w-1/3 mb-2" />
          <div className="h-5 rounded bg-gray-200 w-3/4 mb-3" />
          <div className="h-4 rounded bg-gray-200 w-1/2 mb-4" />
          <div className="h-8 rounded bg-gray-200 w-2/5" />
        </div>
      ))}
    </div>
  );
}

export default function RecommendedProductsSection({ title = 'You May Also Like', products = [], loading = false }) {
  if (!loading && products.length === 0) return null;

  return (
    <section className="mt-10">
      <div className="flex items-end justify-between gap-4 mb-5">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary-600">Picked For You</p>
          <h2 className="text-2xl font-bold text-gray-900 mt-1">{title}</h2>
        </div>
        {!loading && products.length > 0 && (
          <p className="hidden sm:block text-sm text-gray-500">{products.length} suggestions</p>
        )}
      </div>

      {loading ? (
        <RecommendationSkeleton />
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory lg:grid lg:grid-cols-4">
          {products.map(product => (
            <div key={product._id} className="min-w-[220px] sm:min-w-[240px] lg:min-w-0 snap-start">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
