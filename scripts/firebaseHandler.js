var database = firebase.database();

function testDBConnection(message = 'Tested successfully') {
	database.ref('test/' + Date.now()).set({
		test_message: message
	}).then(() => {
		console.log('Firebase Connection : Success');
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


// Get
function getBalanceSheetsFromFirebase() {
	return new Promise((resolve, reject) => {
		try {
			var bsRef = firebase.database().ref('BALANCESHEETS');

			bsRef.on('value', (snapshot) => {
				console.log('snapshot->', snapshot);
				let result = [];
				snapshot.forEach((childSnapshot) => {
					// var childKey = childSnapshot.key;
					// var childData = childSnapshot.val();
					let bs = childSnapshot.val();
					bs.id = childSnapshot.key;
					bs.saved = true;
					result.push(bs);

				});

				// const data = snapshot.val();
				resolve(result);
			});


		}
		catch (ex) {
			reject(ex);
		}
	});
}


// Save Existing
function saveExistingBSToFirebase(balanceSheet, afterSaved) {
	var bsRef = firebase.database().ref('BALANCESHEETS/' + balanceSheet.id);
	bsRef.set({
		name: balanceSheet.name,
		transactions: balanceSheet.transactions,
		last_saved: (new Date()).toLocaleString()
	}).then(() => {
		afterSaved();
	});
}

// Save New
function saveNewBSToFirebase(balanceSheet, afterSaved) {
	var bsRef = firebase.database().ref('BALANCESHEETS');
	var newBSRef = bsRef.push();
	newBSRef.set({
		name: balanceSheet.name,
		transactions: balanceSheet.transactions,
		last_saved: (new Date()).toLocaleString()
	}).then(() => {
		afterSaved();
	});
}
