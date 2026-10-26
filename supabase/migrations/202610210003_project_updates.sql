-- Audit real catalogue/offer mutations in the same transaction; no fabricated history.
create table public.project_updates (
 id bigint generated always as identity primary key,
 project_id text not null,
 kind text not null check(kind in ('project_added','project_updated','project_removed','price_added','price_updated','price_removed')),
 changed_fields text[] not null default '{}',
 previous_amount numeric(14,2), current_amount numeric(14,2), currency text,
 previous_unit_en text, previous_unit_ar text, unit_type_en text, unit_type_ar text,
 source_url text, source_checked_at timestamptz, valid_until timestamptz,
 created_at timestamptz not null default now()
);
create index project_updates_recent on public.project_updates(id desc);
create index project_updates_project on public.project_updates(project_id,id desc);
alter table public.project_updates enable row level security;
revoke all on public.project_updates from public,anon,authenticated;
grant select on public.project_updates to anon,authenticated;
grant all on public.project_updates to service_role;
grant usage,select on sequence public.project_updates_id_seq to service_role;
create policy "Published project change history" on public.project_updates for select to anon,authenticated using (true);
create function public.record_project_update() returns trigger language plpgsql security definer set search_path=pg_catalog,public as $$
declare changed text[];begin
 if TG_OP='UPDATE' and old.payload= new.payload then return new;end if;
 if TG_OP='DELETE' then
  insert into public.project_updates(project_id,kind,source_url,source_checked_at,valid_until) values(old.project_id,'project_removed',old.source_url,old.source_checked_at,old.valid_until);return old;
 end if;
 if TG_OP='INSERT' then changed:=array['name','developer','area','location','status','description','amenities','url'];
 else
  select coalesce(array_agg(key order by key),'{}') into changed from jsonb_object_keys(new.payload||old.payload) key
  where key in ('name','developer','area','lat','lng','status','description','amenities','url','areaApprox') and old.payload->key is distinct from new.payload->key;
  if cardinality(changed)=0 then return new;end if;
 end if;
 insert into public.project_updates(project_id,kind,changed_fields,source_url,source_checked_at,valid_until)
 values(new.project_id,case when TG_OP='INSERT' then 'project_added' else 'project_updated' end,changed,new.source_url,new.source_checked_at,new.valid_until);
 return new;end;$$;
create function public.record_price_update() returns trigger language plpgsql security definer set search_path=pg_catalog,public as $$
begin
 if TG_OP='DELETE' then
  insert into public.project_updates(project_id,kind,previous_amount,currency,previous_unit_en,previous_unit_ar,source_url,source_checked_at,valid_until)
  values(old.project_id,'price_removed',old.amount,old.currency,old.unit_type_en,old.unit_type_ar,old.source_url,old.source_checked_at,old.valid_until);return old;
 end if;
 if TG_OP='UPDATE' and row(old.amount,old.currency,old.unit_type_en,old.unit_type_ar,old.note_en,old.note_ar) is not distinct from row(new.amount,new.currency,new.unit_type_en,new.unit_type_ar,new.note_en,new.note_ar) then return new;end if;
 insert into public.project_updates(project_id,kind,previous_amount,current_amount,currency,previous_unit_en,previous_unit_ar,unit_type_en,unit_type_ar,source_url,source_checked_at,valid_until)
 values(new.project_id,case when TG_OP='INSERT' then 'price_added' else 'price_updated' end,case when TG_OP='UPDATE' then old.amount end,new.amount,new.currency,case when TG_OP='UPDATE' then old.unit_type_en end,case when TG_OP='UPDATE' then old.unit_type_ar end,new.unit_type_en,new.unit_type_ar,new.source_url,new.source_checked_at,new.valid_until);
 return new;end;$$;
revoke all on function public.record_project_update() from public,anon,authenticated;
revoke all on function public.record_price_update() from public,anon,authenticated;
create trigger project_change_history after insert or update or delete on public.project_records for each row execute function public.record_project_update();
create trigger price_change_history after insert or update or delete on public.price_offers for each row execute function public.record_price_update();
