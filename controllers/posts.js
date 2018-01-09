const Post = require('../models/post')
const User = require('../models/user')

module.exports = (app) => {
  // CREATE
  app.post('/posts', function (req, res) {
      if (req.user) {
          // INSTANTIATE INSTANCE OF POST MODEL
          var post = new Post(req.body);
          post.author = req.user._id

          // SAVE INSTANCE OF POST MODEL TO DB
          post.save().then((post) => {
              return User.findById(req.user._id)
          }).then((user) => {
              user.posts.unshift(post);
              user.save();
              // REDIRECT TO THE NEW POST
              res.redirect('/posts/'+ post._id)
          }).catch((err) => {
              console.log(err.message);
          })
      } else {
          return res.status(401); //UNAUTHORIZED
      }
  });

  app.get('/posts/new', function (req, res) {

      var currentUser = req.user

      res.render('post-new', {currentUser: currentUser});
   })

   // Show game details
  app.get('/posts/:id', function (req, res) {

      var currentUser = req.user;
      var currentAuthor = Game.author;

     // LOOK UP THE POST
     Game.findById(req.params.id).populate('author').populate('comments').then((game) => {
         res.render('post-show', { post, currentUser })
       }).catch((err) => {
         console.log(err.message)
       })
   })
};
