create or replace function public.confirm_credit_order(_order_id uuid, _provider_ref text, _receipt_url text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  o public.payment_orders;
begin
  select * into o from public.payment_orders where id = _order_id for update;
  if not found then
    return jsonb_build_object('ok', false, 'reason', 'not_found');
  end if;
  if o.status = 'paid' then
    return jsonb_build_object('ok', true, 'already', true);
  end if;

  update public.payment_orders
    set status = 'paid',
        paid_at = now(),
        provider_ref = coalesce(_provider_ref, provider_ref),
        receipt_url = coalesce(_receipt_url, receipt_url)
    where id = _order_id;

  if o.user_id is not null then
    update public.profiles
      set credits = credits + (o.credits + o.bonus)
      where id = o.user_id;
  end if;

  return jsonb_build_object('ok', true, 'credited', o.credits + o.bonus, 'user_id', o.user_id);
end;
$$;

revoke all on function public.confirm_credit_order(uuid, text, text) from public, anon, authenticated;