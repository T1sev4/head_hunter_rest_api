const Apply = require('./Apply')
const Resume = require('../resume/models/Resume')
const validateApply = (req, res, next) => {
  let errors = {};

  if(!req.body.resumeId || req.body.resumeId.length === 0){
    errors.resumeId = "Поле resume обязательно"
  }
  if(!req.body.vacancyId || req.body.vacancyId.length === 0){
    errors.vacancyId = "Поле vacancy обязательно"
  }

  if(JSON.stringify(errors) !== JSON.stringify({})) res.status(400).send(errors)
  else next()
}

const isAuthorOfApply = async (req, res, next) => {
  try{
    const id = req.params.id

    const apply = await Apply.findByPk(id)

    if (!apply) res.status(400).send({message: "apply with that id is not exist"})
    else {
      const resumes = await Resume.findAll({
        where: {
          userId: req.user.id
        }
      })

      const ids = resumes.map(item => item.id)
      if(ids.includes(apply.resumeId * 1)){
        next();
      }else{
        res.status(403).send({message: "Access Forbidden"})
      }
    }
  } catch (error) {
    res.status(500).send(error)
  }
}
const isApplyExist = async (req, res, next) => {
  try{
    const apply = await Apply.findByPk(req.body.applyId)
    if(!apply) res.status(400).send({message: "apply with that id is not exist"})

    req.body.id = apply.vacancyId
    next()
  } catch (error) {
    res.status(500).send(error)
  }
}

module.exports = {
  validateApply,
  isAuthorOfApply,
  isApplyExist
}