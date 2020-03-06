
const fs = require('fs'); //writing buffer into a file

const path = require('path');

function uploadFile(file){
     console.log('file ===',file)
     return new Promise((resolve,reject)=>{
      let user_image_path = path.join(__dirname, "../","uploads");
       const image_name = Date.now() + "_" + file.image.name;
       console.log('image path',image_name)
       fs.writeFile(`${user_image_path}/${image_name}`,file.image.data, (err) =>{
         if (err) {
           reject(err)
         };
         resolve({image_name})
          
       });
     })
  }

  module.exports = uploadFile;