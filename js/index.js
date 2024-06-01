(function () {
  "use strict";

  //
  //  Open/close Add Image Form
  //
  function openCloseUploadBtn() {
    let found = 0;
    document.getElementById("upload-btn").classList.forEach((classElement) => {
      if (classElement === "upload-icon-opened") {
        found = 1;
      }
    });

    if (found === 1) {
      document.getElementById("upload-btn").src = "./media/upload-icon.png";
      document
        .getElementById("upload-btn")
        .classList.remove("upload-icon-opened");
      document
        .getElementById("add-image-form")
        .classList.remove("display-add-image-form");
    } else {
      document.getElementById("upload-btn").src = "./media/cross-icon.png";
      document.getElementById("upload-btn").classList.add("upload-icon-opened");
      document
        .getElementById("add-image-form")
        .classList.add("display-add-image-form");
    }
  }

  //
  //  Open/close Add Comment Form
  //
  function openCloseCommentForm() {
    let found = 0;
    document
      .getElementById("comment-post-btn")
      .classList.forEach((classElement) => {
        if (classElement === "upload-icon-opened") {
          found = 1;
        }
      });

    if (found === 1) {
      document.getElementById("comment-post-btn").style.backgroundImage =
        "url(./media/chat-icon.png)";
      document
        .getElementById("comment-post-btn")
        .classList.remove("upload-icon-opened");
      document
        .getElementById("make-comment-form")
        .classList.remove("comment-form-opened");
    } else {
      document.getElementById("comment-post-btn").style.backgroundImage =
        "url(./media/cross-icon.png)";
      document
        .getElementById("comment-post-btn")
        .classList.add("upload-icon-opened");
      document
        .getElementById("make-comment-form")
        .classList.add("comment-form-opened");
    }
  }

  //
  //  Add image to gallery
  //
  function addImg(event) {
    event.preventDefault();
    let author = document.getElementById("img-author").value;
    let title = document.getElementById("img-title").value;
    let url = document.getElementById("img-url").value;
    document.getElementById("add-image-form").reset();
    apiService.addImage(title, author, url);

    // Increment the total number of photos in gallery
    let posts = apiService.getPosts();
    if (Array.isArray(posts) && posts.length) {
      let currGalleryId = posts.length;

      document.getElementById("num-in-gallery").innerText =
        "#" + currGalleryId + "/" + posts.length;

      // Load the post that was just added
      displayInd(currGalleryId);
    }
  }

  //
  // Update display post to given gallery index (starts from 1)
  //
  function displayInd(galleryInd) {
    let posts = apiService.getPosts();

    if (posts !== null) {
      document.getElementById("image-title").innerText =
        posts[galleryInd - 1].title;
      document.getElementById("num-in-gallery").innerText =
        "#" + galleryInd + "/" + posts.length;
      document.getElementById("image-display").src = posts[galleryInd - 1].url;
      document.getElementById("image-author").innerHTML =
        "<i>Posted on " +
        posts[galleryInd - 1].date +
        " by:</i> " +
        posts[galleryInd - 1].author;
      document
        .getElementById("outer-img-display")
        .classList.add("display-outer-img");
      document
        .getElementById("gallery-empty")
        .classList.add("hide-gallery-empty-msg");
      document
        .getElementById("comment-sec-controls")
        .classList.add("display-comment-sec-controls");
      document
        .getElementById("comments")
        .classList.add("display-comment-section");
      updateComments();
    } else {
      document
        .getElementById("outer-img-display")
        .classList.remove("display-outer-img");
      document
        .getElementById("gallery-empty")
        .classList.remove("hide-gallery-empty-msg");
      document
        .getElementById("comment-sec-controls")
        .classList.remove("display-comment-sec-controls");
      document
        .getElementById("comments")
        .classList.remove("display-comment-section");
      document
        .getElementById("make-comment-form")
        .classList.remove("comment-form-opened");
    }
  }

  //
  // Reset comment page
  //
  function resetCommentPage() {
    let posts = apiService.getPosts();

    if (posts !== null) {
      let postToFindInd =
        +document.getElementById("num-in-gallery").innerText[1] - 1;
      let maxPages = Math.ceil(posts[postToFindInd].comments.length / 10);

      if (maxPages === 0) {
        maxPages = 1;
      }
      apiService.setCommentPage(maxPages);
      updateComments();
    }
  }

  //
  // Update display to next image in gallery
  //
  function nextImg() {
    let posts = apiService.getPosts();
    let nextGalleryInd =
      +document.getElementById("num-in-gallery").innerText[1] + 1;
    if (nextGalleryInd <= posts.length) {
      displayInd(nextGalleryInd);
      resetCommentPage();
    }
  }

  //
  // Update display to back/previous image in gallery
  //
  function backImg() {
    let prevGalleryInd =
      +document.getElementById("num-in-gallery").innerText[1] - 1;
    if (prevGalleryInd >= 1) {
      displayInd(prevGalleryInd);
      resetCommentPage();
    }
  }

  //
  // Delete an image in the gallery
  //
  function deleteImg() {
    let posts = apiService.getPosts();
    let postToFindInd =
      +document.getElementById("num-in-gallery").innerText[1] - 1;

    apiService.deleteImage(posts[postToFindInd].imageId);
    posts = apiService.getPosts();

    if (posts === null) {
      document
        .getElementById("outer-img-display")
        .classList.remove("display-outer-img");
      document
        .getElementById("comment-sec-controls")
        .classList.remove("display-comment-sec-controls");
      document
        .getElementById("comments")
        .classList.remove("display-comment-section");
      document
        .getElementById("gallery-empty")
        .classList.remove("hide-gallery-empty-msg");
      document
        .getElementById("make-comment-form")
        .classList.remove("comment-form-opened");
    } else if (postToFindInd >= posts.length) {
      displayInd(postToFindInd);
    } else {
      displayInd(postToFindInd + 1);
    }
  }

  //
  // Update comments displayed on image in gallery
  //
  function updateComments() {
    document.querySelector("#comments").innerHTML = "";
    let posts = apiService.getPosts();
    let postToFindInd =
      +document.getElementById("num-in-gallery").innerText[1] - 1;
    let i = (apiService.getCommentPageNum() - 1) * 10;
    let initialStart = i;

    if (posts !== null) {
      let comments = apiService.getComments(posts[postToFindInd].imageId);

      for (; i < comments.length && i < initialStart + 10; i++) {
        let comment = comments[i];
        let elmt = document.createElement("div");
        elmt.className = "row";
        elmt.id = comment.commentId;
        elmt.innerHTML = `
                  <div class="col-1 col-sm-1">
                      <img class="comment-profile-pic" src="./media/profile-picture-sample.png" alt="Sample of a user's profile picture.">
                      <div class="comment-author">${comment.author}</div>
                      <div class="comment-date">Posted: ${comment.date}</div>
                  </div>
                  <div class="col-auto col-sm-auto">
                      <div class="comment-content">${comment.content}</div>
                  </div>
                  <div class="col-1 col-sm-1 upvote-icon"></div>
                  <div class="col-1 col-sm-1 delete-icon"></div>
                  <div class="comment-spacer"></div>
                `;
        elmt
          .querySelector(".delete-icon")
          .addEventListener("click", function () {
            apiService.deleteComment(comment.commentId);
            updateComments();
          });
        document.querySelector("#comments").prepend(elmt);
      }
    }
  }

  //
  // Add a comment to an image in the gallery
  //
  function addComment(event) {
    event.preventDefault();
    let posts = apiService.getPosts();
    let postToFindInd =
      +document.getElementById("num-in-gallery").innerText[1] - 1;
    let author = document.getElementById("comment-author").value;
    let content = document.getElementById("comment-content").value;
    document.getElementById("make-comment-form").reset();

    apiService.addComment(posts[postToFindInd].imageId, author, content);
    resetCommentPage();
  }

  //
  // Going to the next 10 comments
  //
  function nextComment() {
    let posts = apiService.getPosts();
    let postToFindInd =
      +document.getElementById("num-in-gallery").innerText[1] - 1;
    let maxPages = Math.ceil(posts[postToFindInd].comments.length / 10);

    if (apiService.getCommentPageNum() < maxPages) {
      apiService.nextCommentPage();
      updateComments();
    }
  }

  //
  // Going back 10 comments
  //
  function backComment() {
    if (apiService.getCommentPageNum() > 1) {
      apiService.backCommentPage();
      updateComments();
    }
  }

  //
  //  Add the appropriate handlers and init posts
  //
  window.addEventListener("load", function () {
    document
      .querySelector("#upload-btn")
      .addEventListener("click", openCloseUploadBtn);
    document
      .querySelector("#comment-post-btn")
      .addEventListener("click", openCloseCommentForm);
    document
      .querySelector("#add-image-form")
      .addEventListener("submit", addImg);
    document.querySelector("#next-post").addEventListener("click", nextImg);
    document.querySelector("#back-post").addEventListener("click", backImg);
    document.querySelector("#delete-post").addEventListener("click", deleteImg);
    document
      .querySelector("#make-comment-form")
      .addEventListener("submit", addComment);
    document
      .querySelector("#next-comment-10")
      .addEventListener("click", nextComment);
    document
      .querySelector("#back-comment-10")
      .addEventListener("click", backComment);
    resetCommentPage();
    displayInd(1);
  });
})();
