'use client';

import { useState } from 'react';
import { Expense, CATEGORIES } from '@/types/expense';
import { formatRupees } from '@/lib/money';

interface EditExpenseDrawerProps {
  expense: Expense;
  onClose: () => void;
  onSave: (id: string, data: any) => Promise<boolean>;
  onDelete: (id: string) => Promise<boolean>;
}

export default function EditExpenseDrawer({ expense, onClose, onSave, onDelete }: EditExpenseDrawerProps) {
  const [amount, setAmount] = useState(expense.amount.toString());
  const [description, setDescription] = useState(expense.description);
  const [category, setCategory] = useState(expense.category);
  const [date, setDate] = useState(expense.date);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  const handleSave = async () => {
    if (!amount || !description) return;
    setIsSaving(true);
    const success = await onSave(expense.id, {
      amount: parseFloat(amount),
      description: description.trim(),
      category,
      date,
    });
    setIsSaving(false);
    if (success) onClose();
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    const success = await onDelete(expense.id);
    setIsDeleting(false);
    if (success) onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-surface border-l border-white/10 z-50 shadow-2xl shadow-black/80 flex flex-col animate-slide-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <h2 className="font-h1 text-xl text-on-surface">Edit Expense</h2>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-surface-container-highest/50 flex items-center justify-center hover:bg-white/10 transition-colors"
          >
            <span className="material-symbols-outlined text-on-surface-variant">close</span>
          </button>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-button-label text-zinc-500 uppercase">Amount (₹)</label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="h-12 w-full bg-zinc-900 rounded-[10px] border border-white/5 px-4 font-data-md text-on-surface focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-button-label text-zinc-500 uppercase">Description</label>
            <input
              type="text"
              required
              maxLength={200}
              autoComplete="off"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="h-12 w-full bg-zinc-900 rounded-[10px] border border-white/5 px-4 font-body-sm text-on-surface focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-button-label text-zinc-500 uppercase">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="h-12 w-full bg-zinc-900 rounded-[10px] border border-white/5 px-4 font-body-sm text-on-surface focus:outline-none focus:border-primary/50 transition-colors appearance-none"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-button-label text-zinc-500 uppercase">Date</label>
            <input
              type="date"
              required
              max={today}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="h-12 w-full bg-zinc-900 rounded-[10px] border border-white/5 px-4 font-data-md text-on-surface focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-white/5 space-y-3">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`w-full bg-primary-container text-on-primary-container h-14 rounded-[10px] font-button-label text-button-label flex items-center justify-center gap-3 transition-all ${
              isSaving ? 'opacity-70 cursor-not-allowed' : 'hover:bg-primary-container/80 hover:scale-[1.02]'
            }`}
          >
            {isSaving ? (
              <>
                <div className="spinner"></div>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[20px]">save</span>
                <span>Save Changes</span>
              </>
            )}
          </button>

          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full bg-transparent border border-error/30 text-error h-12 rounded-[10px] font-button-label text-button-label flex items-center justify-center gap-3 hover:bg-error/10 transition-all"
            >
              <span className="material-symbols-outlined text-[20px]">delete</span>
              <span>Delete Expense</span>
            </button>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 bg-surface-container-highest text-on-surface h-12 rounded-[10px] font-button-label text-button-label hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className={`flex-1 bg-error-container text-on-error-container h-12 rounded-[10px] font-button-label text-button-label flex items-center justify-center gap-2 transition-all ${
                  isDeleting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-error/80'
                }`}
              >
                {isDeleting ? (
                  <div className="spinner"></div>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[18px]">delete_forever</span>
                    <span>Confirm</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
