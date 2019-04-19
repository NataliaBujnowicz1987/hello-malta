var express = require("express"); // This line calls the express framework to action.

var app = express(); // Invoke the express package into action from here.

// Here we call the sql middleware to action
var mysql = require("mysql");

// Set default view engine (we can save .html file as .ejs)
app.set("view engine", "ejs")

// Common use for the File System module: method is used to read files.
var fs= require('fs');

//// we needs it to handle HTTP POST. This module parses the JSON, buffer, string and URL encoded data submitted using HTTP POST request
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended:true}));

// Here we call the FileUpload middleware 
const fileUpload = require('express-fileupload');
app.use(fileUpload());

// This line declares the content of the contact.json file as a variable called contact 
var contact = require("./model/contact.json")

// Here we call the access to the views folder and allow content to be rendered
app.use(express.static("views"));
// Here we call the access to the styles folder with CSS and allow content to be rendered
app.use(express.static("styles"));
// Here we call the access to the script folder and allow content to be rendered
app.use(express.static("script"));
// Here we call the access to the images folder and allow content to be rendered
app.use(express.static("images"));


// ############################################################################
// ------------------- Connectivity to sql database ---------------------------
// ############################################################################

// Details for gear host database account
//const db = mysql.createConnection ({
//    host: '',
//    user: '',
//    password: '',
//    database: ''
//});


// Informations about the connection status
//db.connect((err) => {
//    if(err) {
//        console.log("The connection failed...Please add details for gearhost database account")
 //   }
//    else {
 //       console.log("Connection is ok!")
//    }
//});


// ############################################################################
// ---------------------- ALL ROUTES TO DIFFERENT PAGES -----------------------
// ############################################################################

// Root page (in this case, it is an index page)
app.get('/', function(req, res){ // This line will call a get request on the '/' url of our application
    res.render("index")
    console.log("The new user visited HOME page")  // This line adds a comment about the new login to my app, that will be displayed in the terminal
});

app.get('/showallmalta', function(req, res){ 
    res.render("showallmalta")
    console.log("The new user visited MALTA page") 
});

app.get('/tips', function(req, res){ 
    res.render("tips")
    console.log("The new user visited TIPS page") 
});

app.get('/contact', function(req, res){ 
    res.render("contact", {contact})
    console.log("The new user visited CONTACT page") 
});

app.get('/about', function(req, res){ 
    res.render("about")
    console.log("The new user visited ABOUT page") 
});


// ########################################################################################################################################################
// -------------------------------------------------------------------  SQL DATABASE  ---------------------------------------------------------------------
// ########################################################################################################################################################                                       
                                                            

// ====================================================================  MALTA PAGE  ======================================================================

// Route to create a database table

//app.get('/createtable', function (req, res) {
//  let sql = "CREATE TABLE maltaX (Id int NOT NULL AUTO_INCREMENT PRIMARY KEY, Place varchar(255) NOT NULL, Description text(2555) NOT NULL, Activity varchar(255), Image varchar(255), Name varchar(255) NOT NULL, Date varchar(255) NOT NULL);"
//  let query = db.query(sql, (err, res) => {
//      if(err) throw err;  //jezeli pojawi sie error to go wyrzuc/usun
//  });
//      res.send("SQL worked - you created new table called maltax");
//});


// Route to add a new place with description     
app.get('/inserttable', function (req, res) {
    let sql = 'INSERT INTO maltaX (Place, Description, Activity, Image, Name, Date) VALUES ("Valetta", "here will be description of valetta", "walking", "malta1.jpg", "Luna", "16/06/2017")'
    let query = db.query(sql, (err, res) => {
        if(err) throw err; 
    });
        res.send("New values in the maltax table.");
});   
 
 
// Route to show all places from database
app.get('/placesmalta', function (req, res) {
    let sql = 'SELECT * FROM maltaX'
    let query = db.query(sql, (err, res1) => {
        if(err) throw err; 
        res.render('showallmalta', {res1})
    });
});  
 

// Route to delete a place from database
app.get('/deletesql/:id', function (req, res) {
    let sql = 'DELETE FROM maltaX WHERE Id='+req.params.id+'';
    let query = db.query(sql, (err, res1) => {
        if(err) throw err;  
    });
        res.redirect('/placesmalta');
        console.log("Post in malta page was delete.");
});  
 
 
// Route to render 'addnewplace' page
app.get('/addnewplace', function(req,res){
    res.render('addnewplace')
});
 
 
// Route to post a new place in Malta
app.post('/addnewplace', function (req, res) {
     
    // Upload image
    if (!req.files)
    return res.status(400).send('To add a new post you have to upload a photo.');
     
    // The name of the input field (here imageFile) is used to retrieve the uploaded file
    let imageFile = req.files.imageFile;
    filename = imageFile.name;
    // I used the mv() method to place the file on the server - here in images folder
    imageFile.mv('./images/' + filename, function(err) {
        if (err)
            return res.status(500).send(err);
    console.log("New image was upladed " + req.files.imageFile)
    });
     
     
    let sql = 'INSERT INTO maltaX (Place, Description, Activity, Image, Name, Date) VALUES ("'+req.body.place+'", "'+req.body.description+'", "'+req.body.activity+'", "'+filename+'", "'+req.body.name+'", "'+req.body.date+'")'
    let query = db.query(sql, (err, res) => {
        if(err) throw err;  
    });
    
    res.redirect("/placesmalta");
    console.log("New post in Malta Page");
}); 
 
 
// Route to edit sql data
app.get('/editmalta/:id', function (req, res) {
    let sql = 'SELECT * FROM maltaX WHERE Id = "'+req.params.id+'" '
    let query = db.query(sql, (err, res1) =>  {
        if(err) throw err;
        
        console.log(res1);
        res.render('editmalta', {res1});
    });
});
 

// Cannot POST /editsql - if we have this message, we need to add a new route in app.js
// Post request url to edit product with sql
app.post ('/editmalta/:id', function (req, res) {
    let sql = 'UPDATE maltaX SET Place = "'+req.body.place+'", Description = "'+req.body.description+'", Activity = "'+req.body.activity+'", Name = "'+req.body.name+'", Date = "'+req.body.date+'" WHERE Id= "'+req.params.id+'"'
    let query = db.query(sql, (err, res) => {
         if(err) throw err;  
    });
    
    res.redirect("/placesmalta");
    console.log("The post in malta page was update.");
});


// Route to show indiviual place in malta page
app.get('/show1malta/:id', function (req, res) {
    let sql = 'SELECT * FROM maltaX WHERE Id = '+req.params.id+' ';
    let query = db.query(sql, (err, res1) => {
        if(err) throw err; 
        res.render('show1malta', {res1})
    });
});  
 
 
 
// ==================================================================  TIPS PAGE  ===============================================================================

// Route to create a database table
//app.get('/createtable2', function (req, res) {
//  let sql = "CREATE TABLE tips (Id int NOT NULL AUTO_INCREMENT PRIMARY KEY, About varchar(255) NOT NULL, Place varchar(255) NOT NULL, Tip text(2555) NOT NULL, Name varchar(255) NOT NULL, Date varchar(255) NOT NULL);"
//  let query = db.query(sql, (err, res) => {
//      if(err) throw err;
//  });
//      console.log("created new table called tips");
//      res.send("SQL worked - you created new table called tips");
//  });


// Route to add a new place with description     
app.get('/inserttable2', function (req, res) {
    let sql = 'INSERT INTO tips (About, Place, Tip, Name, Date) VALUES ("Public Transport", "Malta", "Public transport is the cheapest way to get around Malta is by bus, unfortunately in the season (May-October) the timetable is practically non-existent. Buses at rush hour are delayed and crowded and somethimes you can spend 2-3h on the bus passing less than 10km (known from autopsy)", "Anna", "20/06/2018")'
    let query = db.query(sql, (err, res) => {
        if(err) throw err; 
    });
        console.log("New values in the tips table.");
        res.send("New values in the tips table.");
});   


// Route to show all tips from database
app.get('/alltips', function (req, res) {
    let sql = 'SELECT * FROM tips'
    let query = db.query(sql, (err, res1) => {
        if(err) throw err; 
        res.render('tips', {res1})
    });
});  
 
 
// Route to delete a place from database
app.get('/deletetip/:id', function (req, res) {
    let sql = 'DELETE FROM tips WHERE Id='+req.params.id+'';
    let query = db.query(sql, (err, res1) => {
        if(err) throw err;  
    });
        res.redirect('/alltips');
        console.log("Tip was delete.");
});  
 
 
// Route to render create 'add new tip' page
app.get('/addnewtip', function(req,res){
    res.render('addnewtip')
});
 
 
// Route to post a new tip
app.post('/addnewtip', function (req, res) {
    let sql = 'INSERT INTO tips (About, Place, Tip, Name, Date) VALUES ("'+req.body.about+'", "'+req.body.place+'", "'+req.body.tip+'", "'+req.body.name+'", "'+req.body.date+'")'
    let query = db.query(sql, (err, res) => {
        if(err) throw err;  
    });
        res.redirect("/alltips");
        console.log("New tip was add.");
}); 
 
 
// Route to edit sql data with tips
app.get('/edittips/:id', function (req, res) {
    let sql = 'SELECT * FROM tips WHERE Id = "'+req.params.id+'" '
    let query = db.query(sql, (err, res1) =>  {
        if(err) throw err;
        console.log(res1);
        
        res.render('edittips', {res1});
    });
});


// Post request url to edit product with sql
app.post ('/edittips/:id', function (req, res) {
    let sql = 'UPDATE tips SET About = "'+req.body.about+'", Place = "'+req.body.place+'", Tip = "'+req.body.tip+'", Name = "'+req.body.name+'", Date = "'+req.body.date+'" WHERE Id= "'+req.params.id+'"'
    let query = db.query(sql, (err, res) => {
         if(err) throw err;  
    });
    
    res.redirect("/alltips");
    console.log("Tip page was update.");
});


 
// ########################################################################################################################################################
// -------------------------------------------------------------  SQL DATABASE END  ----------------------------------------------------------------------
// ########################################################################################################################################################


// ########################################################################################################################################################
// ----------------------------------------------------------------  JSON DATABASE  -----------------------------------------------------------------------
// ########################################################################################################################################################

// -----FUNCTION TO ADD A NEW CONTACT FORM ---------
app.post('/contact', function(req, res){
    
    //Write a function to find the max id in my JSON file.
    function getMax(contact, id) {
        var max
        for (var i=0; i<contact.length; i++) {
            if(!max || parseInt(contact[i][id]) > parseInt(max[id]))
            max = contact[i];
        }
        return max;
    }
    
    // Call the getMax function and pass some information to it
    // When the function runs we need to get the answer back and store it as a variable
    var maxCid = getMax(contact, "id")
    
    var newId = maxCid.id + 1; //make a new variable for id which is 1 larger than the current max
    
    console.log("Received a new message with Id number: " + newId) //console.log daje nam info w terminalu jaki blad gdzies wystepuje, np w lini 12 masz zle to i to
    var json = JSON.stringify(contact) // we tell the application to get our JSON ready to modify
    
    // now we will create a new JSON object
    var contactsx = {
        
        firstname: req.body.firstname,
        phone: req.body.phone,
        id: newId, 
        email: req.body.email,
        message: req.body.message
    }
    
    // Now we push the data back to the JSON file
    
    fs.readFile('./model/contact.json', 'utf8', function readfileCallback(err){
        if(err){
            throw(err)
        } else {
            contact.push(contactsx) // add the new contact to the JSON file
            json = JSON.stringify(contact, null, 4)  //struture the new data nicely in the JSON file (in 4 line)
            fs.writeFile('./model/contact.json', json, 'utf8')
        }
    })
    
    res.redirect('/contact')
});



// ----- FUNCTION TO DELETE CONTACT DETAILS ---------

app.get('/deletecontact/:id', function(req, res) {
    
    var json = JSON.stringify(contact);
    // Get the id we want to delete from the url parameter
    var keyToFind = parseInt(req.params.id);
    
    var data = contact // Declare the JSON file as a variable called data
    
    //lets map the data and find the information we need
    
    var index = data.map(function(contact){return contact.id;}).indexOf(keyToFind)
    
    // JavaScript allows us to splice our JSON data
    
    contact.splice(index, 1); // Delete only 1 item from the position of the index variable above

        json = JSON.stringify(contact, null, 4)  //struture the new data nicely in the JSON file (in 4 line)
        fs.writeFile('./model/contact.json', json, 'utf8')
        
    console.log("Contact details was delete.")
    res.redirect('/contact')
    
});

// ----- FUNCTION TO EDIT A CONTACT DETAILS ---------

app.get('/editcontact/:id', function(req, res) { //function req res invoke this function
    
    function chooseContact(indOne) {
        return indOne.id === parseInt(req.params.id)  // parseInt(req.params.id) -jest to wazne !!! wyjasnij w dokumentacji
    } 
    
    var indOne = contact.filter(chooseContact)
    res.render('editcontact', {res:indOne});
});


//Here we will save all changes in JSON file
app.post('/editcontact/:id', function(req,res) {
    
    var json = JSON.stringify(contact); // We modify this file
    
    var keyToFind = parseInt(req.params.id); // Find the data we need to edit
    var data = contact // Declare the JSON file as a variable called data
    var index = data.map(function(contact){return contact.id;}).indexOf(keyToFind)   //lets map the data and find the information we need
    
   
   // We want to change only 1 comment
    contact.splice(index, 1, {
        firstname: req.body.firstname, 
        phone: req.body.phone,
        id: parseInt(req.params.id),
        email: req.body.email,
        message: req.body.message
        
    }); 
    
    json = JSON.stringify(contact, null, 4);
    fs.writeFile('./model/contact.json', json, 'utf8')
    
    res.redirect("/contact");
    console.log("Contact details was update")
 
});

// #########################################################################################################################################################
// ---------------------------------------------------------------- JSON DATABASE END-----------------------------------------------------------------------
// #########################################################################################################################################################




// ---------------------------- SEARCH BAR -----------------------------------

// Post request url to search database and use an existing page (malta) to display results.
app.post('/search', function (req, res) {
    let sql = 'SELECT * FROM maltaX WHERE Place LIKE "%'+req.body.search+'%" OR  Activity LIKE "%'+req.body.search+'%" OR Description LIKE "%'+req.body.search+'%" ';
    let query = db.query(sql, (err, res1) => {
         if(err) throw err;  
        res.render('showallmalta', {res1})
    });
});  




// #########################################################################################################################################################
// ------------------------------------------------------------ the way of launching the application  --------------------------------------------------- 
// #########################################################################################################################################################

app.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function() {
   
   console.log("The application works correctly") 
    
});