const passport = require('passport')
const bcrypt = require('bcrypt')
const LocalStrategy = require('passport-local').Strategy
const Models = require('../../../../models')


passport.serializeUser((user, done)=>{
    done(null, user)
})

passport.use(
    new LocalStrategy({usernameField: 'email', passwordField: 'password', session: true, passReqToCallback: true}, async(req, email, password, done) =>{
        try{
                const exUser = await Models.User.findOne({where: {email}})


                const sessUser = await Models.User.findOne({
                    where: {email},
                    attributes: {
                        exclude: [
                            'password',
                            'provider',
                            'snsId',
                            'createdAt',
                            'updatedAt',
                            'deletedAt'
                        ]
                    }
                })

                if(exUser){
                    const result = await bcrypt.compare(password, exUser.password)
                    if(result){
                        done(null, sessUser.dataValues)
                        
                    }else{
                        done(null, false, {message: 1})
                    }
                }else{
                    done(null, false, {message: 2})
                }
        }catch(err){
            console.error(err)
        }
    })
)



module.exports = passport

