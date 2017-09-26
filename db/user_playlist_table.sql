create table if not exists user_playlist (
    id serial primary key,
    user_name VARCHAR(180),
    email VARCHAR(180),
    auth_id VARCHAR(180),
    music_experience VARCHAR(180),
    type VARCHAR(180),
    genre VARCHAR(180),
    mood VARCHAR(180),
)