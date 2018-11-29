const verifyAgeGreaterThan18 = (req, res, next) => {
  const { age } = req.query

  if (!age) {
    return res.redirect(`/?age=null`)
  }

  return next()
}

module.exports = {
  verifyAgeGreaterThan18
}
