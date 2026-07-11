"use client";

import { useState } from "react";
import type { Expense, Recurrence } from "@/types/studio";
import { EXPENSE_CATEGORIES } from "@/types/studio";

interface Props {
  expenses: Expense[];
  totalMonthly: number;
  totalAnnual: number;
  addExpense: (formData: FormData) => Promise<void>;
  updateExpense: (formData: FormData) => Promise<void>;
  toggleActive: (formData: FormData) => Promise<void>;
  deleteExpense: (formData: FormData) => Promise<void>;
}

const input =
  "w-full bg-background border border-white/10 rounded px-3 py-2 font-body text-base text-text-base placeholder:text-text-subtle focus:outline-none focus:border-gold/50 transition-colors";

function fmt(n?: number) {
  if (!n) return "—";
  return `$${n.toFixed(2)}`;
}

function RecurrenceBadge({ r }: { r: Recurrence }) {
  const styles: Record<Recurrence, string> = {
    monthly:    "border-blue-400/30 bg-blue-400/10 text-blue-300",
    annual:     "border-gold/30 bg-gold/10 text-gold",
    "one-time": "border-white/20 text-text-subtle",
  };
  const labels: Record<Recurrence, string> = { monthly: "Monthly", annual: "Annual", "one-time": "One-time" };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded border text-xs font-body ${styles[r]}`}>
      {labels[r]}
    </span>
  );
}

function ExpenseRow({
  expense,
  updateExpense,
  toggleActive,
  deleteExpense,
}: {
  expense: Expense;
  updateExpense: (fd: FormData) => Promise<void>;
  toggleActive: (fd: FormData) => Promise<void>;
  deleteExpense: (fd: FormData) => Promise<void>;
}) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <tr className="border-b border-white/5">
        <td colSpan={7} className="px-4 py-4 bg-surface">
          <form action={async (fd) => { await updateExpense(fd); setEditing(false); }} className="space-y-3">
            <input type="hidden" name="id" value={expense.id} />
            <input type="hidden" name="active" value={String(expense.active)} />
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-body text-xs text-text-subtle mb-1">Name</label>
                <input name="expenseName" defaultValue={expense.expenseName} required className={input} />
              </div>
              <div>
                <label className="block font-body text-xs text-text-subtle mb-1">Category</label>
                <select name="category" defaultValue={expense.category ?? ""} className={input}>
                  <option value="">— None —</option>
                  {EXPENSE_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block font-body text-xs text-text-subtle mb-1">Recurrence</label>
                <select name="recurrence" defaultValue={expense.recurrence} className={input}>
                  <option value="monthly">Monthly</option>
                  <option value="annual">Annual</option>
                  <option value="one-time">One-time</option>
                </select>
              </div>
              <div>
                <label className="block font-body text-xs text-text-subtle mb-1">Monthly Cost ($)</label>
                <input name="monthlyCost" type="number" step={0.01} min={0} defaultValue={expense.monthlyCost ?? ""} className={input} />
              </div>
              <div>
                <label className="block font-body text-xs text-text-subtle mb-1">Annual Cost ($)</label>
                <input name="annualCost" type="number" step={0.01} min={0} defaultValue={expense.annualCost ?? ""} className={input} />
              </div>
              <div>
                <label className="block font-body text-xs text-text-subtle mb-1">Next Due Date</label>
                <input name="nextDueDate" type="date" defaultValue={expense.nextDueDate ?? ""} className={input} />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <input name="autoRenew" type="checkbox" id={`ar-${expense.id}`} defaultChecked={expense.autoRenew} className="w-4 h-4 accent-gold" />
              <label htmlFor={`ar-${expense.id}`} className="font-body text-sm text-text-muted cursor-pointer">Auto-renew</label>
            </div>
            <div className="flex items-center gap-3">
              <button type="submit" className="px-4 py-1.5 bg-gold text-background font-body text-xs rounded hover:bg-gold-light transition-colors">Save</button>
              <button type="button" onClick={() => setEditing(false)} className="px-4 py-1.5 border border-white/20 text-text-muted font-body text-xs rounded hover:bg-white/5 transition-colors">Cancel</button>
            </div>
          </form>
        </td>
      </tr>
    );
  }

  return (
    <tr className={`border-b border-white/5 last:border-0 transition-colors ${expense.active ? "hover:bg-white/[0.03]" : "opacity-50"}`}>
      <td className="px-4 py-3 font-body text-sm text-text-base">{expense.expenseName}</td>
      <td className="px-4 py-3 font-body text-xs text-text-subtle">{expense.category ?? "—"}</td>
      <td className="px-4 py-3"><RecurrenceBadge r={expense.recurrence} /></td>
      <td className="px-4 py-3 font-mono text-sm text-text-muted">{fmt(expense.monthlyCost)}</td>
      <td className="px-4 py-3 font-mono text-sm text-text-muted">{fmt(expense.annualCost)}</td>
      <td className="px-4 py-3 font-body text-xs text-text-subtle">{expense.nextDueDate ?? "—"}</td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <button onClick={() => setEditing(true)} className="font-body text-xs text-gold hover:text-gold-light transition-colors">Edit</button>
          <form action={toggleActive}>
            <input type="hidden" name="id" value={expense.id} />
            <input type="hidden" name="active" value={String(!expense.active)} />
            <button type="submit" className="font-body text-xs text-text-subtle hover:text-text-muted transition-colors">
              {expense.active ? "Pause" : "Resume"}
            </button>
          </form>
          <form action={deleteExpense} onSubmit={(e) => { if (!confirm("Delete this expense?")) e.preventDefault(); }}>
            <input type="hidden" name="id" value={expense.id} />
            <button type="submit" className="font-body text-xs text-red-400/70 hover:text-red-400 transition-colors">Delete</button>
          </form>
        </div>
      </td>
    </tr>
  );
}

export default function ExpensesClient({ expenses, totalMonthly, totalAnnual, addExpense, updateExpense, toggleActive, deleteExpense }: Props) {
  const [showAdd, setShowAdd] = useState(false);

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-3xl text-text-base">Expenses</h1>
          <p className="text-text-muted font-body text-sm mt-1">{expenses.filter(e => e.active).length} active subscriptions</p>
        </div>
        <button
          onClick={() => setShowAdd((v) => !v)}
          className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 bg-gold text-background font-body text-sm font-medium rounded hover:bg-gold-light transition-colors"
        >
          {showAdd ? "Cancel" : "+ Add Expense"}
        </button>
      </div>

      {/* Totals */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="bg-surface border border-white/10 rounded-lg px-4 py-4">
          <p className="font-body text-xs text-text-subtle uppercase tracking-[0.1em] mb-1">Monthly Total</p>
          <p className="font-display text-2xl text-gold">${totalMonthly.toFixed(2)}</p>
        </div>
        <div className="bg-surface border border-white/10 rounded-lg px-4 py-4">
          <p className="font-body text-xs text-text-subtle uppercase tracking-[0.1em] mb-1">Annual Total</p>
          <p className="font-display text-2xl text-text-base">${totalAnnual.toFixed(2)}</p>
        </div>
        <div className="bg-surface border border-white/10 rounded-lg px-4 py-4">
          <p className="font-body text-xs text-text-subtle uppercase tracking-[0.1em] mb-1">Active Items</p>
          <p className="font-display text-2xl text-text-base">{expenses.filter(e => e.active).length}</p>
        </div>
      </div>

      {/* Add form */}
      {showAdd && (
        <div className="bg-surface border border-gold/20 rounded-lg overflow-hidden">
          <div className="px-5 py-4 border-b border-white/10">
            <h2 className="font-display text-lg text-text-base">Add Expense</h2>
          </div>
          <div className="px-5 py-5">
            <form action={async (fd) => { await addExpense(fd); setShowAdd(false); }} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-1">
                  <label className="block font-body text-xs text-text-subtle mb-1">Name *</label>
                  <input name="expenseName" required placeholder="Suno AI Pro" className={input} />
                </div>
                <div>
                  <label className="block font-body text-xs text-text-subtle mb-1">Category</label>
                  <select name="category" className={input}>
                    <option value="">— None —</option>
                    {EXPENSE_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block font-body text-xs text-text-subtle mb-1">Recurrence</label>
                  <select name="recurrence" defaultValue="monthly" className={input}>
                    <option value="monthly">Monthly</option>
                    <option value="annual">Annual</option>
                    <option value="one-time">One-time</option>
                  </select>
                </div>
                <div>
                  <label className="block font-body text-xs text-text-subtle mb-1">Monthly Cost ($)</label>
                  <input name="monthlyCost" type="number" step={0.01} min={0} placeholder="29.99" className={input} />
                </div>
                <div>
                  <label className="block font-body text-xs text-text-subtle mb-1">Annual Cost ($)</label>
                  <input name="annualCost" type="number" step={0.01} min={0} placeholder="299.00" className={input} />
                </div>
                <div>
                  <label className="block font-body text-xs text-text-subtle mb-1">Next Due Date</label>
                  <input name="nextDueDate" type="date" className={input} />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <input name="autoRenew" type="checkbox" id="add-auto-renew" defaultChecked className="w-4 h-4 accent-gold" />
                <label htmlFor="add-auto-renew" className="font-body text-sm text-text-muted cursor-pointer">Auto-renew</label>
              </div>
              <button type="submit" className="px-5 py-2 bg-gold text-background font-body text-sm font-medium rounded hover:bg-gold-light transition-colors">
                Add Expense
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-surface border border-white/10 rounded-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-white/10">
          <h2 className="font-display text-lg text-text-base">All Expenses</h2>
        </div>
        {expenses.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <p className="text-text-muted font-body text-sm">No expenses tracked yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  {["Name", "Category", "Recurrence", "Monthly", "Annual", "Next Due", "Actions"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left font-body text-xs text-text-subtle uppercase tracking-[0.1em] whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {expenses.map((expense) => (
                  <ExpenseRow
                    key={expense.id}
                    expense={expense}
                    updateExpense={updateExpense}
                    toggleActive={toggleActive}
                    deleteExpense={deleteExpense}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
