//test call jobBoss API
//get
const userAction = async () => {
    const response = await fetch('http://example.com/movies.json');
    const myJson = await response.json(); 
    console.log("myJson", myJson);
  }
//post
  const userAction2 = async () => {
    const response = await fetch('http://example.com/movies.json', {
      method: 'POST',
      body: myBody, // string or object
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const myJson = await response.json();
    console.log("myJson", myJson);
  }
//
const axios = require('axios');

axios.get('/user?ID=12345')
  .then(function (response) {
    // handle success
    console.log(response);
  });
//
  let postData ={key: "some value"}

    axios.get(url).then(response =>{
    //Do stuff with the response.
    })
        
    axios.post(url, postData).then(response=>{
    //Do stuff with the response.
    });