create table if not exists chat_device_limits (
  device_id text not null,
  date text not null,
  count integer not null default 1,
  created_at text not null default current_timestamp,
  updated_at text not null default current_timestamp,
  primary key (device_id, date)
);

create index if not exists idx_chat_device_limits_date on chat_device_limits(date);

create table if not exists chat_global_daily_usage (
  date text primary key,
  count integer not null default 1,
  created_at text not null default current_timestamp,
  updated_at text not null default current_timestamp
);
