-- Attach the new-user handler so signups auto-create a profile + default role
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- One-time admin bootstrap: grant admin to the calling user ONLY if no admin exists yet
CREATE OR REPLACE FUNCTION public.claim_admin_if_none()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
declare
  _uid uuid := auth.uid();
  _exists boolean;
begin
  if _uid is null then
    return jsonb_build_object('ok', false, 'reason', 'not_authenticated');
  end if;

  select exists(select 1 from public.user_roles where role = 'admin') into _exists;
  if _exists then
    -- if caller is already admin, report success; otherwise refuse
    if exists(select 1 from public.user_roles where user_id = _uid and role = 'admin') then
      return jsonb_build_object('ok', true, 'already', true);
    end if;
    return jsonb_build_object('ok', false, 'reason', 'admin_exists');
  end if;

  insert into public.user_roles (user_id, role)
  values (_uid, 'admin')
  on conflict (user_id, role) do nothing;

  return jsonb_build_object('ok', true, 'granted', true);
end;
$$;

GRANT EXECUTE ON FUNCTION public.claim_admin_if_none() TO authenticated;