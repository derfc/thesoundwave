const express = require("express");
const handlebars = require("express-handlebars");
const bodyParser = require("body-parser");
const StoreSQL = require("./storesql");
let storeSQL = new StoreSQL(
  "users",
  "store",
  "item",
  "cart",
  "song",
  "artist",
  "library",
  "playlist",
  "album"
);

const app = express();
const port = 3000;
const authRoutes = require("./routes/auth-routes");
const passportSetup = require("./config/passport-setup");
const keys = require("./config/keys");
const passport = require("passport");
const session = require("express-session");
const stripePublicKey = process.env.stripe_pk;
const stripeSecretKey = process.env.stripe_sk;
const stripe = require("stripe")(stripeSecretKey);

//cookie session
const cookieSession = require("cookie-session");
const { default: knex } = require("knex");

app.use(
  cookieSession({
    //1 day
    maxAge: 24 * 60 * 60 * 1000,
    keys: [keys.session.cookieKey],
  })
);

app.use(
  session({
    secret: "supersecret",
    resave: false,
    saveUninitialized: false,
  })
);

//initialize passport
app.use(passport.initialize());
app.use(passport.session());

//auth routes
app.use("/auth", authRoutes);

//handlebars
app.engine(
  "handlebars",
  handlebars({
    defaultLayout: "main",
    helpers: {
      add: function (a, b) {
        return a + b;
      },
      times: function (a, b) {
        return a * b;
      },
      divide: function (a, b) {
        return a / b;
      },
    },
  })
);
app.set("view engine", "handlebars");

//body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//static files
app.use(express.static(__dirname + "/public"));

// get Picture and Name
let pic;
let user;

function getNamePic(req) {
  if (req.user.provider === "google") {
    pic = req.user._json.picture;
    user = req.user.displayName;
  } else if (req.user.provider === "facebook") {
    pic = req.user.photos[0].value;
    user = req.user.displayName;
  } else {
    user = req.user.username;
  }
}

//authcheck
const authCheck = (req, res, next) => {
  if (req.isAuthenticated()) {
    console.log("He is allowed!");
    return next();
  } else {
    res.redirect("/auth/login");
  }
};

//landing page
app.get("/", (req, res) => {
  res.render("index");
});

//home route
app.get("/home", authCheck, (req, res) => {
  let user_id = 1;
  let id = req.user.id;

  getNamePic(req);

  return storeSQL.getPlaylist(user_id).then((playlist) => {
    // console.log("PL outpout", playlist);
    storeSQL.getAllSong().then((songs) => {
      // console.log("where is the 19th", songs);
      res.render("home", {
        playlistSongArr: songs,
        playlist: playlist,
        layout: "dashboard",
        stripePublicKey: stripePublicKey,
        user: user,
        thumbnail: pic,
        searchScript: "./searchScript.js",
        honeMusicPlayer: "/musicplayer.js",
      });
    });
  });
});

//search
app.post("/home", (req, res) => {
  let keywords = req.body.keywords;
  let user_id = 1;
  if (keywords == "artist") {
    return storeSQL.searchForArtist().then((artist) => {
      res.send({ artist: artist });
    });
  } else if (keywords == "album") {
    return storeSQL.searchForAlbum().then((album) => {
      res.send({ album: album });
    });
  } else {
    return storeSQL.searchForArtist(keywords).then((artist) => {
      storeSQL.searchForAlbum(keywords).then((album) => {
        storeSQL.searchForSong(keywords).then((song) => {
          storeSQL.getPlaylist(user_id).then((playlist) => {
            let searchResult = {
              artist: artist,
              album: album,
              song: song,
              playlist: playlist,
            };
            res.send(searchResult);
          });
        });
      });
    });
  }
});

app.post("/home/artist/:artist_id", (req, res) => {
  let artist_id = req.params.artist_id;
  return storeSQL.getArtist(artist_id).then((artistInfo) => {
    console.log(artistInfo);
    storeSQL.getAlbumByArtist(artistInfo[0].id).then((album) => {
      let result = { artist: artistInfo, album: album };
      res.send(result);
    });
  });
});

app.post("/home/album/:album_id", (req, res) => {
  let user_id = 1;
  let album_id = req.params.album_id;
  console.log(album_id, "geeez");
  return storeSQL.getAlbum(album_id).then((albumInfo) => {
    // console.log(albumInfo);
    storeSQL.getSongByAlbum(albumInfo[0].id).then((song) => {
      // console.log("haha", song);
      storeSQL.getPlaylist(user_id).then((playlist) => {
        // console.log("playlist", playlist);
        // song.push({ albumName: playlist });
        // console.log("haha", song);
        let result = {
          song: song,
          album: albumInfo,
          playlist: playlist,
        };
        res.send(result);
      });
    });
  });
});

//get playlist
app.get("/library/:library_id", (req, res) => {
  // console.log("hi", req.params.playlist_id);
  let library_id = req.params.library_id;
  let count = 0;
  let playlistSongArr = [];
  let user_id = 1;
  return storeSQL.getSongByPlaylist(library_id).then((playlistSongs) => {
    // console.log("PL id outpout", playlistSongs);
    if (playlistSongs.length !== 0) {
      playlistSongs.forEach((playlistSong) => {
        let song_id = playlistSong.song_id;
        storeSQL.getSongById(song_id).then((song) => {
          // console.log("what is this type", song[0]);
          playlistSongArr.push(song[0]);
          count++;
          if (count == playlistSongs.length) {
            // console.log("finally", playlistSongArr);
            storeSQL.getPlaylist(user_id).then((playlist) => {
              // console.log("PL outpout", playlist);
              res.render("playlist", {
                layout: "dashboard",
                libraryId: library_id,
                playlist: playlist,
                playlistSongArr: playlistSongArr,
                stripePublicKey: stripePublicKey,
                css: "../css/index.css",
                user: user,
                thumbnail: pic,
              });
            });
          }
        });
      });
    } else {
      storeSQL.getPlaylist(user_id).then((playlist) => {
        // console.log("PL outpout", playlist);
        res.render("playlist", {
          layout: "dashboard",
          playlist: playlist,
          stripePublicKey: stripePublicKey,
          css: "../css/index.css",
        });
      });
    }
  });
});

app.post("/library", (req, res) => {
  let user_id = 1;
  // console.log("hello", req.body.playlistName);
  let newPlaylistName = req.body.playlistName;
  return storeSQL.addPlaylist(newPlaylistName, user_id).then((library_id) => {
    // console.log("hihihihi", library_id[0]);
    res.redirect(`/library/${library_id[0]}`);
  });
});

//add song to playlist
app.post("/playlist/:library_id/:song_id", (req, res) => {
  let libraryId = req.params.library_id;
  let addSongId = req.params.song_id;
  // console.log("lid", libraryId);
  // console.log("asid", addSongId);
  return storeSQL.searchSongInPlaylist(libraryId, addSongId).then((result) => {
    if (result[0]) {
      // console.log("yes", result);
      res.send("already in playlist!");
    } else {
      storeSQL.addSongToPlaylist(libraryId, addSongId).then(() => {
        res.send("added to playlist!");
      });
    }
  });
});

//del playlist
app.delete("/library/:library_id", (req, res) => {
  // console.log("hello", req.params.library_id);
  let deleteId = req.params.library_id;
  return storeSQL.delAllSongsInPlaylist(deleteId).then(() => {
    storeSQL.delPlaylistInLibrary(deleteId).then(() => {
      res.send("playlist deleted");
    });
  });
});

//del song
app.delete("/playlist/:library_id/:song_id", (req, res) => {
  let libraryId = req.params.library_id;
  let deleteSongId = req.params.song_id;
  // console.log("hello PLID", libraryId);
  // console.log("hello SID", deleteSongId);
  return storeSQL
    .delOneSongInPlaylist(libraryId, deleteSongId)
    .then(() => res.send("song deleted"));
});

//setting route
app.get("/setting", (req, res) => {
  res.render("setting", { layout: "dashboard", user: user, thumbnail: pic });
});

//setting route
app.put("/setting", (req, res) => {
  res.render("setting", { layout: "dashboard" });
});

//store route
app.get("/store", (req, res) => {
  return storeSQL.getStoreItem().then((item) => {
    res.render("store", {
      item: item,
      layout: "dashboard",
      stripePublicKey: stripePublicKey,
      user: user,
      thumbnail: pic,
      storeScript: "./storeScript.js",
    });
  });
});

app.post("/store", (req, res) => {
  let keywords = req.body.keywords;
  let user_id = 1;

  if (keywords == "store") {
    return storeSQL.searchForStore().then((store) => {
      res.send({ store: store });
    });
  } else {
    return storeSQL.searchForStore(keywords).then((store) => {
      return storeSQL.searchForItem(keywords).then((items) => {
        let result = { store: store, items: items };
        res.send(result);
      });
    });
  }
  // if (keywords == "artist") {
  // 	return storeSQL.searchForArtist().then((artist) => {
  // 		res.send({ artist: artist });
  // 	});
  // } else if (keywords == "album") {
  // 	return storeSQL.searchForAlbum().then((album) => {
  // 		res.send({ album: album });
  // 	});
  // } else {
  // 	return storeSQL.searchForArtist(keywords).then((artist) => {
  // 		storeSQL.searchForAlbum(keywords).then((album) => {
  // 			storeSQL.searchForSong(keywords).then((song) => {
  // 				storeSQL.getPlaylist(user_id).then((playlist) => {
  // 					let searchResult = {
  // 						artist: artist,
  // 						album: album,
  // 						song: song,
  // 						playlist: playlist,
  // 					};
  // 					res.send(searchResult);
  // 				});
  // 			});
  // 		});
  // 	});
  // }
});

//cart route
app.get("/cart", (req, res) => {
  let user_id = 1;
  return storeSQL.getCartItem(user_id).then((item) => {
    res.render("cart", {
      item: item,
      layout: "dashboard",
      stripePublicKey: stripePublicKey,
      user: user,
      thumbnail: pic,
    });
  });
});

app.post("/cart", (req, res) => {
  let item_id = req.body.item_id;
  let user_id = req.body.user_id;
  return storeSQL.addToCart(user_id, item_id).then(() => {
    res.render("cart", {
      layout: "dashboard",
      stripePublicKey: stripePublicKey,
    });
  });
});

app.post("/purchase", (req, res) => {
  let total = 0;
  let count = 0;
  req.body.items.forEach((item) => {
    storeSQL.getItemPrice(item.item_id).then((data) => {
      total += data[0].item_price * item.quantity;
      count++;
      if (count === req.body.items.length) {
        console.log("charge below");
        // stripe.charges
        // 	.create({
        // 		amount: total,
        // 		source: req.body.stripeTokenId,
        // 		currency: "usd",
        // 	})
        // 	.then(() => {
        // 		console.log("charge successful");
        // //clear cart
        // 		res.json({ message: "successfully purchased" });
        // 	})
        // 	.catch((err) => {
        // 		console.log("charge fail", err);
        // 		res.status(500).end();
        // 	});
      }
    });
  });
});

app.delete("/cart/:user_id/:item_id", (req, res) => {
  let user_id = req.params.user_id;
  let delete_item = req.params.item_id;
  return storeSQL.delCartItem(user_id, delete_item).then(() => {
    return storeSQL.getCartItem(user_id).then((item) => {
      res.render("cart", {
        item: item,
        layout: "dashboard",
        stripePublicKey: stripePublicKey,
      });
    });
  });
});

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
