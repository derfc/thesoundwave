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
				{
					id: 11,
					song_name: "原來只要共你活一天",
					song_url:
						"https://thesoundwave.s3-us-west-1.amazonaws.com/%E4%B8%8D%E8%80%81%E7%9A%84%E5%82%B3%E8%AA%AA/%E5%BC%B5%E5%AD%B8%E5%8F%8B+%E5%8E%9F%E4%BE%86%E5%8F%AA%E8%A6%81%E5%85%B1%E4%BD%A0%E6%B4%BB%E4%B8%80%E5%A4%A9+(%E9%AB%98%E6%B8%85%E9%9F%B3).mp3",
					artist_id: 4,
					album_id: 2,
					genre_id: 1,
				},
				{
					id: 12,
					song_name: "不老的傳說",
					song_url:
						"https://thesoundwave.s3-us-west-1.amazonaws.com/%E4%B8%8D%E8%80%81%E7%9A%84%E5%82%B3%E8%AA%AA/%E5%BC%B5%E5%AD%B8%E5%8F%8B(Jacky+Cheung)+-+%E4%B8%8D%E8%80%81%E7%9A%84%E5%82%B3%E8%AA%AA.mp3",
					artist_id: 4,
					album_id: 2,
					genre_id: 1,
				},
				{
					id: 13,
					song_name: "怎麼捨得你",
					song_url:
						"https://thesoundwave.s3-us-west-1.amazonaws.com/%E4%B8%8D%E8%80%81%E7%9A%84%E5%82%B3%E8%AA%AA/%E5%BC%B5%E5%AD%B8%E5%8F%8B+%E6%80%8E%E9%BA%BC%E6%8D%A8%E5%BE%97%E4%BD%A0+(%E9%AB%98%E6%B8%85%E9%9F%B3).mp3",
					artist_id: 4,
					album_id: 2,
					genre_id: 1,
				},
				{
					id: 14,
					song_name: "愛是永恒 ",
					song_url:
						"https://thesoundwave.s3-us-west-1.amazonaws.com/%E4%B8%8D%E8%80%81%E7%9A%84%E5%82%B3%E8%AA%AA/%E5%BC%B5%E5%AD%B8%E5%8F%8B+%E6%84%9B%E6%98%AF%E6%B0%B8%E6%81%92+(%E9%AB%98%E6%B8%85%E9%9F%B3).mp3",
					artist_id: 4,
					album_id: 2,
					genre_id: 1,
				},
				{
					id: 15,
					song_name: "給金鐘地鐵站車廂內的人",
					song_url:
						"https://thesoundwave.s3-us-west-1.amazonaws.com/%E9%A6%99%E6%B8%AF%E6%98%AF%E5%80%8B%E5%A4%A7%E5%95%86%E5%A0%B4/My+little+airport+-+%E7%B5%A6%E9%87%91%E9%90%98%E5%9C%B0%E9%90%B5%E7%AB%99%E8%BB%8A%E5%BB%82%E5%85%A7%E7%9A%84%E4%BA%BA.mp3",
					artist_id: 5,
					album_id: 3,
					genre_id: 1,
				},
				{
					id: 16,
					song_name: "九龍公園游泳池",
					song_url:
						"https://thesoundwave.s3-us-west-1.amazonaws.com/%E9%A6%99%E6%B8%AF%E6%98%AF%E5%80%8B%E5%A4%A7%E5%95%86%E5%A0%B4/my+little+airport+-+%E4%B9%9D%E9%BE%8D%E5%85%AC%E5%9C%92%E6%B8%B8%E6%B3%B3%E6%B1%A0.mp3",
					artist_id: 5,
					album_id: 3,
					genre_id: 1,
				},
				{
					id: 17,
					song_name: "你是浪子別泊岸",
					song_url:
						"https://thesoundwave.s3-us-west-1.amazonaws.com/%E9%A6%99%E6%B8%AF%E6%98%AF%E5%80%8B%E5%A4%A7%E5%95%86%E5%A0%B4/my+little+airport+-+%E4%BD%A0%E6%98%AF%E6%B5%AA%E5%AD%90%E5%88%A5%E6%B3%8A%E5%B2%B8.mp3",
					artist_id: 5,
					album_id: 3,
					genre_id: 1,
				},
				{
					id: 18,
					song_name: "西西弗斯之歌",
					song_url:
						"https://thesoundwave.s3-us-west-1.amazonaws.com/%E9%A6%99%E6%B8%AF%E6%98%AF%E5%80%8B%E5%A4%A7%E5%95%86%E5%A0%B4/my+little+airport+-+%E8%A5%BF%E8%A5%BF%E5%BC%97%E6%96%AF%E4%B9%8B%E6%AD%8C.mp3",
					artist_id: 5,
					album_id: 3,
					genre_id: 1,
				},
			]);
		});
};
