const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const login = require('../middleware/login');
const Post = mongoose.model('Post');
const User = mongoose.model('User');

router.get('/user/:id', login, (req, res) => {
	User.findOne({ _id: req.params.id })
		.then(user => {
			Post.find({ postedBy: req.params.id })
				.populate('postedBy', '_id, name')
				.select('-password')
				.exec((err, posts) => {
					if (err) {
						return res.status(422).json({ error: err });
					}
					res.json({ user, posts });
				});
		})
		.catch(err => {
			return res.status(404).json({ error: 'User not found' });
		});
});

router.put('/follow', login, (req, res) => {
	User.findByIdAndUpdate(
		req.body.followId,
		{
			$push: { followers: req.user._id },
		},
		{ new: true },
		(err, result) => {
			if (err) {
				return res.status(422).json({ error: err });
			}
			User.findByIdAndUpdate(
				req.user._id,
				{
					$push: { following: req.body.followId },
				},
				{ new: true }
			)
				.then(result => {
					res.json(result);
				})
				.catch(err => {
					return res.status(422).json({ error: err });
				});
		}
	);
});

router.put('/unfollow', login, (req, res) => {
	User.findByIdAndUpdate(
		req.body.unfollowId,
		{
			$pull: { followers: req.user._id },
		},
		{ new: true },
		(err, result) => {
			if (err) {
				return res.status(422).json({ error: err });
			}
			User.findByIdAndUpdate(
				req.user._id,
				{
					$pull: { following: req.body.unfollowId },
				},
				{ new: true }
			)
				.then(result => {
					res.json(result);
				})
				.catch(err => {
					return res.status(422).json({ error: err });
				});
		}
	);
});

module.exports = router;
