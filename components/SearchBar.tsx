'use client';

import { useState } from 'react';

interface SearchBarProps {
  onSearch: (filters: { search: string; startDate: string; endDate: string }) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [search, setSearch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleApply = () => {
    onSearch({ search, startDate, endDate });
  };

  const handleClear = () => {
    setSearch('');
    setStartDate('');
    setEndDate('');
    onSearch({ search: '', startDate: '', endDate: '' });
  };

  return (
    <div className="bg-surface-container rounded-[20px] p-4 border border-white/5 flex flex-col md:flex-row gap-4 items-end">
      <div className="flex flex-col gap-2 flex-1 w-full">
        <label className="text-[10px] font-button-label text-zinc-500 uppercase tracking-wider">Search</label>
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-[18px]">search</span>
          <input
            type="text"
            placeholder="Search description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 w-full bg-zinc-900 rounded-[10px] border border-white/5 pl-10 pr-4 font-body-sm text-on-surface focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2 w-full md:w-auto">
        <label className="text-[10px] font-button-label text-zinc-500 uppercase tracking-wider">From</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="h-10 w-full md:w-36 bg-zinc-900 rounded-[10px] border border-white/5 px-3 font-data-md text-xs text-on-surface focus:outline-none focus:border-primary/50 transition-colors"
        />
      </div>

      <div className="flex flex-col gap-2 w-full md:w-auto">
        <label className="text-[10px] font-button-label text-zinc-500 uppercase tracking-wider">To</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="h-10 w-full md:w-36 bg-zinc-900 rounded-[10px] border border-white/5 px-3 font-data-md text-xs text-on-surface focus:outline-none focus:border-primary/50 transition-colors"
        />
      </div>

      <div className="flex gap-2 w-full md:w-auto">
        <button
          onClick={handleApply}
          className="h-10 flex-1 md:flex-none md:px-6 bg-primary-container text-on-primary-container rounded-[10px] font-button-label text-xs hover:bg-primary-container/80 transition-colors"
        >
          Apply
        </button>
        <button
          onClick={handleClear}
          className="h-10 w-10 flex items-center justify-center bg-surface-container-highest/50 text-on-surface-variant rounded-[10px] hover:bg-white/5 transition-colors"
          title="Clear Filters"
        >
          <span className="material-symbols-outlined text-[18px]">filter_alt_off</span>
        </button>
      </div>
    </div>
  );
}
