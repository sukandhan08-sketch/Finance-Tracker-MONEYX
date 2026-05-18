import React, { useEffect, useMemo, useState } from "react";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Plus,
  Trash2,
  Sparkles,
  PiggyBank,
  Target,
  Coffee,
  Car,
  ShoppingBag,
  BookOpen,
  ReceiptText,
  Search,
  IndianRupee,
} from "lucide-react";

const defaultTransactions = [
  { id: 1, title: "Monthly Salary", category: "Income", amount: 45000, type: "income" },
  { id: 2, title: "Burger Night", category: "Food", amount: 750, type: "expense" },
  { id: 3, title: "Metro Pass", category: "Transport", amount: 1200, type: "expense" },
  { id: 4, title: "Freelance UI Work", category: "Income", amount: 9000, type: "income" },
  { id: 5, title: "Course Fees", category: "Education", amount: 2500, type: "expense" },
];

export default function PersonalFinanceTracker() {
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem("transactions");
    return saved ? JSON.parse(saved) : defaultTransactions;
  });

  const [budgetLimit, setBudgetLimit] = useState(() => Number(localStorage.getItem("budgetLimit")) || 18000);
  const [savingsGoal, setSavingsGoal] = useState(() => Number(localStorage.getItem("savingsGoal")) || 25000);
  const [searchText, setSearchText] = useState("");
  const [filterType, setFilterType] = useState("all");

  const [form, setForm] = useState({
    title: "",
    amount: "",
    type: "expense",
    category: "Food",
  });

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem("budgetLimit", budgetLimit);
  }, [budgetLimit]);

  useEffect(() => {
    localStorage.setItem("savingsGoal", savingsGoal);
  }, [savingsGoal]);

  const totals = useMemo(() => {
    const income = transactions
      .filter((item) => item.type === "income")
      .reduce((sum, item) => sum + item.amount, 0);

    const expense = transactions
      .filter((item) => item.type === "expense")
      .reduce((sum, item) => sum + item.amount, 0);

    const balance = income - expense;

    return {
      income,
      expense,
      balance,
      budgetUsed: Math.min((expense / budgetLimit) * 100, 100),
      savingsUsed: Math.min((balance / savingsGoal) * 100, 100),
    };
  }, [transactions, budgetLimit, savingsGoal]);

  const filteredTransactions = transactions.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchText.toLowerCase()) || item.category.toLowerCase().includes(searchText.toLowerCase());
    const matchesType = filterType === "all" || item.type === filterType;
    return matchesSearch && matchesType;
  });

  const categoryTotals = useMemo(() => {
    const categories = {};
    transactions
      .filter((item) => item.type === "expense")
      .forEach((item) => {
        categories[item.category] = (categories[item.category] || 0) + item.amount;
      });
    return Object.entries(categories).sort((a, b) => b[1] - a[1]);
  }, [transactions]);

  const addTransaction = (e) => {
    e.preventDefault();
    if (!form.title || !form.amount || Number(form.amount) <= 0) {
      alert("Please enter a valid title and amount");
      return;
    }

    const newTransaction = {
      id: Date.now(),
      title: form.title,
      amount: Number(form.amount),
      type: form.type,
      category: form.type === "income" ? "Income" : form.category,
    };

    setTransactions([newTransaction, ...transactions]);
    setForm({ title: "", amount: "", type: "expense", category: "Food" });
  };

  const deleteTransaction = (id) => {
    setTransactions(transactions.filter((item) => item.id !== id));
  };

  const clearAll = () => {
    const confirmClear = confirm("Are you sure you want to clear all transactions?");
    if (confirmClear) setTransactions([]);
  };

  const resetDemo = () => {
    setTransactions(defaultTransactions);
    setBudgetLimit(18000);
    setSavingsGoal(25000);
  };

  return (
    <div className="min-h-screen bg-[#0b1020] text-white overflow-hidden">
      <div className="fixed top-0 left-0 w-80 h-80 bg-purple-600 rounded-full blur-3xl opacity-30 -translate-x-20 -translate-y-20"></div>
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-cyan-500 rounded-full blur-3xl opacity-20 translate-x-20 translate-y-20"></div>

      <main className="relative max-w-7xl mx-auto px-5 py-6">
        <nav className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center shadow-lg shadow-purple-900/40">
              <Wallet />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight">MONEYX</h1>
              <p className="text-slate-400 text-sm">Functional Personal Finance Tracker</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button onClick={resetDemo} className="bg-white/10 border border-white/10 rounded-full px-4 py-2 text-sm hover:bg-white/20 transition">
              Reset Demo
            </button>
            <button onClick={clearAll} className="bg-red-500/20 border border-red-400/20 text-red-200 rounded-full px-4 py-2 text-sm hover:bg-red-500/30 transition">
              Clear All
            </button>
            <div className="flex items-center gap-3 bg-white/10 border border-white/10 rounded-full px-4 py-2 backdrop-blur-xl">
              <Sparkles size={18} className="text-yellow-300" />
              <span className="text-sm text-slate-200">Saved automatically</span>
            </div>
          </div>
        </nav>

        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-6">
            <div className="relative rounded-[2rem] bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-7 shadow-2xl overflow-hidden">
              <div className="absolute right-8 top-8 w-32 h-32 bg-white/20 rounded-full blur-2xl"></div>
              <div className="relative flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                  <p className="text-white/75 mb-2">Available Balance</p>
                  <h2 className="text-5xl font-black">₹{totals.balance.toLocaleString()}</h2>
                  <p className="text-white/80 mt-4 max-w-md">
                    Add income and expenses, search records, filter transactions, and track your budget.
                  </p>
                </div>

                <div className="bg-black/20 border border-white/20 rounded-3xl p-5 backdrop-blur-xl min-w-60">
                  <p className="text-sm text-white/70">Savings Goal</p>
                  <div className="flex items-center gap-2 mt-2">
                    <IndianRupee size={16} />
                    <input
                      type="number"
                      value={savingsGoal}
                      onChange={(e) => setSavingsGoal(Number(e.target.value))}
                      className="bg-white/10 border border-white/10 rounded-xl px-3 py-2 w-full outline-none"
                    />
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-3 mt-4">
                    <div className="bg-white h-3 rounded-full" style={{ width: `${totals.savingsUsed}%` }}></div>
                  </div>
                  <p className="text-xs text-white/70 mt-2">{Math.round(totals.savingsUsed)}% completed</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <MoneyCard title="Income" amount={totals.income} icon={<TrendingUp />} color="from-emerald-400 to-teal-500" />
              <MoneyCard title="Expenses" amount={totals.expense} icon={<TrendingDown />} color="from-rose-400 to-orange-500" />
              <MoneyCard title="Budget Left" amount={budgetLimit - totals.expense} icon={<PiggyBank />} color="from-blue-400 to-indigo-500" />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="bg-white/10 border border-white/10 backdrop-blur-xl rounded-[2rem] p-6">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="text-xl font-bold">Budget Meter</h2>
                    <p className="text-slate-400 text-sm">You can edit your monthly limit</p>
                  </div>
                  <Target className="text-cyan-300" />
                </div>

                <div className="mb-4">
                  <label className="text-sm text-slate-300">Monthly Budget</label>
                  <input
                    type="number"
                    value={budgetLimit}
                    onChange={(e) => setBudgetLimit(Number(e.target.value))}
                    className="mt-2 w-full bg-black/25 border border-white/10 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-400"
                  />
                </div>

                <div className="w-full bg-slate-700 rounded-full h-4">
                  <div className="bg-gradient-to-r from-cyan-400 to-purple-500 h-4 rounded-full" style={{ width: `${totals.budgetUsed}%` }}></div>
                </div>

                <div className="mt-4 flex justify-between text-sm text-slate-300">
                  <span>Spent ₹{totals.expense.toLocaleString()}</span>
                  <span>{Math.round(totals.budgetUsed)}% used</span>
                </div>

                <p className={`mt-3 text-sm ${totals.expense > budgetLimit ? "text-red-300" : "text-emerald-300"}`}>
                  {totals.expense > budgetLimit ? "Alert: You crossed your budget!" : "Good: You are within your budget."}
                </p>
              </div>

              <div className="bg-white/10 border border-white/10 backdrop-blur-xl rounded-[2rem] p-6">
                <h2 className="text-xl font-bold mb-1">Category Spending</h2>
                <p className="text-slate-400 text-sm mb-5">Expense split by category</p>
                <div className="space-y-3">
                  {categoryTotals.length === 0 ? (
                    <p className="text-slate-400">No expenses yet.</p>
                  ) : (
                    categoryTotals.map(([category, amount]) => (
                      <div key={category} className="bg-black/25 border border-white/10 rounded-2xl p-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span>{category}</span>
                          <span>₹{amount.toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2">
                          <div
                            className="bg-cyan-400 h-2 rounded-full"
                            style={{ width: `${Math.min((amount / totals.expense) * 100, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white/10 border border-white/10 backdrop-blur-xl rounded-[2rem] p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
                <div>
                  <h2 className="text-xl font-bold">Recent Transactions</h2>
                  <p className="text-slate-400 text-sm">Search, filter, and delete transactions</p>
                </div>
                <ReceiptText className="text-purple-300" />
              </div>

              <div className="flex flex-col md:flex-row gap-3 mb-5">
                <div className="flex items-center gap-2 bg-black/25 border border-white/10 rounded-2xl px-4 py-3 flex-1">
                  <Search size={18} className="text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search transaction or category"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="bg-transparent outline-none w-full placeholder:text-slate-500"
                  />
                </div>

                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="bg-black/25 border border-white/10 rounded-2xl px-4 py-3 outline-none"
                >
                  <option className="text-black" value="all">All</option>
                  <option className="text-black" value="income">Income</option>
                  <option className="text-black" value="expense">Expense</option>
                </select>
              </div>

              <div className="space-y-3">
                {filteredTransactions.length === 0 ? (
                  <p className="text-center text-slate-400 py-8">No matching transactions found.</p>
                ) : (
                  filteredTransactions.map((item) => (
                    <div key={item.id} className="flex items-center justify-between bg-black/20 border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition">
                      <div className="flex items-center gap-3">
                        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${item.type === "income" ? "bg-emerald-500/20 text-emerald-300" : "bg-rose-500/20 text-rose-300"}`}>
                          {item.type === "income" ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                        </div>
                        <div>
                          <h3 className="font-semibold">{item.title}</h3>
                          <p className="text-sm text-slate-400">{item.category}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <p className={`font-black ${item.type === "income" ? "text-emerald-300" : "text-rose-300"}`}>
                          {item.type === "income" ? "+" : "-"}₹{item.amount.toLocaleString()}
                        </p>
                        <button onClick={() => deleteTransaction(item.id)} className="text-slate-500 hover:text-red-400 transition">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <aside className="lg:col-span-4">
            <div className="sticky top-6 bg-white/10 border border-white/10 backdrop-blur-xl rounded-[2rem] p-6 shadow-2xl">
              <div className="mb-6">
                <h2 className="text-2xl font-black">Add Transaction</h2>
                <p className="text-slate-400 text-sm">Record your income or expense</p>
              </div>

              <form onSubmit={addTransaction} className="space-y-4">
                <div>
                  <label className="text-sm text-slate-300">Title</label>
                  <input
                    type="text"
                    placeholder="Example: Coffee, Salary"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="mt-2 w-full bg-black/25 border border-white/10 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-400 placeholder:text-slate-500"
                  />
                </div>

                <div>
                  <label className="text-sm text-slate-300">Amount</label>
                  <input
                    type="number"
                    placeholder="Enter amount"
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                    className="mt-2 w-full bg-black/25 border border-white/10 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-400 placeholder:text-slate-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, type: "income" })}
                    className={`rounded-2xl py-3 font-bold transition ${form.type === "income" ? "bg-emerald-500 text-white" : "bg-black/25 text-slate-300"}`}
                  >
                    Income
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, type: "expense" })}
                    className={`rounded-2xl py-3 font-bold transition ${form.type === "expense" ? "bg-rose-500 text-white" : "bg-black/25 text-slate-300"}`}
                  >
                    Expense
                  </button>
                </div>

                {form.type === "expense" && (
                  <div>
                    <label className="text-sm text-slate-300">Category</label>
                    <select
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className="mt-2 w-full bg-black/25 border border-white/10 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-400"
                    >
                      <option className="text-black">Food</option>
                      <option className="text-black">Transport</option>
                      <option className="text-black">Shopping</option>
                      <option className="text-black">Bills</option>
                      <option className="text-black">Education</option>
                      <option className="text-black">Other</option>
                    </select>
                  </div>
                )}

                <button className="w-full bg-gradient-to-r from-cyan-400 to-purple-500 text-white py-4 rounded-2xl font-black shadow-lg shadow-purple-900/40 hover:scale-[1.02] transition flex items-center justify-center gap-2">
                  <Plus size={20} /> Add Transaction
                </button>
              </form>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <CategoryChip icon={<Coffee size={18} />} label="Food" />
                <CategoryChip icon={<Car size={18} />} label="Transport" />
                <CategoryChip icon={<ShoppingBag size={18} />} label="Shopping" />
                <CategoryChip icon={<BookOpen size={18} />} label="Education" />
              </div>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}

function MoneyCard({ title, amount, icon, color }) {
  return (
    <div className="bg-white/10 border border-white/10 rounded-[2rem] p-5 backdrop-blur-xl hover:-translate-y-1 transition">
      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mb-5 shadow-lg`}>
        {icon}
      </div>
      <p className="text-slate-400 text-sm">{title}</p>
      <h3 className="text-2xl font-black mt-1">₹{amount.toLocaleString()}</h3>
    </div>
  );
}

function CategoryChip({ icon, label }) {
  return (
    <div className="bg-black/25 border border-white/10 rounded-2xl p-3 flex items-center gap-2 hover:bg-white/10 transition">
      <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-cyan-300">
        {icon}
      </div>
      <span className="font-semibold text-sm">{label}</span>
    </div>
  );
}