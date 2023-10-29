
const OpenAI = require('openai')
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const path = require('path');
const app = express();
const port = 443;


app.set('views', path.join(__dirname, 'views'))
app.use(bodyParser.urlencoded({ extended: true }));


app.use(express.json())
app.use(express.static(__dirname + '/views'));
app.set('view engine', 'ejs');


const sessionConfig = {
  secret: 'thisshouldbeabettersecret!',
  resave: false,
  saveUninitialized: true,
  cookie: {
      httpOnly: true,
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
      maxAge: 1000 * 60 * 60 * 24 * 7
  }
}

app.use(session(sessionConfig))


const openai = new OpenAI({
    apiKey: "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" 
  });

app.use(bodyParser.json());
app.use(cors());



app.get('/', function (req, res) {
    res.render('app', { message: '', answer: '' });
})


app.post('/', async (req, res) => {
    const { message } = req.body;
    const response = await openai.completions.create({
        model: "text-davinci-003",
        prompt: `You are a motivational coach. You are like a military sergeant and don't accept excuses. Answer without sounding too gentle. Be highly direct. 
        AI: What is the problem? 
        User: I need some motivation
        AI: You need to overcome your distractions and focus. Don't give up on yourself. You are your own superhero
        User: ${message}?
        AI:`,
        max_tokens: 100,
        temperature: 0,
    });
    const answer = response.choices[0].text;

    res.render('app', { message, answer });

});



app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
