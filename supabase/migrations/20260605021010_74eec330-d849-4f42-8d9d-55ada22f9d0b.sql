-- Lock down order confirmation to trusted server (service_role) only
REVOKE EXECUTE ON FUNCTION public.confirm_credit_order(uuid, text, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.confirm_credit_order(uuid, text, text) TO service_role;

-- Admin bootstrap: signed-in users only (not anonymous)
REVOKE EXECUTE ON FUNCTION public.claim_admin_if_none() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.claim_admin_if_none() TO authenticated;

-- Role check helper: not callable by anonymous visitors
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;