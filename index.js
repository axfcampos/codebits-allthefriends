#!/user/bin/env node

var codebits  =   require('codebits');
var prompt    =   require('prompt');
var colors    =   require('colors');
var fs        =   require('fs');

var doge = [
  'wow                                       ', 
  '           such popularity                ', 
  '                          much friendship ', 
  '   amazing                                '];

console.log('\n -- To end your loneliness insert your username and password! -- \n'.bold.green);

prompt.message = "CODEBITS".green;
prompt.delimiter = ':'.bold.green;
prompt.start();

var schema = 
  {
  properties: 
    {
    username: 
      {
      description: 'user_email'.bold.yellow,
      required: true
      },
    password: 
      {
      description: 'password'.bold.yellow,
      hidden: true
      }
}};

var schema_yesno = {
  properties: {
    answer : {
      pattern: /^[y|Y][e|E][s|S]|[n|N][o|O]$/,
      message: 'type yes or no'.bold.yellow,
      required: true,
      description: '(yes/no)'.bold.yellow
    }
  }
};

var addAllFriend = function (){
  codebits.users.listAcceptedUsers( function (err, reply){
    reply.forEach(function(entry){
      codebits.users.addUserAsFriend(entry.id, function (err, reply){
        var r = getRandomInt(0, 3);
        process.stdout.write(doge[r] + '\r   ');
      });
    });
    console.log('\n    \\o/ You are now the most popular person on codebits. Congratulations!  /o/ \n'.bold.magenta);
    console.log('\n  ...adding all the friends...   \n'.bold.green);
  });
}; 


var promptUser = function(_schema) {
  return prompt.get(_schema, function (err, result){
    codebits.auth.logIn(result.username, result.password, function (err, token){
      if(err){
        console.log('**Something went wrong, try again**'.bold.red);
        promptUser(schema);
      }else{
        if(typeof token === 'undefined'){
          console.log('**Login FAILED! Try again**'.bold.red);
          promptUser(schema);
        }else{
          
          var data = fs.readFileSync('./allthethings.txt', "utf8"); 
          console.log(data.bold.yellow);

          prompt.start();
          prompt.get(schema_yesno, function (err, result){
            if(err){
              console.log('**Something went wrong, try again**'.bold.red);
              console.log('\n...leaving :( \n\n'.bold.red);
            }else{
              if(result.answer == 'yes'){
                addAllFriend(); 
              }else{
                console.log('You chose to leave.. goodbye!'.bold.green);
              }
            }
          });
        }
      }
    });
  });
};



promptUser(schema);

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
