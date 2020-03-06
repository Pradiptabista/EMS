function writeFile(){
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            resolve('File uploaded successfuly')
        },5000)
    })
}

writeFile().then(res=>{
    console.log(res);
    console.log('after=')
});
