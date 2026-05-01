export default function DashboardLoading() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left Column: Summary & Controls Skeleton */}
      <div className="lg:col-span-5 flex flex-col gap-8">
        <section>
          <h1 className="font-h1 text-h1 text-on-surface mb-4">Dashboard Overview</h1>
          <div className="bg-[#161616] rounded-[40px] p-8 border border-white/5 relative overflow-hidden">
            <div className="flex justify-between items-start mb-12">
              <div>
                <p className="font-button-label text-button-label text-on-surface-variant uppercase mb-2">Total Expenditure</p>
                <div className="h-12 w-48 rounded-lg skeleton-shimmer"></div>
              </div>
              <div className="p-3 bg-primary-container/20 rounded-2xl">
                <span className="material-symbols-outlined text-primary">account_balance_wallet</span>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="h-4 w-24 rounded bg-surface-container-highest"></div>
              <div className="h-4 w-16 rounded bg-surface-container-highest"></div>
            </div>
          </div>
        </section>
        <section className="bg-[#161616] rounded-[20px] p-6 border border-white/5">
          <h3 className="font-data-lg text-data-lg mb-6">Quick Action</h3>
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-button-label text-zinc-500 uppercase">Expense Category</label>
              <div className="h-12 w-full bg-zinc-900 rounded-[10px] border border-white/5"></div>
            </div>
            <button disabled className="w-full bg-primary-container opacity-90 text-on-primary-container h-14 rounded-[10px] flex items-center justify-center gap-3">
              <div className="spinner"></div>
              <span className="font-button-label text-button-label">Loading...</span>
            </button>
          </div>
        </section>
      </div>

      {/* Right Column: Expense List Skeleton */}
      <div className="lg:col-span-7">
        <div className="flex justify-between items-end mb-8">
          <h2 className="font-h1 text-h1 text-on-surface">Recent Activity</h2>
          <div className="h-6 w-32 rounded bg-surface-container-highest/50"></div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="bg-[#161616] rounded-[20px] p-5 flex items-center justify-between border border-white/5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl skeleton-shimmer shrink-0"></div>
                <div className="space-y-2">
                  <div className={`h-4 ${i % 2 === 0 ? 'w-40' : 'w-32'} rounded skeleton-shimmer`}></div>
                  <div className={`h-3 ${i % 3 === 0 ? 'w-24' : 'w-16'} rounded bg-surface-container-highest`}></div>
                </div>
              </div>
              <div className={`h-5 ${i % 2 === 0 ? 'w-20' : 'w-24'} rounded skeleton-shimmer`}></div>
            </div>
          ))}
        </div>
        <div className="mt-8 flex justify-center">
          <div className="h-10 w-40 rounded-full border border-white/10 skeleton-shimmer opacity-50"></div>
        </div>
      </div>
    </div>
  );
}
