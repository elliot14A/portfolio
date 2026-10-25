create table if not exists chat_rate_limits (
  ip text primary key,
  count integer not null default 1,
  reset_at integer not null,
  created_at text not null default current_timestamp,
  updated_at text not null default current_timestamp
);

create index if not exists idx_chat_rate_limits_reset on chat_rate_limits(reset_at);
