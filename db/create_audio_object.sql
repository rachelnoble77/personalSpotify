Insert into audio_object
(auth_id, acousticness, danceability, energy, instrumentalness, tempo, valence, uri)
values
($1, $2, $3, $4, $5, $6, $7, $8)
returning *;