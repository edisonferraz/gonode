const express = require('express')
const nunjucks = require('nunjucks')
const {
  verifyAgeGreaterThan18
} = require('./middlewares/verifyAgeGreaterThan18')

const app = express()

nunjucks.configure('views', {
  autoescape: true,
  express: app,
  watch: true
})

app.use(express.urlencoded({ extended: false }))
app.set('view engine', 'njk')

app.get('/', (req, res) => {
  const { age } = req.query
  if (age) return res.render('home', { age })
  return res.render('home')
})

app.post('/check', (req, res) => {
  const { age } = req.body
  if (age < 18) return res.redirect(`minor?age=${age}`)
  return res.redirect(`major?age=${age}`)
})

app.get('/minor', verifyAgeGreaterThan18, (req, res) =>
  res.render('minor', { age: req.query.age })
)

app.get('/major', verifyAgeGreaterThan18, (req, res) =>
  res.render('major', { age: req.query.age })
)

app.listen(3000)
