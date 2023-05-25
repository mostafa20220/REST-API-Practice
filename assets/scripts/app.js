const postsListEl = document.querySelector(".posts");
const postTemplate = document.getElementById("single-post");
const fetchBtn = postsListEl.previousElementSibling;
const formEl = document.querySelector("#new-post form");

function sendHttpRequest(method, url, data) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.responseType = "json";

    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status <= 300) resolve(xhr.response);
      else reject(new Error("This is a Server Side Error"));
    });
    xhr.addEventListener("error", () =>
      reject(new Error("This is Network Error"))
    );

    xhr.send(JSON.stringify(data));
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
  // selecting the needed DOM Nodes
  const newPostTitleInput = document.getElementById("title");
  const newPostContentInput = document.getElementById("content");
  const newPostTitleValue = newPostTitleInput.value;
  const newPostContentValue = newPostContentInput.value;

  // validate user input
  if (!(newPostTitleValue.trim() && newPostContentValue.trim())) {
    alert("Inputs are Not Valid, try again...");
    return;
  }

  // clear the inputs //
  //1st way
  newPostTitleInput.closest("form").reset();
  // //2nd way
  // newPostTitleInput.value='';
  // newPostContentInput.value='';
  // //3rd way
  // newPostTitleInput.value=newPostTitleInput.defaultValue;
  // newPostContentInput.value=newPostContentInput.defaultValue;

  // send the post request
  const post = {
    title: newPostTitleValue,
    userId: (Math.random() * 10).toFixed(2),
    body: newPostContentValue,
  };

  try {
    const postIdResponse = await sendHttpRequest(
      "POST",
      "https://jsonplaceholder.typicode.com/posts",
      post
    );

    // update the UI
    const postEl = document.importNode(postTemplate, true).content;
    postEl.querySelector("h2").textContent = post.title;
    postEl.querySelector("p").textContent = post.body;
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
