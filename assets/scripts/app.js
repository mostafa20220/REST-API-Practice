const postsListEl = document.querySelector(".posts");
const postTemplate = document.getElementById("single-post");
const fetchBtn = postsListEl.previousElementSibling;
const formEl = document.querySelector("#new-post form");


// Fetch Posts from the Server
async function fetchPosts() {
  try {
    const response = await axios.get(
      "https://jsonplaceholder.typicode.com/posts"
    );

    postsListEl.innerHTML = "";
    for (const postObj of response.data) {
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

  // clear the inputs
  formEl.reset();

  // send the post request
  try {
    const postIdResponse = await axios.post(
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
      axios.delete(
        "https://jsonplaceholder.typicode.com/posts/" + postId
      );
      postEl.remove();
    } catch (e) {
      console.log(e);
    }
  }
});

