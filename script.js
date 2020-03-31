const API = 'https://raw.githubusercontent.com/Vogusov/users_API/master/',
      user_ids = [101, 102, 103, 104, 105];

let users_data = [];



async function getResourse(url) {
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Could not fetch ${url}, status: ${res.status}`)
  }
  return await res.json();
}



function getUsersData(arr) {
  arr.forEach((id) => {
    getResourse(API + `user_${id}.json`)
      .then(data => {
          console.dir(data);
          users_data.push(data);
        })  
      .catch(err => console.log(err))
  })
}



function init() {

  getUsersData(user_ids);
  
  

}

