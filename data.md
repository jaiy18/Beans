```javascript
let data = {
    users: [
        {
            uId: 1,
            nameFirst: 'Hayden',
            nameLast: 'Jacobs',
            email: 'hayhay123@gmai.com'
            password: 'hayhay123'
            handleStr: 'haydenjacobs'
        },
    ],
    channels: [
        {
            channelId: 1
            authUserId: 1
            name: 'My Channel'
            isPublic: false
        },
    ],
};
```

[Optional] short description: 
An appropiate data structure to store the information would an array of objects; namely users, and channels. Each object would have a list 
that would store relevant information about the object. This data structure is suitable as entries can be added and removed without affecting the 
overall functionality of the data strucuture. 'users' and 'channels' are two separate objects and thus can be accessed separately. Each user will have a certain set of data related to them, and each channel will similarly contain a set of  data related to that channel. Meaning we need a array of objects containing a list; users and channels.  Based on the arugments taken in by the stub functions: userId, name, email, password, these will probably be neccessary fields for each user.

