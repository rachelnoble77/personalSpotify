create table if not exists fav_pl (
    id serial primary key,
    user_name VARCHAR(180),
    email VARCHAR(180),
    auth_id VARCHAR(180),
    fav_artist VARCHAR(180)
)