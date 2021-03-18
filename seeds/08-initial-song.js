exports.seed = function (knex) {
	// Deletes ALL existing entries
	return knex("song")
		.del()
		.then(function () {
			// Inserts seed entries
			return knex("song").insert([
				{
					id: 1,
					song_name: "Allegro, Opus 3.3 am",
					song_url:
						"https://thesoundwave.s3-us-west-1.amazonaws.com/h3m/Eason+Chan+%E9%99%B3%E5%A5%95%E8%BF%85+Allegro%2C+Opus+3.3+am+MV.mp3",
					artist_id: 3,
					album_id: 1,
					genre_id: 1,
				},
				{
					id: 2,
					song_name: "還有什麼可以送給你",
					song_url:
						"https://thesoundwave.s3-us-west-1.amazonaws.com/h3m/%E9%82%84%E6%9C%89%E4%BB%80%E9%BA%BC%E5%8F%AF%E4%BB%A5%E9%80%81%E7%B5%A6%E4%BD%A0+-+%E9%99%B3%E5%A5%95%E8%BF%85.mp3",
					artist_id: 3,
					album_id: 1,
					genre_id: 1,
				},
				{
					id: 3,
					song_name: "於心有愧",
					song_url:
						"https://thesoundwave.s3-us-west-1.amazonaws.com/h3m/Eason+%E9%99%B3%E5%A5%95%E8%BF%85+%E6%96%BC%E5%BF%83%E6%9C%89%E6%84%A7+MV.mp3",
					artist_id: 3,
					album_id: 1,
					genre_id: 1,
				},
				{
					id: 4,
					song_name: "今天只做一件事",
					song_url:
						"https://thesoundwave.s3-us-west-1.amazonaws.com/h3m/%E9%99%B3%E5%A5%95%E8%BF%85+-+%E4%BB%8A%E5%A4%A9%E5%8F%AA%E5%81%9A%E4%B8%80%E4%BB%B6%E4%BA%8B.mp3",
					artist_id: 3,
					album_id: 1,
					genre_id: 1,
				},
				{
					id: 5,
					song_name: "一個旅人",
					song_url:
						"https://thesoundwave.s3-us-west-1.amazonaws.com/h3m/05.%E4%B8%80%E5%80%8B%E6%97%85%E4%BA%BA.mp3",
					artist_id: 3,
					album_id: 1,
					genre_id: 1,
				},
				{
					id: 6,
					song_name: "七百年後",
					song_url:
						"https://thesoundwave.s3-us-west-1.amazonaws.com/h3m/Eason+Chan+%E9%99%B3%E5%A5%95%E8%BF%85+%E4%B8%83%E7%99%BE%E5%B9%B4%E5%BE%8C+MV.mp3",
					artist_id: 3,
					album_id: 1,
					genre_id: 1,
				},
				{
					id: 7,
					song_name: "Life Goes On",
					song_url:
						"https://thesoundwave.s3-us-west-1.amazonaws.com/h3m/Life+Goes+On+by+Eason+Chan.mp3",
					artist_id: 3,
					album_id: 1,
					genre_id: 1,
				},
				{
					id: 8,
					song_name: "太陽照常升起",
					song_url:
						"https://thesoundwave.s3-us-west-1.amazonaws.com/h3m/%E9%99%B3%E5%A5%95%E8%BF%85+-+%E5%A4%AA%E9%99%BD%E7%85%A7%E5%B8%B8%E5%8D%87%E8%B5%B7.mp3",
					artist_id: 3,
					album_id: 1,
					genre_id: 1,
				},
				{
					id: 9,
					song_name: "不來也不去",
					song_url:
						"https://thesoundwave.s3-us-west-1.amazonaws.com/h3m/%E4%B8%8D%E4%BE%86%E4%B9%9F%E4%B8%8D%E5%8E%BB.mp3",
					artist_id: 3,
					album_id: 1,
					genre_id: 1,
				},
				{
					id: 10,
					song_name: "沙龍",
					song_url:
						"https://thesoundwave.s3-us-west-1.amazonaws.com/h3m/Eason+%E9%99%B3%E5%A5%95%E8%BF%85+%E6%B2%99%E9%BE%8D+MV.mp3",
					artist_id: 3,
					album_id: 1,
					genre_id: 1,
				},
			]);
		});
};
