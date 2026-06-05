import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

type AuthedContext = { supabase: any; userId: string };

async function callerIsAdmin(context: AuthedContext): Promise<boolean> {
  const { data, error } = await context.supabase.rpc("has_role", {
    _user_id: context.userId,
    _role: "admin",
  });
  if (error) return false;
  return data === true;
}

/** Whether the current signed-in user is an admin. */
export const getIsAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    return { isAdmin: await callerIsAdmin(context as AuthedContext) };
  });

/** One-time bootstrap: become admin if none exists yet. */
export const claimAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await (context as AuthedContext).supabase.rpc("claim_admin_if_none");
    if (error) throw new Error(error.message);
    return data as { ok: boolean; reason?: string; granted?: boolean; already?: boolean };
  });

/** Full admin dataset: stats, orders, users and credit packages. */
export const getAdminData = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    if (!(await callerIsAdmin(context as AuthedContext))) {
      throw new Error("Forbidden: admin only");
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const [ordersRes, profilesRes, rolesRes, packagesRes] = await Promise.all([
      supabaseAdmin
        .from("payment_orders")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(300),
      supabaseAdmin
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(300),
      supabaseAdmin.from("user_roles").select("user_id, role"),
      supabaseAdmin.from("credit_packages").select("*").order("sort_order", { ascending: true }),
    ]);

    const profiles = profilesRes.data ?? [];
    const orders = ordersRes.data ?? [];
    const roles = rolesRes.data ?? [];
    const packages = packagesRes.data ?? [];

    const profileById = new Map(profiles.map((p) => [p.id, p]));
    const rolesByUser = new Map<string, string[]>();
    for (const r of roles) {
      const arr = rolesByUser.get(r.user_id) ?? [];
      arr.push(r.role);
      rolesByUser.set(r.user_id, arr);
    }

    const ordersOut = orders.map((o) => {
      const p = o.user_id ? profileById.get(o.user_id) : null;
      return {
        ...o,
        userName: p?.full_name ?? null,
        userEmail: p?.email ?? null,
      };
    });

    const usersOut = profiles.map((p) => ({
      ...p,
      roles: rolesByUser.get(p.id) ?? [],
    }));

    const paid = orders.filter((o) => o.status === "paid");
    const pending = orders.filter((o) => o.status === "pending");
    const revenue = paid.reduce((s, o) => s + Number(o.amount || 0), 0);
    const creditsSold = paid.reduce((s, o) => s + Number(o.credits || 0) + Number(o.bonus || 0), 0);

    const stats = {
      totalOrders: orders.length,
      paidCount: paid.length,
      pendingCount: pending.length,
      revenue,
      creditsSold,
      userCount: profiles.length,
    };

    return { stats, orders: ordersOut, users: usersOut, packages };
  });

/** Confirm a credit order — applies credits (+bonus) to the buyer. */
export const confirmOrder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { orderId: string; providerRef?: string; receiptUrl?: string }) => d)
  .handler(async ({ context, data }) => {
    if (!(await callerIsAdmin(context as AuthedContext))) {
      throw new Error("Forbidden: admin only");
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: res, error } = await supabaseAdmin.rpc("confirm_credit_order", {
      _order_id: data.orderId,
      _provider_ref: data.providerRef ?? null,
      _receipt_url: data.receiptUrl ?? null,
    });
    if (error) throw new Error(error.message);
    return res as { ok: boolean; credited?: number; already?: boolean };
  });

/** Adjust a user's credit balance manually (admin). */
export const adjustCredits = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { userId: string; delta: number }) => d)
  .handler(async ({ context, data }) => {
    if (!(await callerIsAdmin(context as AuthedContext))) {
      throw new Error("Forbidden: admin only");
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: profile, error: readErr } = await supabaseAdmin
      .from("profiles")
      .select("credits")
      .eq("id", data.userId)
      .single();
    if (readErr) throw new Error(readErr.message);
    const next = Math.max(0, Number(profile?.credits ?? 0) + data.delta);
    const { error } = await supabaseAdmin
      .from("profiles")
      .update({ credits: next })
      .eq("id", data.userId);
    if (error) throw new Error(error.message);
    return { ok: true, credits: next };
  });
