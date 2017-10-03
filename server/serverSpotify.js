var spotifyApi = new SpotifyWebApi({
    clientId : appKey,
    clientSecret : appSecret,
    redirectUri : "http://localhost:3030/auth/spotify/callback"
  });

  spotifyApi.setAccessToken('BQA0UGp0pB9rGoBEjtQ7Gya1wwAIzhrwkQPYOxalgqqTD4RTpuKrJBwoCLas7tArH7o0n_2mVMdXVYri7Ir-2TlkEUxOPt6hPakq-zSm4jsnovrRPTSVzHPulLRMmiyC8dXb_BBotZr7dFJIPvVe3_J4QY2I4z9LI88&refresh_token=AQBWyGkBXh2wb3uQ-s4l9lmI9LJfNmH_Szf-rJdNiIJqe8Ru0FhYZGThLPDtLdLAMM-jmrC3datwVqKvXPX0P786K99YgOv1OF8wo1QysxdXa2TdwwdAdcIUCBuQbGvipHs')

  spotifyApi.getArtistAlbums('43ZHCT0cAZBISjO8DG9PnE')
  .then(function(data) {
    console.log('Artist albums', data.body);
  }, function(err) {
    console.error(err);
  });