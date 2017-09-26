insert into fav_pl
(user_name, email, auth_id, fav_artist)
values
($1, $2, $3, $4)
returning *;