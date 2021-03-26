var database = firebase.database();

function testDBConnection(message = 'Tested successfully'){
	database.ref('test/'+ Date.now()).set({
		test_message: message
	});
}

// function writeUserData(userId, name, email, imageUrl) {
// 	firebase.database().ref('users/' + userId).set({
// 		username: name,
// 		email: email,
// 		profile_picture: imageUrl
// 	});
// }


// var starCountRef = firebase.database().ref('posts/' + postId + '/starCount');
// starCountRef.on('value', (snapshot) => {
// 	const data = snapshot.val();
// 	updateStarCount(postElement, data);
// });