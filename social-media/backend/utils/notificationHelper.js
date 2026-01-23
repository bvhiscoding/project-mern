const Notification = require('../models/Notification')


const createNotification = async ({recipientId , senderId, type, postId = null , message}) =>{
    try{
        if(recipientId.toString() === senderId.toString()){
            return null
        }

        const notification= await Notification.create({
            recipient: recipientId,
            sender: senderId,
            type,
            post: postId,
            message,
        })
        return notification
    }catch(error){
        console.error('CreateNotification error' , error);
        return null
        
    }
}
//delete noti when unfollow or unlike
const deleteNotification = async ({recipientId,senderId,type, postId = null}) =>{
    try{
        const query = {
            recipient : recipientId,
            sender : senderId,
            type,
        }

        if(postId){
            query.post = postId
        }
        await Notification.deleteOne(query)
    }catch(error){
        console.error('DeleteNotification error:', error);
    }
}

module.exports={
    createNotification,
    deleteNotification
}