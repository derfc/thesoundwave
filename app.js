const express = require('express');
const handlebars = require('express-handlebars');

const app = express();

//handlebars
app.engine("handlebars", handlebars({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//static files
app.use(express.static("public"));

//home route

app.get('/', (req, res) => {
    res.render('login')
})



app.listen(3000, () => {
    console.log('app listening on port 3000')

})
