-- Apply through the Supabase SQL editor or Supabase CLI. No demo users or offers.
create table if not exists public.shortlists (
 user_id uuid primary key references auth.users(id) on delete cascade,
 saved text[] not null default '{}', compare text[] not null default '{}',
 version integer not null default 1 check(version>0), updated_at timestamptz not null default now(),
 check(cardinality(saved)<=500), check(cardinality(compare)<=3)
);
alter table public.shortlists enable row level security;
grant select,insert,update,delete on public.shortlists to authenticated;
revoke all on public.shortlists from anon;
create policy "Owner can read choices" on public.shortlists for select to authenticated using ((select auth.uid())=user_id);
create policy "Owner can insert choices" on public.shortlists for insert to authenticated with check ((select auth.uid())=user_id);
create policy "Owner can update choices" on public.shortlists for update to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
create policy "Owner can delete choices" on public.shortlists for delete to authenticated using ((select auth.uid())=user_id);
create or replace function public.save_shortlist(p_saved text[],p_compare text[],p_version integer)
returns jsonb language plpgsql security invoker set search_path=public as $$
declare next_version integer;begin
 if auth.uid() is null or cardinality(p_saved)>500 or cardinality(p_compare)>3 or p_version<0 then raise exception 'Invalid shortlist';end if;
 if p_version=0 then
  insert into public.shortlists(user_id,saved,compare) values(auth.uid(),p_saved,p_compare) on conflict do nothing returning version into next_version;
 else
  update public.shortlists set saved=p_saved,compare=p_compare,version=version+1,updated_at=now() where user_id=auth.uid() and version=p_version returning version into next_version;
 end if;
 return jsonb_build_object('ok',next_version is not null,'version',next_version);end;$$;
revoke all on function public.save_shortlist(text[],text[],integer) from public,anon;
grant execute on function public.save_shortlist(text[],text[],integer) to authenticated;

create table if not exists public.messages (
 id uuid primary key, fingerprint text not null,
 kind text not null check(kind in ('enquiry','correction')), project_id text,
 name text not null, email text not null, body text not null, evidence text,
 lang text not null check(lang in ('ar','en')),
 delivery_status text not null default 'queued' check(delivery_status in ('queued','accepted','failed')),
 provider_id text, created_at timestamptz not null default now()
);
alter table public.messages enable row level security;
-- No public/client read or write policies. Only the server service role accesses messages.
revoke all on public.messages from anon,authenticated;

create table if not exists public.service_limits (
 key text primary key, count integer not null, expires_at timestamptz not null
);
alter table public.service_limits enable row level security;
revoke all on public.service_limits from anon,authenticated;
create or replace function public.consume_submission_quota(p_key text,p_limit integer,p_window_seconds integer)
returns boolean language plpgsql security definer set search_path=public as $$
declare n integer;begin
 if p_limit<1 or p_limit>100 or p_window_seconds<1 or p_window_seconds>86400 or length(p_key)>200 then raise exception 'Invalid quota';end if;
 insert into public.service_limits as limits(key,count,expires_at) values(p_key,1,now()+make_interval(secs=>p_window_seconds))
 on conflict(key) do update set count=case when limits.expires_at<now() then 1 else limits.count+1 end,
 expires_at=case when limits.expires_at<now() then now()+make_interval(secs=>p_window_seconds) else limits.expires_at end returning count into n;
 return n<=p_limit;end;$$;
revoke all on function public.consume_submission_quota(text,integer,integer) from public,anon,authenticated;
grant execute on function public.consume_submission_quota(text,integer,integer) to service_role;

create table if not exists public.price_offers (
 project_id text primary key, amount numeric(14,2) not null check(amount>0), currency text not null default 'EGP' check(currency='EGP'),
 unit_type_en text not null, unit_type_ar text not null, note_en text not null default '',note_ar text not null default '',
 source_url text not null check(source_url like 'https://%'), source_checked_at timestamptz not null,
 valid_until timestamptz not null, updated_at timestamptz not null default now(),
 check(valid_until>source_checked_at),check(valid_until<=source_checked_at+interval '7 days')
);
alter table public.price_offers enable row level security;
create policy "Only current offers are public" on public.price_offers for select to anon,authenticated using (valid_until>now() and source_checked_at<=now());
grant select on public.price_offers to anon,authenticated;
revoke insert,update,delete on public.price_offers from anon,authenticated;

create table if not exists public.project_records (
 project_id text primary key,payload jsonb not null,source_url text not null,
 source_checked_at timestamptz not null,valid_until timestamptz not null,
 check(valid_until>source_checked_at),check(valid_until<=source_checked_at+interval '30 days')
);
alter table public.project_records enable row level security;
create policy "Current project records are public" on public.project_records for select to anon,authenticated using (valid_until>now() and source_checked_at<=now());
grant select on public.project_records to anon,authenticated;
revoke insert,update,delete on public.project_records from anon,authenticated;

-- Feed changes commit together; failures roll back both collections.
create or replace function public.apply_catalogue_feed(p_records jsonb,p_offers jsonb)
returns void language plpgsql security definer set search_path=public as $$
begin
 insert into public.project_records(project_id,payload,source_url,source_checked_at,valid_until)
 select project_id,payload,source_url,source_checked_at,valid_until from jsonb_to_recordset(p_records)
 as r(project_id text,payload jsonb,source_url text,source_checked_at timestamptz,valid_until timestamptz)
 on conflict(project_id) do update set payload=excluded.payload,source_url=excluded.source_url,source_checked_at=excluded.source_checked_at,valid_until=excluded.valid_until;
 insert into public.price_offers(project_id,amount,currency,unit_type_en,unit_type_ar,note_en,note_ar,source_url,source_checked_at,valid_until)
 select project_id,amount,currency,unit_type_en,unit_type_ar,note_en,note_ar,source_url,source_checked_at,valid_until from jsonb_to_recordset(p_offers)
 as r(project_id text,amount numeric,currency text,unit_type_en text,unit_type_ar text,note_en text,note_ar text,source_url text,source_checked_at timestamptz,valid_until timestamptz)
 on conflict(project_id) do update set amount=excluded.amount,currency=excluded.currency,unit_type_en=excluded.unit_type_en,unit_type_ar=excluded.unit_type_ar,note_en=excluded.note_en,note_ar=excluded.note_ar,source_url=excluded.source_url,source_checked_at=excluded.source_checked_at,valid_until=excluded.valid_until,updated_at=now();
end;$$;
revoke all on function public.apply_catalogue_feed(jsonb,jsonb) from public,anon,authenticated;
grant execute on function public.apply_catalogue_feed(jsonb,jsonb) to service_role;

-- Explicit privileges also support projects with hardened default grants.
grant all on public.messages,public.service_limits,public.price_offers,public.project_records to service_role;
