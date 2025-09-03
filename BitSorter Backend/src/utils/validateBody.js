const validator = require('validator');
//validating whether the body data includes email,password and firstName of User.....
const validateBody = (body)=>{
    const mandatoryFields = ['email','password','firstName'];
    isPresent = mandatoryFields.every((k)=>Object.keys(body).includes(k));
    
    if(!isPresent){
        throw new Error("Required Fields are missing!");
    }

    //validating the email,password...
     if(!validator.isEmail(body.email)){
            throw new Error("Not a valid Email!");
     }
    //  if(!validator.isStrongPassword(body.password)){
    //         throw new Error("Not a strong PassWord!");
    //  }
}
module.exports = validateBody;