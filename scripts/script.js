// Globals
let balanceSheets = [];
let lst_trans = [];
let TRAN_ID = 1;

initData({
	'app-name' : "Personal Finance v1.2",
	// 'import-date': true,
	// 'import-particular': true,
	// 'import-debit': true,
	// 'import-credit': true,
	'import-format': "[Date]_tab_[Particular]_tab_[Debit]_tab_[Credit]",
	'import_delimiter_val': "\t",
	'import_delimiter_txt': "_tab_",
});

// on app start

onAppStart();

// Test data

balanceSheets = [
	{ name: 'Jan 2021', transactions: [
		{ id: 1, date: '01/01/2021', particular: 'Salary', amount: 45000.00, type: 'credit' },
		{ id: 2, date: '12/01/2021', particular: 'Rent', amount: 10000.00, type: 'debit' },
	]},
	{ name: 'Feb 2021', transactions: [
		{ id: 1, date: '01/02/2021', particular: 'Salary', amount: 47000.00, type: 'credit' },
		{ id: 2, date: '12/02/2021', particular: 'Travel', amount: 2200.00, type: 'debit' },
	]},
	{ name: 'Mar 2021', transactions: [
		{ id: 1, date: '01/03/2021', particular: 'Salary', amount: 50000.00, type: 'credit' },
		{ id: 2, date: '12/03/2021', particular: 'Maligai', amount: 2500.00, type: 'debit' },
		{ id: 3, date: '23/03/2021', particular: 'Rent', amount: 10000.00, type: 'debit' }
	]},
];

// lst_trans = [
// 	{ id: 1, date: '01/03/2021', particular: 'Salary', amount: 50000.00, type: 'credit' },
// 	{ id: 2, date: '12/03/2021', particular: 'Maligai', amount: 2500.00, type: 'debit' },
// 	{ id: 3, date: '23/03/2021', particular: 'Rent', amount: 10000.00, type: 'debit' }
// ];

loadBalanceSheets('balance-sheets', balanceSheets);

loadTransactions();

// declarations

function onAppStart(){
	initiateContextMenu();
}

function initiateContextMenu(){
	// document.addEventListener('contextmenu', (event)=>{
	// 	console.log(event);
	// 	event.preventDefault();
	// }, false);
}

function newTranId() {
	return TRAN_ID++;
}
function addTrans() {
	if (!validateEntry()) {
		return;
	}
	lst_trans.push({
		id: newTranId(),
		particular: particular.value,
		amount: Number.parseFloat(amount.value),
		type: Array.from(document.getElementsByName('entry_type')).filter(el => el.checked)[0].value
	});
	closePopup('entry-popup');
	clearEntry();
	loadTransactions();
}

function validateEntry() {
	return particular.value.trim() != '' && amount.value.trim() != '';
}

function clearEntry() {
	particular.value = '';
	amount.value = '';
	entry_type_credit.checked = false;
	entry_type_debit.checked = false;
}

function getTotal(tranType = 'all') {
	let total = 0;
	if (tranType == 'all') {
		total += lst_trans.filter(tran => tran.type == 'credit').map(cred_tran => cred_tran.amount).reduce((a, b) => a + b, 0)
		total -= lst_trans.filter(tran => tran.type == 'debit').map(debt_tran => debt_tran.amount).reduce((a, b) => a + b, 0)
	}
	else {
		total += lst_trans.filter(tran => tran.type == tranType).map(tran => tran.amount).reduce((a, b) => a + b, 0)
	}
	return total;
}



function onAmountKeyDown(event){
	console.log(event);
	if(event.key == 'Enter'){
		addNewTrans();
	}
}

function addTransaction(date = new Date(), particular = '', debit = '', credit = ''){
	// if(!date || date == undefined || date == null || date.trim() == '' || particular.trim() == '' || (debit+credit+'').trim() == ''){
	// 	return false;
	// }
	let valid = [0,0,0];
	if(date && date != undefined && date != null){
		valid[0]=1;
	}
	if(particular && particular != undefined && particular != null){
		valid[1]=1;
	}
	if(debit && debit != undefined && debit != null){
		valid[2]=1;
	}
	else if(credit && credit != undefined && credit != null){
		valid[2]=1;
	}

	if(valid.join() == '1,1,1'){
		lst_trans.push({
			id: newTranId(),
			date: date,
			particular: particular,
			amount: (debit && debit != '') ? Number.parseFloat(debit) : Number.parseFloat(credit),
			type: (debit && debit != '') ? 'debit' : 'credit'
		});
		loadTransactions();
	}
	else{
		console.log('Error while adding Transaction');
	}

	
}

function addNewTrans(){
	let date = document.getElementById('newTranDate').value;
	let particular = document.getElementById('newTranParticular').value;
	let debit = document.getElementById('newTranDebit').value;
	let credit = document.getElementById('newTranCredit').value;

	console.log(`${date} | ${particular} | ${debit} | ${credit}`);

	addTransaction(date, particular, debit, credit);
}

function onNewTranInput(tranType){
	switch(tranType){
		case 'debit':
			document.getElementById('newTranCredit').value = '';
			break;
		case 'credit':
			document.getElementById('newTranDebit').value = '';
			break;
	}
}

function onTranClick(event, tranId) {
	if (!event.target.classList.contains('chk')) {
		selectTran(tranId);
	}
	// event.stopPropagation();

}

function selectTran(tranId, selected = null) {
	let chkTran = document.getElementById(`chk_${tranId}`);
	if (selected == null) {
		chkTran.checked = !chkTran.checked;
	}
	else {
		chkTran.checked = selected;
	}
}

function selectAllTrans() {
	let chkAll = document.getElementById('chk_all');
	lst_trans.forEach(tran => {
		selectTran(tran.id, chkAll.checked);
	});
}

function deleteSelected() {
	let selectedIds = Array.from(document.querySelectorAll('#transactions .chk:checked')).map(chk => chk.id.split('_')[1]);
	selectedIds = selectedIds.map(id => Number.parseInt(id));
	lst_trans = lst_trans.filter(tran => !selectedIds.includes(tran.id));
	loadTransactions();
}

function importTrans() {
	lst_trans = [];
	let importSettings = [
		getData('import-date'),
		getData('import-particular'),
		getData('import-debit'),
		getData('import-credit')
	];

	

	document.getElementById('import').value.split('\n').forEach((tran, index) => {
		let tr = tran.split(getData('import_delimiter_val'));
		console.log(tr);
		if(false && tr.length != importSettings.filter(s => s).length){
			console.log('Invalid Transaction format at Index : ' + index);
		}
		else{
			// lst_trans.push({
			// 	id: newTranId(),
			// 	date: tr[0],
			// 	particular: tr[1],
			// 	amount: (tr[2] && tr[2] != '') ? Number.parseFloat(tr[2]) : Number.parseFloat(tr[3]),
			// 	type: (tr[2] && tr[2] != '') ? 'debit' : 'credit'
			// });

			addTransaction(tr[0], tr[1], tr[2], tr[3]);
		}
	});
	console.log(lst_trans);

	closePopup('import-popup');
	clearEntry();
	// loadTransactions();
}

function setImportDelimiter(delimiter){
	switch(delimiter){
		case 'tab':
			hide(document.getElementById('custom_delimiter'));
			setData('import_delimiter_val', '\t');
			setData('import_delimiter_txt', '_tab_');

			break;
		case 'custom':
			show(document.getElementById('custom_delimiter'));
			setData('import_delimiter_val', document.getElementById('custom_delimiter').value);
			setData('import_delimiter_txt', delimiter);
			break;
	}
	refreshImportFormat();
	
}

function setImportData(key, value){
	setData(key, value);
	refreshImportFormat();
}

function refreshImportFormat(){
	// [Date]_tab_[Particular]_tab_[debit]_tab_[credit]
	let importFormat = '';
	let arr = [];
	if(getData('import-date')){
		arr.push('[Date]');
	}
	if(getData('import-particular')){
		arr.push('[Particular]');
	}
	if(getData('import-debit')){
		arr.push('[Debit]');
	}
	if(getData('import-credit')){
		arr.push('[Credit]');
	}

	if(getData('import_delimiter_val') == '\t'){
		importFormat = arr.join(getData('import_delimiter_txt'));
	}
	else{
		importFormat = arr.join(getData('import_delimiter_val'));
	}
	
	setData('import-format', importFormat);
}


function currency(amt = 0) {
	amt = Number.parseFloat(amt);
	amt += '';
	let index = amt.length - 1;
	if (amt.indexOf('.') > 0) {
		index = amt.indexOf('.') - 1;
		if (index == amt.length - 3) {
			amt += '0';
		}
	}
	else {
		amt += '.00';
	}

	while (index > 2) {
		index -= 2;
		amt = amt.substring(0, index) + ',' + amt.substring(index, amt.length);
	}
	return amt;
}

// function getDateStr(d) {
// 	let datePart = d.toLocaleDateString().split('/').join('-');
// 	let timePart = d.toLocaleTimeString().split(':').join('-').split(' ').join('_');
// 	return datePart + '_' + timePart;
// }

function getDateFormat(date = new Date(), format = 'yyyy-MM-dd'){
	// supports only year = [yyyy], month = [MM], date = [dd] formats
	let year = date.getFullYear()+'';
	let month = (date.getMonth()+1)+'';
	let day = date.getDate()+'';

	if(month.length < 2){
		month = '0' + month;
	}
	if(day.length < 2){
		day = '0' + day;
	}

	let res = format;
	res = res.split('yyyy').join(year);
	res = res.split('MM').join(month);
	res = res.split('dd').join(day);

	return res;
}

function showSideMenu() {
	slideIn('side-menu');
}

function hideSideMenu() {
	slideOut('side-menu');
}

function loadPage(page_id, pageTitle) {
	loadDOMPage(page_id, pageTitle);
	hideSideMenu();
}

function show(el){
	el.classList.remove('hide');
}

function hide(el){
	el.classList.add('hide');
}

function ctxMenuItemClick(menu_id, action_name){
	// console.log(menu_id, action_name);
	if(menu_id == 'bs-ctx-menu'){
		onBsCtxMenuClick(action_name);
	}
	
	hide(document.getElementById(menu_id));
}

/*

// Putting dom event handlers in global scope (required for webpack build)
// Reference: https://stackoverflow.com/questions/35781579/basic-webpack-not-working-for-button-click-function-uncaught-reference-error

window.addTrans=addTrans;
window.closePopup=closePopup;
window.deleteSelected=deleteSelected;
window.hideSideMenu=hideSideMenu;
window.importTrans=importTrans;
window.loadPage=loadPage;
window.loadPopup=loadPopup;
window.showSideMenu=showSideMenu;
window.setImportData = setImportData;
window.setImportDelimiter = setImportDelimiter;
window.selectAllTrans = selectAllTrans;
window.onTranClick = onTranClick;
window.addNewTrans = addNewTrans;
window.onNewTranInput = onNewTranInput;
window.addTransaction = addTransaction;
window.onAmountKeyDown = onAmountKeyDown;


// Variables to Global scope
window.lst_trans = lst_trans;

*/


/*
var txt = document.getElementById('import').value;
var methods = [];
txt.split('onclick').forEach(line => { let len = line.indexOf('('); methods.push(line.substr(2,len-2)); });
document.getElementById('import').value = arr.map((meth) => {return 'window.' + meth + '=' + meth}).join('\n')
*/
