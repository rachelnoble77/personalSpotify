Insert into user_playlist
(user_name, email, auth_id, music_experience, type, genre, mood)
values
($1, $2, $3, $4, $5, $6, $7)
returning *;