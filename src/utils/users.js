const users=[];

const addUser=({id,username,room})=>{
    username=username.trim().toLowerCase()
    room=room.trim().toLowerCase()  
    if(!username ||!room){
        return {
            error:"Username and room are required!"
        }
    }
    const existingUser=users.find((user)=>{
        return user.room===room && user.username===username
    })
    //validate username
    if(existingUser){
        return {
            error:'username is in use'
        }
    }
    //store user
    const user ={id,username,room}
    users.push(user)
    return {user}
}
const removeUser=(id)=>{
    const index=users.findIndex((user)=>user.id===id)
        if(index!==-1){
            return users.splice(index,1)[0]
        }
    }
    const getUser=(id)=>{
        return users.find((user)=>user.id===id)
    }
    const getUsersInRoom=(room)=>{
        room=room.trim().toLowerCase();
        return users.filter((user)=>user.room===room)
    }
// addUser({
//     id:22,
//     username:'Andrew',
//     room:'South Philly'
// })
// addUser({
//     id:42,
//     username:'mike',
//     room:'South Philly'
// })
// addUser({
//     id:22,
//     username:'Andrew',
//     room:'center city'
// })

// const removedUser=removeUser(22);
// console.log(removedUser)
// console.log(users)
//const user=getUser(22)
//console.log(user);

const userList=getUsersInRoom('south philly')
console.log(userList)
module.exports={
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}