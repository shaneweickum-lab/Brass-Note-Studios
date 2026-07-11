export const dynamic = "force-dynamic";

import { revalidatePath } from "next/cache";
import {
  kvGetAllExpenses,
  kvCreateExpense,
  kvUpdateExpense,
  kvDeleteExpense,
} from "@/lib/supabase/queries";
import type { Expense, Recurrence } from "@/types/studio";
import { EXPENSE_CATEGORIES } from "@/types/studio";
import ExpensesClient from "./ExpensesClient";

export default async function ExpensesPage() {
  const expenses = await kvGetAllExpenses();

  const activeExpenses = expenses.filter((e) => e.active);
  const totalMonthly = activeExpenses.reduce((sum, e) => sum + (e.monthlyCost ?? 0), 0);
  const totalAnnual  = activeExpenses.reduce((sum, e) => sum + (e.annualCost ?? (e.monthlyCost ?? 0) * 12), 0);

  async function addExpense(formData: FormData) {
    "use server";
    const str = (key: string) => ((formData.get(key) as string) || "").trim() || undefined;
    await kvCreateExpense({
      studioId: "bns",
      expenseName: (formData.get("expenseName") as string || "").trim(),
      recurrence: (formData.get("recurrence") as Recurrence) || "monthly",
      nextDueDate: str("nextDueDate"),
      monthlyCost: parseFloat(formData.get("monthlyCost") as string) || undefined,
      annualCost: parseFloat(formData.get("annualCost") as string) || undefined,
      category: str("category"),
      autoRenew: formData.get("autoRenew") === "on",
      active: true,
      notes: str("notes"),
    });
    revalidatePath("/admin/portal/expenses");
  }

  async function updateExpense(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    const existing = expenses.find((e) => e.id === id);
    if (!existing) return;
    const str = (key: string) => ((formData.get(key) as string) || "").trim() || undefined;
    await kvUpdateExpense({
      ...existing,
      expenseName: (formData.get("expenseName") as string || "").trim(),
      recurrence: (formData.get("recurrence") as Recurrence) || "monthly",
      nextDueDate: str("nextDueDate"),
      monthlyCost: parseFloat(formData.get("monthlyCost") as string) || undefined,
      annualCost: parseFloat(formData.get("annualCost") as string) || undefined,
      category: str("category"),
      autoRenew: formData.get("autoRenew") === "on",
      active: formData.get("active") !== "false",
      notes: str("notes"),
    });
    revalidatePath("/admin/portal/expenses");
  }

  async function toggleActive(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    const active = formData.get("active") === "true";
    const existing = expenses.find((e) => e.id === id);
    if (!existing) return;
    await kvUpdateExpense({ ...existing, active });
    revalidatePath("/admin/portal/expenses");
  }

  async function deleteExpense(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    await kvDeleteExpense(id);
    revalidatePath("/admin/portal/expenses");
  }

  return (
    <ExpensesClient
      expenses={expenses}
      totalMonthly={totalMonthly}
      totalAnnual={totalAnnual}
      addExpense={addExpense}
      updateExpense={updateExpense}
      toggleActive={toggleActive}
      deleteExpense={deleteExpense}
    />
  );
}
