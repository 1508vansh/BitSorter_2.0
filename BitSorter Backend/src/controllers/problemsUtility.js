const axios = require('axios');

//for submitting the batch...
const submitBatch = async(submissions)=>{
const options = {
  method: 'POST',
  url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
  params: {
    base64_encoded: 'false'
  },
  headers: {
    'x-rapidapi-key': '2d0e2319c9msh6421f7c7bffa241p188559jsn45419c4e385b',
    'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
    'Content-Type': 'application/json'
  },
  data: {
    submissions,
  }
};

async function fetchData() {
	try {
		const response = await axios.request(options);
    //console.log("Posted judge0 data is: ",response.data);
		return response.data;
	} catch (error) {
		console.error(error);
	}
}
const data = await fetchData();
return data;
}
const waiting = (timer) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(); // No value needed unless you want to return something
    }, timer);
  });
};


//for getting the responses of tokens...
const submitTokens = async(tokens)=>{

  const tokenString = tokens?.join(',');
const options = {
  method: 'GET',
  url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
  params: {
    tokens: tokenString,
    base64_encoded: 'false',
    fields: '*'
  },
  headers: {
    'x-rapidapi-key': '2d0e2319c9msh6421f7c7bffa241p188559jsn45419c4e385b',
    //'x-rapidapi-key':'b7055c95acmsh34946e84e4e6f61p1448adjsn7ebce46cd253',
    'x-rapidapi-host': 'judge0-ce.p.rapidapi.com'
  }
};

async function fetchData() {
	try {
		const response = await axios.request(options);
    //console.log("Posted judge0 token data is: ",response.data);
		return response.data;
	} catch (error) {
		console.error(error);
	}
}
 
  while(true){
   const resultObtained = await fetchData();

   const isDone = resultObtained?.submissions?.every((obj)=>obj.status_id>=3);
   if(isDone){
    return resultObtained.submissions;
   }
   await waiting(1000);
  }
}


module.exports = {submitBatch,submitTokens};