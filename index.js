document.addEventListener("DOMContentLoaded", init);

function init(){
  getAllBooks().then(renderBooks);
}

const BASE_URL = 'http://localhost:3000'
function getAllBooks(){
  return fetch(BASE_URL + "/books").then(r => r.json());
}

function renderBooks(books){
  let listUl = document.getElementById('list');
  listUl.innerHTML = "";
  books.forEach(renderBook)
}

function renderBook(book){
  let listUl = document.getElementById('list');
  let li = document.createElement('li');
  li.innerText = book.title;
  li.dataset.bookId = book.id;
  listUl.appendChild(li);
  li.addEventListener('click', renderBookDetail)
}

function renderBookDetail(e){
  // console.log(e.target.dataset.bookId);
  getBook(e.target.dataset.bookId).then(bookDetail)
}

function bookDetail(book){
  let container = document.getElementById('show-panel');
  container.innerHTML = "";
  let h2 = document.createElement('h2');
  h2.innerText = book.title;
  let img = document.createElement('img');
  img.src = book.img_url;
  let p = document.createElement('p');
  p.innerText = book.description;
  let div = document.createElement('div');
  let h4 = document.createElement('h4');
  h4.innerText = "Liker(s)"
  let ul = document.createElement('ul');
  book.users.forEach((user) => {
    let li = document.createElement('li');
    li.innerText = user.username;
    ul.appendChild(li);
  })
  let likeBtn = document.createElement('button');
  likeBtn.dataset.bookId = book.id;
  likeBtn.innerText = "Like";
  likeBtn.addEventListener('click', likeBook)//(e) => console.log(e.target.dataset.bookId))
  div.append(h4, ul, likeBtn)
  container.append(h2, img, p, div);
}

function getBook(id){
  return fetch(BASE_URL + `/books/${id}`).then(r => r.json());
}

function patchBook(data){
  const options = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify(data)
  }
  // debugger
  return fetch(BASE_URL + `/books/${data.id}`, options).then(r => r.json());
}

function likeBook(event){
  const id = parseInt(event.target.dataset.bookId);
  // debugger
  // if (checkLikes(id)) {
  //   alert("You already liked it");
  // }else{
  let b = {};
  getBook(id).then(r => {
    b = r
  }).then(() => {
    if (!checkLikes(b.users)){
      // debugger
      b.users.push({id: 1, username: "pouros"})
    }else{
      alert("You already liked it");
    }
  })
    .then(() => patchBook(b))
    .then(bookDetail);
  // debugger
  // patchBook(b[0]);
}

function checkLikes(arr){
  likes = false;
  arr.forEach((el) => {
    if (el.username === "pouros"){
      likes = true;
    }
  })
  return likes;
}

// function checkLikes(id){
//   a = [];
//   getBook(id).then(r => r.users).then(users => a.push(users)).then(() => {return a});
//   // getBook(id).then(r => r.users).then(users => {
//   //   let likes = false;
//   //   console.log(users);
//   //   users.forEach((user) => {
//   //     if (user.username === "pouros"){
//   //       // debugger
//   //       likes = true;
//   //     }
//   //   })
//   // })
//   // debugger
//   // return likes;
// }
