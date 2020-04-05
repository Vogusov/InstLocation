const API = 'https://raw.githubusercontent.com/Vogusov/users_API/master/',
  user_ids = [101, 102, 103, 104, 105],
  button = document.getElementById('button'),
  resultBlock = document.getElementById('result_block');

let users = [];
let allUniqueUsersLocations = [];


// запрос
async function getResourse(url) {
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Could not fetch ${url}, status: ${res.status}`)
  }
  return await res.json();
}


// обработка запроса
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
        user.unique_locations = [...new Set(user.all_locations)];
        return user;
      })
      //Собираем массив со всеми пользователями:
      .then(user => {
        console.log(`data of user ${i}: `, user);
        users.push(user);
        return users;
      })
      .catch(err => console.log(err))
  });
  return users;
}



// уникальные локации всех пользователей
function getAllUniqueUsersLocations() {

  users.forEach(user => {
    allUniqueUsersLocations.push(user.unique_locations);
  });
  allUniqueUsersLocations = [...new Set([].concat(...allUniqueUsersLocations))];
  return allUniqueUsersLocations;
}



// Локация: пользователь;
async function getResultList() {

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

  for (let key in resultList) {
    if (resultList[key].length < 2) {
      delete resultList[key];
    }
  }
  console.log('resultList:', resultList);

  return resultList;
}



//рендеринг результата
function renderResult() {

  getResultList()
    .then(res => {
      for (key in res) {
        let arr_names = res[key].join(', ');
        
        let render = `
          <div class="user-block">
            <div class="user-block__name">${key}</div>
            <div class="user-block__locations">${arr_names}</div>
          </div>
        `
      resultBlock.insertAdjacentHTML('beforeend', render);
      }

      button.style.display = 'none';
    })
    .catch(err => console.error(err));
}



// запуск с кнопки
function doIt() {
  getAllUniqueUsersLocations();
  renderResult();
}


// init
function init() {
  button.addEventListener('click', doIt);
  getUsersData(user_ids);
}