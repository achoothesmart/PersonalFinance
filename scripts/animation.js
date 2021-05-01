
function fadeIn(elementId) {
	document.getElementById(elementId).classList.remove('fadeOut');
	document.getElementById(elementId).classList.add('fadeIn');
}

function fadeOut(elementId) {
	document.getElementById(elementId).classList.add('fadeOut');
	document.getElementById(elementId).classList.remove('fadeIn');
}

function slideIn(elementId) {
	document.getElementById(elementId).classList.remove('slideOut');
	document.getElementById(elementId).classList.add('slideIn');
}

function slideOut(elementId) {
	document.getElementById(elementId).classList.add('slideOut');
	document.getElementById(elementId).classList.remove('slideIn');
}

function rotate0to180(elementId){
	document.getElementById(elementId).classList.add('rotate0to180');
}

function removeEffect(elementId, className){
	try{
		document.getElementById(elementId).classList.remove(className);
	}catch{}
}