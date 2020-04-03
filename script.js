const API = 'https://raw.githubusercontent.com/Vogusov/users_API/master/',
  user_ids = [101, 102, 103, 104, 105];

let users = [];



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
        user.unique_locations = [... new Set(user.all_locations)] ;
        return user;
      })
    //Собираем массив со всеми пользователями:
      .then(user => {
        console.log(`data of user ${i}: `, user);
        users.push(user);
      })
      .catch(err => console.log(err))
  })
  return users;
 }



// init
function init() {

  getUsersData(user_ids);
  console.log('1');




}