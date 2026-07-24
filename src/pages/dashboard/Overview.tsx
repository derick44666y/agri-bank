import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  ArrowDownRight,
  ArrowUpRight,
  Send,
  PlusCircle,
  Bitcoin,
  ShieldCheck,
  ShoppingBag,
  Coffee,
  Home,
  Building2,
} from "lucide-react";
import { fmtMoney, fmtDate, fmtIban } from "@/lib/format";

interface Account {
  id: string;
  name: string;
  type: string;
  currency: string;
  iban: string | null;
  balance_cents: number;
  is_primary: boolean;
}
interface Tx {
  id: string;
  description: string;
  amount_cents: number;
  direction: "credit" | "debit";
  currency: string;
  category: string | null;
  created_at: string;
  counterparty_name: string | null;
}

const categoryIcon = (c: string | null) => {
  const k = (c || "").toLowerCase();
  if (k.includes("groc") || k.includes("shop")) return ShoppingBag;
  if (k.includes("food") || k.includes("café") || k.includes("cafe")) return Coffee;
  if (k.includes("rent") || k.includes("home")) return Home;
  if (k.includes("salary") || k.includes("payroll")) return Building2;
  return Send;
};

const Overview = () => {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [txs, setTxs] = useState<Tx[]>([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<{ full_name: string | null; kyc_status: string } | null>(null);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [{ data: a }, { data: t }, { data: p }] = await Promise.all([
        supabase.from("accounts").select("*").eq("user_id", user.id).order("is_primary", { ascending: false }),
        supabase.from("transactions").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(8),
        supabase.from("profiles").select("full_name, kyc_status").eq("user_id", user.id).maybeSingle(),
      ]);
      setAccounts((a as any) || []);
      setTxs((t as any) || []);
      setProfile(p as any);
      setLoading(false);
    })();
  }, [user]);

  const primary = accounts.find((a) => a.is_primary) || accounts[0];
  const totalEur = accounts
    .filter((a) => a.currency === "EUR")
    .reduce((s, a) => s + a.balance_cents, 0);

  return (
    <div className="px-5 sm:px-8 lg:px-12 py-8 lg:py-12 max-w-6xl">
      {/* Heading */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-moss font-medium">Overview</p>
          <h1 className="mt-2 font-display text-3xl md:text-4xl text-primary">
            Hello, {profile?.full_name?.split(" ")[0] || "there"}.
          </h1>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="hero" size="sm">
            <Link to="/dashboard/transfers"><Send className="h-4 w-4" />Send money</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link to="/dashboard/transfers?tab=receive">Receive</Link>
          </Button>
        </div>
      </div>

      {profile?.kyc_status !== "verified" && (
        <Link to="/dashboard/verify" className="mt-6 flex items-center gap-3 p-4 rounded-2xl bg-accent/15 border border-accent/30 hover:bg-accent/20 transition-colors">
          <ShieldCheck className="h-5 w-5 text-accent-foreground" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">Verify your identity to unlock SWIFT, crypto trading and higher limits.</p>
            <p className="text-xs text-muted-foreground">Takes about 4 minutes.</p>
          </div>
          <span className="text-sm text-primary font-medium">Start →</span>
        </Link>
      )}

      {/* Primary balance */}
      <Card className="mt-8 overflow-hidden border-border/70 shadow-card">
        <div className="p-6 sm:p-8 bg-gradient-field text-primary-foreground">
          <p className="text-xs uppercase tracking-[0.22em] opacity-70">{primary?.name || "Main account"} · {fmtIban(primary?.iban)}</p>
          <div className="mt-3 flex items-baseline gap-2 flex-wrap">
            <span className="font-display text-4xl sm:text-5xl">{fmtMoney(primary?.balance_cents ?? 0, primary?.currency)}</span>
            <span className="text-xs uppercase tracking-[0.2em] opacity-70">{primary?.currency}</span>
          </div>
          <div className="mt-3 inline-flex items-center gap-1 text-xs text-accent">
            <ArrowUpRight className="h-3.5 w-3.5" />
            Total across EUR accounts: {fmtMoney(totalEur, "EUR")}
          </div>
        </div>
        <div className="grid grid-cols-3 divide-x divide-border">
          <Link to="/dashboard/transfers" className="py-4 text-sm font-medium text-primary hover:bg-secondary text-center transition-colors">Send</Link>
          <Link to="/dashboard/transfers?tab=receive" className="py-4 text-sm font-medium text-primary hover:bg-secondary text-center transition-colors">Receive</Link>
          <Link to="/dashboard/crypto" className="py-4 text-sm font-medium text-primary hover:bg-secondary text-center transition-colors">Crypto</Link>
        </div>
      </Card>

      {/* All accounts */}
      <div className="mt-12 grid lg:grid-cols-3 gap-4">
        {accounts.map((a) => (
          <Card key={a.id} className="p-5 border-border/70">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{a.type}</p>
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-secondary">{a.currency}</span>
            </div>
            <p className="mt-2 text-sm font-medium">{a.name}</p>
            <p className="mt-3 font-display text-2xl text-primary">{fmtMoney(a.balance_cents, a.currency)}</p>
            <p className="mt-1 text-xs text-muted-foreground truncate">{fmtIban(a.iban)}</p>
          </Card>
        ))}
        <Card className="p-5 border-dashed border-border flex items-center justify-center text-muted-foreground hover:bg-secondary/40 transition-colors cursor-pointer">
          <div className="text-center">
            <PlusCircle className="h-5 w-5 mx-auto" />
            <p className="mt-2 text-sm">Add account</p>
          </div>
        </Card>
      </div>

      {/* Recent transactions */}
      <div className="mt-12 flex items-center justify-between">
        <h2 className="font-display text-2xl text-primary">Recent activity</h2>
      </div>
      <Card className="mt-4 border-border/70">
        {loading ? (
          <div className="p-12 text-center text-muted-foreground text-sm">Loading…</div>
        ) : txs.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground text-sm">No transactions yet.</div>
        ) : (
          <div className="divide-y divide-border">
            {txs.map((t) => {
              const Icon = categoryIcon(t.category);
              const isCredit = t.direction === "credit";
              return (
                <div key={t.id} className="flex items-center gap-4 px-5 sm:px-6 py-4">
                  <div className="grid place-items-center h-10 w-10 rounded-full bg-secondary text-primary shrink-0">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{t.description}</p>
                    <p className="text-xs text-muted-foreground">{fmtDate(t.created_at)}{t.category ? ` · ${t.category}` : ""}</p>
                  </div>
                  <div className={`flex items-center gap-1 text-sm font-medium ${isCredit ? "text-moss" : "text-foreground"}`}>
                    {isCredit ? <ArrowDownRight className="h-3.5 w-3.5" /> : <ArrowUpRight className="h-3.5 w-3.5" />}
                    {isCredit ? "+" : "−"}{fmtMoney(t.amount_cents, t.currency)}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
};

export default Overview;
