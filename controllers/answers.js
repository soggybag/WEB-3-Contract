const answer = require('../models/answer')
const Answer = require('../models/answer')

module.exports = (app) => {
    app.post('/answers/:answerId/comments', function (req, res) {
        // If not logged in, do this
        console.log(req.user)
        if (req.user == null) {
            res.redirect('/login');
            return
        }
        // New comment for answer
        let answer = new Answer(req.body);
        // Find the original answer to put new comment on
        answer.findById(req.params.answerId)
        .then((answer) => {
            answer.answers.unshift(answer)
            return answer.save()
        }).then((answer) => {
            return answer.save()
        }).then(() => {
            res.redirect('/answers/' + req.params.answerId)
        }).catch((err) => {
            console.log(err.message, "Could not save comment!")
            res.send(err.message)
        })
    })

    // New comments
    app.get('/comments/:commentid/new', (req, res) => {
        // Get the original comment for viewing as well
        Comment.findById(req.params.commentid)
        .then((comment) => {
            res.render('comment-new', {comment});
        })
    })

    // Voting up; uses AJAX/jquery to get here
    app.put('/comments/:answerId/vote-up', (req, res) => {
        // Find answer
        answer.findById(req.params.answerId)
        .then((answer) => {
            // Must be logged in to alter
            if(req.user === null){
                console.log("You must be logged in!")
            }
            // If user is inside list of people who already voted, deny
            else if(answer.upVotes.includes(req.user._id)){
                console.log(answer.upVotes)
                console.log("You already voted on this answer")
                console.log(req.user._id)
                res.status(200);
            }
            // Otherwise, change score
            else{
                answer.upVotes.push(req.user._id)
                answer.voteScore = answer.voteScore + 1
                answer.save();
                var response = {
                    "success" : "Updated Successfully",
                    "status" : 200,
                    "id": req.params.answerId,
                    "score": answer.voteScore
                }
                res.end(JSON.stringify(response));
            }
        })
    })

    // Voting up; uses AJAX/jquery to get here
    app.put('/comments/:answerId/vote-down', (req, res) => {
        // find answer
        Answer.findById(req.params.answerId)
        .then((answer) => {
            if(req.user === null){
                console.log("You must be logged in!")
            }
            else if(answer.downVotes.includes(req.user._id)){
                console.log(answer.downVotes)
                console.log(req.user._id)
                console.log("You already voted on this answer")
            }
            else{
                answer.downVotes.push(req.user._id)
                answer.voteScore = answer.voteScore - 1
                answer.save();
                var response = {
                    "success" : "Updated Successfully",
                    "status" : 200,
                    "id": req.params.answerId,
                    "score": answer.voteScore
                }
                res.end(JSON.stringify(response));
            }
        })
    })
};
