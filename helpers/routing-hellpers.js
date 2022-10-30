
module.exports={
    authTesting:(req,res,route)=>{
        if (req.session.loggeIn){
            res.render(`user/${route}`)
        }else {
        res.redirect("/login");
      }
    },
    routingHelp: (req,res,route)=>{
        if (req.session.loggeIn) {
            res.redirect("/");
          } else {
            res.render(`user/${route}`,{"loginErr":req.session.loginErr});
            req.session.loginErr = false
          }
    },
    checkingAdminAcess: (req,res,route)=>{
      if (req.session.loggeIn) {
          res.redirect("/");
        } else {
          res.render(`user/${route}`,{"loginErr":req.session.loginErr});
          req.session.loginErr = false
        }
  }
}