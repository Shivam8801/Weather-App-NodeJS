const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');

 
const app = express();
const port = process.env.PORT || 3000;
const apiKey = '<YOUR_OPENWEATHER_API_KEY>';

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs')




app.get('/', function (req, res) {
    res.render('weather', { weather: null, error: null });
})

app.post('/', function (req, res) {

    var city = req.body.city;
    var url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;

    request(url, function (err, response, body) {
        if (err) {
            res.render('weather', { weather: null, error: 'Enter Valid City Name..' });
        } else {
            let weather = JSON.parse(body)
            if (weather.main == undefined) {
                res.render('weather', { weather: null, error: 'Enter Valid City Name..' });

            } else {
                var temp = (weather.main.temp - 32) * (5 / 9);
                // let weatherText = `It's ${temp.toFixed(2)} degrees in ${weather.name}!`;
                let weatherText = `${temp.toFixed(2)}`;
                let desc = `${weather.weather[0].description}`;
                let location = `${weather.name}`;

                const monthNames = ["January", "February", "March", "April", "May", "June",
                    "July", "August", "September", "October", "November", "December"];
                const dateObj = new Date();
                const month = monthNames[dateObj.getMonth()];
                const day = String(dateObj.getDate()).padStart(2, '0');
                const year = dateObj.getFullYear();
                let datetoday = `${month + '\n' + day + ', ' + year}`;
                let icon_id = `${weather.weather[0].icon}`;
                let icon = `https://openweathermap.org/img/w/${icon_id}.png`;

                res.render('weather', { weather: weatherText, weatherdesc: desc, locationname: location, dt: datetoday, wicon: icon, error: null });
            }
        }
    });
})

app.listen(port);


