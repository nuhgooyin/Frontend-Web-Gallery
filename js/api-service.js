let apiService = (function () {
  "use strict";

  let module = {};

  let posts = [];

  let commentId = 0;

  let imageId = 0;

  let commentPageNum = 1;

  /*  ******* Data types *******
    image object's attributes:
        - (String) imageId 
        - (String) title
        - (String) author
        - (String) url
        - (Date) date

    comment object's attributes:
        - (String) commentId
        - (String) imageId
        - (String) author
        - (String) content
        - (Date) date
  */

  // get comment page number
  module.getCommentPageNum = function () {
    return commentPageNum;
  };

  // add comment page number
  module.nextCommentPage = function () {
    commentPageNum++;
    return commentPageNum;
  };

  // subtract comment page number
  module.backCommentPage = function () {
    commentPageNum--;
    return commentPageNum;
  };

  // set comment page number
  module.setCommentPage = function (pageNum) {
    commentPageNum = pageNum;
    return commentPageNum;
  };

  // store posts in local storage
  module.storePosts = function () {
    if (localStorage.getItem("storedposts") !== null) {
      let storedPosts = JSON.parse(localStorage.getItem("storedposts"));

      if (Array.isArray(storedPosts) && storedPosts.length) {
        let newPosts = storedPosts.concat(posts);
        localStorage.setItem("storedposts", JSON.stringify(newPosts));
      } else {
        localStorage.setItem("storedposts", JSON.stringify(posts));
      }
    } else {
      localStorage.setItem("storedposts", JSON.stringify(posts));
    }
    posts = [];
  };

  // get posts in local storage
  module.getPosts = function () {
    if (localStorage.getItem("imageId") !== null) {
      imageId = JSON.parse(localStorage.getItem("imageId"));
    }
    if (localStorage.getItem("commentid") !== null) {
      commentId = JSON.parse(localStorage.getItem("commentid"));
    }
    if (localStorage.getItem("storedposts") !== null) {
      let storedPosts = JSON.parse(localStorage.getItem("storedposts"));
      if (Array.isArray(storedPosts) && storedPosts.length) {
        return JSON.parse(localStorage.getItem("storedposts"));
      }
    }
    return null;
  };

  // add an image to the gallery
  module.addImage = function (title, author, url) {
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1;
    let yyyy = today.getFullYear();

    // Add leading zero if the day is less than 10
    if (dd < 10) {
      dd = "0" + dd;
    }

    // Add leading zero if the month is less than 10
    if (mm < 10) {
      mm = "0" + mm;
    }

    let date = yyyy + "-" + mm + "-" + dd;

    posts.push({
      imageId: imageId++,
      title: title,
      author: author,
      url: url,
      comments: [],
      date: date,
      commentPageNum: 1,
    });
    localStorage.setItem("imageId", JSON.stringify(imageId));
    module.storePosts();
  };

  // delete an image from the gallery given its imageId
  module.deleteImage = function (imageId) {
    module.storePosts();
    posts = module.getPosts();

    posts.forEach(function (post) {
      if (post.imageId === imageId) {
        posts.splice(posts.indexOf(post), 1);
      }
    });
    localStorage.removeItem("storedposts");
    module.storePosts();
  };

  // add a comment to an image
  module.addComment = function (imageId, author, content) {
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1;
    let yyyy = today.getFullYear();

    // Add leading zero if the day is less than 10
    if (dd < 10) {
      dd = "0" + dd;
    }

    // Add leading zero if the month is less than 10
    if (mm < 10) {
      mm = "0" + mm;
    }

    let date = yyyy + "-" + mm + "-" + dd;

    posts = module.getPosts();

    for (let i = 0; i < posts.length; i++) {
      if (posts[i].imageId === imageId) {
        posts[i].comments.push({
          commentId: commentId++,
          imageId: posts[i].imageId,
          author: author,
          content: content,
          date: date,
        });
        break;
      }
    }
    localStorage.removeItem("storedposts");
    module.storePosts();
  };

  // get comments under an image
  module.getComments = function (imageId) {
    let storedPosts = module.getPosts();

    for (let i = 0; i < storedPosts.length; i++) {
      if (storedPosts[i].imageId === imageId) {
        return storedPosts[i].comments;
      }
    }
  };

  // delete a comment to an image
  module.deleteComment = function (commentId) {
    let storedPosts = module.getPosts();
    let found = 0;

    for (let i = 0; i < storedPosts.length; i++) {
      if (found) {
        break;
      }

      for (let k = 0; k < storedPosts[i].comments.length; k++) {
        if (storedPosts[i].comments[k].commentId === commentId) {
          storedPosts[i].comments.splice(k, 1);
          found = 1;
          break;
        }
      }
    }
    posts = storedPosts;
    localStorage.removeItem("storedposts");
    module.storePosts();
  };

  return module;
})();
