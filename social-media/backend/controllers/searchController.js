const User = require('../models/User')
const Post = require('../models/Post')

const searchUsers = async (req,res) =>{
    try{
        const {q} = req.query
        if(!q || q.trim() === ''){
            return res.status(404).json({message:'Search query is required'})
        }
        const users = await User.find({
            username: { $regex: q ,$options: 'i'}
        })
        .select('username  avatar bio followers following')
        .limit(20)

        res.json({
            query : q,
            count: users.length,
            users
        })
    }catch(error){
        console.error('SearchUsers error:', error);
        res.status(500).json({ message: error.message });
    }
}

const searchPosts = async (req,res) =>{
    try{
        const {q} = req.query;
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 5
        const skip = (page-1) *limit
        if(!q || q.trim() ===''){
            return res.status(404).json({message:'Search query is required'})
        }
        const searchQuery = {
            $or:[
                {title: {$regex: q , $options: 'i'}},
                {content:{$regex: q , $options: 'i'}}
            ]
        }

        const posts = await Post.find(searchQuery)
        .populate('user', 'username avatar')
        .populate('comments.user' , 'username avatar')
        .sort({createdAt: -1})
        .skip(skip)
        .limit(limit)

        const total = await Post.countDocuments(searchQuery)

        res.json({
            query:q,
            posts,
            currentPage: page,
            totalPages: Math.ceil(total/limit),
            totalPosts: total
        })
    }catch (error) {
    console.error('SearchPosts error:', error);
    res.status(500).json({ message: error.message });
  }
}

const searchAll = async (req,res) =>{
    try{
        const {q} = req.query
        if(!q || q.trim() === ''){
            return res.status(404).json({message:'Search query is required'})
        }

        const users = await User.find({username:{ $regex: q , $options:'i'}})
        .select('username avatar bio')
        .limit(5)

        const posts = await Post.find({
            $or:[
                {title: { $regex:q , $options:'i'}},
                {content:{$regex:q, $options:'i'}}
            ]
        })
        .populate('user', 'username avatar')
        .sort({createdAt: -1})
        .limit(5)

        res.json({
            query:q ,
            users:{
                count: users.length,
                data:users
            },
            posts:{
                count: posts.length,
                data: posts
            }
        })
    }catch(error){
        console.error('SearchAll error:', error);
    res.status(500).json({ message: error.message });
    }
}

module.exports ={
    searchUsers,
    searchPosts,
    searchAll
}