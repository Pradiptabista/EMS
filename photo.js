const express = require('express');
// const fileUpload = require('../lib/index');
const app = express();
const fs = require('fs'); //writing buffer iinto a file
const fileUpload = require('express-fileupload');
const PORT = 3040;
app.use('/form', express.static(__dirname + '/index.html'));
const path = require('path');
let con = require('./dbconnection');
// default options
app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
  }));
  app.use(express.static(path.join(__dirname, "/")))
app.get('/ping', function(req, res) {
  res.send('pong');
});

app.post('/upload/image', function(req, res) {
    console.log('Image upload',req.files)

let user_image_path = path.join(__dirname, "./","uploads");
console.log("this",req.files.image.data )
//file name
const image_name = Date.now() + "_" + req.files.image.name;
//write file in node-js

// fs.writeFile(`${user_image_path}/${image_name}`,req.files.image.data, (err) =>{
//   if (err) throw err;
 
//     console.log('the file has been writeen successfully');
//     res.json({message:"Your image has been sucessfully uploaded"})
// });
});


  

function uploadFile(file){
  console.log('file ===',file)
  return new Promise((resolve,reject)=>{
    let user_image_path = path.join(__dirname, "./","uploads");
    const image_name = Date.now() + "_" + file.image.name;
    console.log('image name',image_name);
    console.log('image path',user_image_path)
    fs.writeFile(`${user_image_path}/${image_name}`,file.image.data, (err) =>{
      if (err) {
        reject(err)
      };
      resolve({image_name})
        
    });
  })
}

app.put('/update/image', async function(req, res) {

  let file = req.files;
  let user_obj = Object.assign(req.body,{image:file});
  console.log('image information',user_obj);
  let upload_result = await uploadFile(user_obj.image);
  console.log('Image uploaded successfully',upload_result)

// fs.writeFile(`${user_image_path}/${image_name}`,req.files.image.data,  (err) =>{
// const body = req.body
  con.query(`update users set image_name= '${upload_result.image_name}' where user_id=${user_obj.id}`,
  (err, rows) => {
      if (err) throw err;
      console.log(rows);
      res.json({message:"Your profile picture has been updated",imagePath:`http://localhost:3040/uploads/${upload_result.image_name}`})

  });
  
})
// });

//to  delete a file

app.delete('/delete/image', function(req, res) {
  //const image.name = req.params.image.name;
fs.unlink(`${user_image_path}/${req.files.image.name}`,req.files.image.data, (err)=> {
  if (err) throw err;
  console.log('Your photo has been sucessfully  deleted!');
  res.json({message:"Your photo has been deleted"})
})
});



app.listen(PORT, () => console.log(`port info ${PORT}!`));