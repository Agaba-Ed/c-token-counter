const parser=require('node-c-parser');
const express=require('express');
const bodyParser=require('body-parser');
const fs=require('fs');
var port=process.env.PORT || 3000;

var app=express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.listen(port,function(err){
    if(err){
        console.log(err);}
    else
        console.log('server is running at port '+port); 
});


//serving static files
app.use(express.static(__dirname+'/public'));

//handling post requests
app.post( '/analyse',(request,response)=>{
    const data=request.body;
    fs.writeFile(__dirname+'/ed.c',data.codeText,err=>{
        if(err){
            console.log('error');
        }
        else{
            console.log('File uploaded to server successfully');
        }
    });
    parser.lexer.cppUnit.clearPreprocessors(
        "./ed.c",(err,codeText)=>{
            if(err){
                console.log(err);
            }
            else{
                var tokens = parser.lexer.lexUnit.tokenize(codeText);
                var dataToSend={
                    "tokens":tokens
                }
                response.send(dataToSend);

            }
        }
    );
});






