create table if not exists audio_object (
    id SERIAL PRIMARY KEY,
    auth_id TEXT,
    acousticness FLOAT,
    danceability FLOAT,
    energy FLOAT, 
    instrumentalness FLOAT,
    tempo FLOAT,
    valence FLOAT,
    uri string 
)
