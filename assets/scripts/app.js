const postsListEl = document.querySelector(".posts");
const postTemplate = document.getElementById("single-post");
const fetchBtn = postsListEl.previousElementSibling;
const formEl = document.querySelector("#new-post form");

function sendHttpRequest(method, url, data) {
  /* Using XMLHttpRequest API
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.setRequestHeader("Content-Type","application/json");
    xhr.setRequestHeader("Custom-Header","text/plain");
      xhr.open(method, url);
      xhr.responseType = "json";
    
      xhr.addEventListener("load", () => {
          if (xhr.status >= 200 && xhr.status < 300) resolve(xhr.response);
          else reject(new Error("This is a Server Side Error"));
        });
        xhr.addEventListener("error", () =>
          reject(new Error("This is Network Error"))
        );
      
        xhr.send(JSON.stringify(data));
      });
*/

  // Using the fetch API
  return fetch(url, {
    method: method,
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
      "Custom-Header": "text/plain",
    },
  })
    .then((response) => {
      if (response.status >= 200 && response.status < 300)
        return response.json();
      else {
        return response.json().then((errData) => {
          console.log(`The err Data: `, errData);
          throw new Error("Server Side Error!!");
        });
      }
    })
    .catch((e) => {
      console.log(e);
      throw new Error("This is from the Catch Error!");
    });
}

// Fetch Posts from the Server
async function fetchPosts() {
  try {
    const posts = await sendHttpRequest(
      "GET",
      "https://jsonplaceholder.typicode.com/posts"
    );

    postsListEl.innerHTML = "";
    for (const postObj of posts) {
      const postEl = document.importNode(postTemplate, true).content;
      postEl.querySelector("h2").textContent = postObj.title;
      postEl.querySelector("p").textContent = postObj.body;
      postEl.querySelector("li").id = postObj.id;
      postsListEl.append(postEl);
    }
  } catch (e) {
    console.log(e);
  }
}

// Add post to both the server, and the UI.
async function addPost() {

  // getting the form data using "FormData";
  const newPostFd = new FormData(formEl);
  newPostFd.append("userId",(Math.random() * 10).toFixed());

  // validate user input
  if (!(newPostFd.get("title") && newPostFd.get("body"))) {
    alert("Inputs are Not Valid, try again...");
    return;
  }

  // clear the inputs //
  formEl.reset();

  // send the post request
  try {
    const postIdResponse = await sendHttpRequest(
      "POST",
      "https://jsonplaceholder.typicode.com/posts",
      newPostFd
    );

    // update the UI
    const postEl = document.importNode(postTemplate, true).content;
    postEl.querySelector("h2").textContent = newPostFd.get("title");
    postEl.querySelector("p").textContent = newPostFd.get("body");
    postEl.querySelector("li").id = postIdResponse;
    postsListEl.append(postEl);
  } catch (e) {
    console.log(e);
  }
}

// **  Adding Events Listeners **  //
fetchBtn.addEventListener("click", fetchPosts);

formEl.addEventListener("submit", (e) => {
  e.preventDefault();
  addPost();
});

postsListEl.addEventListener("click", (e) => {
  if (e.target.tagName === "BUTTON") {
    const postEl = e.target.closest("li");
    const postId = postEl.id;
    try {
      sendHttpRequest(
        "DELETE",
        "https://jsonplaceholder.typicode.com/posts/" + postId
      );
      postEl.remove();
    } catch (e) {
      console.log(e);
    }
  }
});

//***************************** */
/*  Try using lodash library 
*********************************
 *  const num1 = [1,2,3,4,5,6,7];
 *  const num2 = [1,2,3,8,9];
 *
 *  // console the difference
 *  const diff = _.difference(num1,num2); // why there is no auto complete for the lodash lib. ?!, i guess i have to add it using an extension or something
 *  console.log(diff); 
 */

