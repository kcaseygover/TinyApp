let randomStr = generateRandomString();
  urlDatabase[generateRandomString()] = req.body.longURL;
  let userID = req.body.email;
  userID[generateRandomString()] = req.body.longURL;
  urlDatabase[userID[generateRandomString()]] = userID;
  console.log(userID)
  console.log(urlDatabase);




/*function generateRandomString() {
    let randomStr = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 6);
    return randomStr;
};
var userInfo = {
    'x':{
        username: "foo",
        password:'dlji'
    },
    'y':{
        username: "bar" ,
        password:'adfasf'
    },
    'z': {
        username: 'foo',
        password:'d3alj4i'
    }
};

var found = _.select(userInfo, function(node){

    return node.username === "foo"
});
console.dir (found);

var userRandomID = {};
userRandomID["id"] = generateRandomString();
userRandomID["email"] = "email";
userRandomID["password"] = "password";
var users = {};
users[userRandomID] = userRandomID;
users.add(userRandomID);
console.log(users);
console.log(users[email]);
console.log(userRandomID);
//users["id"] = "ranNum()";
//users["email"] = "email";
//users["password"]= "password";
//console.log(users)


let findOne = function(query) {
  for (key in this) {
    let value = this[key].;
      if (value === query) {
      return obj[key];/*res.status(400).send("this email has already been registered");*/
 /*   } else {
    return null;
    }
  };

var dupeEmail = searchEmail(users, req.body.email);
  if (dupeEmail){
    res.redirect(400)
  }
else{
  var randomID = generateRandomString();
  users[randomID] = {id: randomID, email: req.body.email, password: req.body.password};
  res.cookie("user_ID", req.body.email)
  res.redirect(302, '/urls')
}



var myObj = new Object(),
    str = "myString",
    rand = Math.random(),
    obj = new Object();

myObj.type              = "Dot syntax";
myObj["date created"]   = "String with space";
myObj[str]              = "String value";
myObj[rand]             = "Random Number";
myObj[obj]              = "Object";
myObj[""]               = "Even an empty string";

console.log(myObj);*/