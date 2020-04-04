const API = 'https://raw.githubusercontent.com/Vogusov/users_API/master/',
      user_ids = [101, 102, 103, 104, 105],
      button = document.getElementById('button'),
      result = document.getElementById('result');

let users = [];
let allUniqueUsersLocations = [];



async function getResourse(url) {
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Could not fetch ${url}, status: ${res.status}`)
  }
  return await res.json();
}



function getUsersData(arr) {
  arr.forEach((id, i) => {
    getResourse(API + `user_${id}.json`)
    //собираем массив со всеми локациями каждого пользователя:
      .then(user => {
        user.all_locations = [];
        user.posts.forEach(post => {
          user.all_locations.push(post.location);
        })
        return user;
      })      
    //делаем массив с уникальными локациями каждого пользователя:
      .then(user => {
        user.unique_locations = [... new Set(user.all_locations)];
        return user;
      })
    //Собираем массив со всеми пользователями:
      .then(user => {
        console.log(`data of user ${i}: `, user);
        users.push(user);
        return users;
      })
    
      .catch(err => console.log(err))
  })
  return users;
 }




 function getAllUniqueUsersLocations() {

  users.forEach(user => {
    allUniqueUsersLocations.push(user.unique_locations);
  });
  allUniqueUsersLocations = [... new Set( [].concat(...allUniqueUsersLocations)) ];
  console.log('allUniqueUsersLocations: ', allUniqueUsersLocations);
  return allUniqueUsersLocations;
  
}



function getResultList() {
  let resultList = new Object();

  allUniqueUsersLocations.forEach(loc => {
    resultList[loc] = [];

    users.forEach(user => {
      user.unique_locations.forEach(uniqueLoc => {
        if (uniqueLoc === loc) {
          resultList[loc].push(user.user_name);
        }
      });        
    });
  });

  console.log('resultList', resultList);
}



function doIt() {

  getAllUniqueUsersLocations();

  getResultList();

  

  
}



// init
function init() {

  button.addEventListener('click', doIt)

  getUsersData(user_ids);
  console.log('1');
}