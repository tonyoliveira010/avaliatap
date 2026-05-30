-- Trigger-only functions: never called directly via API, revoke execute broadly
revoke all on function public.update_updated_at_column() from public, anon, authenticated;
revoke all on function public.prevent_credit_tampering() from public, anon, authenticated;
revoke all on function public.handle_new_user() from public, anon, authenticated;

-- has_role is used inside RLS policies for authenticated users only
revoke all on function public.has_role(uuid, public.app_role) from public, anon;
grant execute on function public.has_role(uuid, public.app_role) to authenticated;