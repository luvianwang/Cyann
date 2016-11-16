var Courses = require("../models/course.js");
var Users = require('../models/user.js')
var mongoose = require('mongoose');

//find all user
exports.findAll = function(req,res){
    Users.find()
        .select('-__v')
        .then(function (result){
            res.json({ message: 'Retrieved all user!', data: result });
        }).catch(function(err){
            res.send(err);
        });
}

//Convert a userId to a name
exports.findById = function(req,res){
    res.json({ data: req.user });
}

//find post by written by a specific user
exports.findPostById = function(req,res){

    var userId = req.params.userId;
    var postIdArray = [];

    // res.json('ko');
    Courses.aggregate(  [   { $match: {'posts.author': mongoose.Types.ObjectId("582bdb49b90ca49e03d159c7")} },
                            { $unwind: '$posts' },
                            { $project: { 'posts._id': 1, 'posts.title': 1, 'posts.content': 1, 'posts.author': 1, 'posts.course': 1, 'posts.updatedAt': 1, 'posts.createdAt': 1, _id: 0 } }
                        ], function(err, aggregateResult) {
                            if (err) {
                                res.status(400);
                                res.json(err);
                            }
                            else{
                                res.status(200);
                                res.json(aggregateResult);
                        }
    });
    // // Alternative (UGLY) solution
    // Users.findOne({ _id: userId})
    //     .then(function(userObject){
    //         postIdArray = userObject.posts;
    //         return Courses.find({ "posts.author": userId })
    //     })
    //     .then(function(courseObj){
    //         // Extract posts obj from the array courses that have user's posts
    //         var result = courseObj.map(function(e){
    //             return e.posts;
    //         })
    //         // Flatten array
    //         result = [].concat.apply([], result);
    //         // Extract posts made by user
    //         result = result.filter(function(e){
    //             return postIdArray.indexOf(e._id) > -1;
    //         });
    //         res.json(result);
    //     })
    //     .catch(function(err){
    //         res.status(400);
    //         res.send(err);
    //     });
}

exports.findCommentById = function(req,res){
    var promise = Course.aggregate({
            $match: {'posts.comments.author': {$gte: 'Howard Zhou'}}
        }, {
            $unwind: '$posts.comments'
         }, {
            $match: {'posts.comments.author': {$gte: 'Howard Zhou'}}
        }, {
        $project: {
            title: '$comments.title',
            content:'$comments.content'
        }
    })
    promise.then(function(result){
        console.log(result)
    }).catch(function(err){
        res.send(err)
    });
}