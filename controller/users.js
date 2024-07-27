const User=require("../models/user");

module.exports.signUp=async(req,res)=>
        {
            try{
                let {username,email,password}=req.body;
                const newuser=new User({email,username}); 
                const registerduser=await User.register(newuser,password);
                console.log(registerduser);
                req.login(registerduser,(err)=>{
                    if (err){
                        return next(err);
                    }
                    req.flash("success","Welcome to Shubh Yatra");
                res.redirect("/listings"); 
                })
                
            }
    catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }}

module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","You are logged out!");
        res.redirect("/listings");
    })
}

