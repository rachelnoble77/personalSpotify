create table if not exists users (
    id serial primary key,
    user_name VARCHAR(180), 
    email VARCHAR(180),
    auth_id TEXT
)