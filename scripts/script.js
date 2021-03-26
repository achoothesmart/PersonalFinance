let lst_trans = [];
let TRAN_ID = 1;

initData({
	'import-date': true,
	'import-particular': true,
	'import-debit': true,
	'import-credit': true,
	'import-format': "[Date]_tab_[Particular]_tab_[Debit]_tab_[Credit]",
	'import_delimiter_val': "\t",
	'import_delimiter_txt': "_tab_",
});

lst_trans = [
	{ id: 1, date: '01/03/2021', particular: 'Salary', amount: 50000.00, type: 'credit' },
	{ id: 2, date: '12/03/2021', particular: 'Maligai', amount: 2500.00, type: 'debit' },
	{ id: 3, date: '23/03/2021', particular: 'Rent', amount: 10000.00, type: 'debit' }
];

loadTransactions();

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

function loadTransactions() {
	let html = '<table>';
	html += '<tr> <th class="id-col"><input id="chk_all" type="checkbox" class="chk" onclick="selectAllTrans()"/>ID</th>'
	html += '<th> Date </th> <th>Particular</th> <th>Debit (INR)</th> <th>Credit (INR)</th> </tr>';
	html += lst_trans.map(tran =>
		`<tr onclick='onTranClick(event, ${tran.id})'> 
				<td class="id-col"><input id='chk_${tran.id}' type='checkbox' class='chk'/>${tran.id}</td> 
				<td>${tran.date ? tran.date : ''}</td>
				<td>${tran.particular}</td> 
				<td>${tran.type == 'debit' ? currency(tran.amount) : 0}</td> 
				<td>${tran.type == 'credit' ? currency(tran.amount) : 0}</td> 
			</tr>`
	).join(' ');
	html += `<tr class='total-row'> <td colspan='3'>Total</td> <td>${currency(getTotal('debit'))}</td> <td>${currency(getTotal('credit'))}</td> </tr>`;
	html += `<tr class='total-row'> <td colspan='3'>Balance</td> <td colspan='2'>${currency(getTotal())}</td>  </tr>`;
	html += '</table>';
	document.getElementById('transactions').innerHTML = html;
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
	document.getElementById('import').value.split('\n').forEach((tran, index) => {
		let tr = tran.split(getData('import_delimiter_val'));
		if(tr.length != 4){
			console.log('Invalid Transaction format at Index : ' + index);
		}
		else{
			lst_trans.push({
				id: newTranId(),
				date: tr[0],
				particular: tr[1],
				amount: (tr[2] && tr[2] != '') ? Number.parseFloat(tr[2]) : Number.parseFloat(tr[3]),
				type: (tr[2] && tr[2] != '') ? 'debit' : 'credit'
			});
		}
	});

	closePopup('import-popup');
	clearEntry();
	loadTransactions();
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

function getDateStr(d) {
	let datePart = d.toLocaleDateString().split('/').join('-');
	let timePart = d.toLocaleTimeString().split(':').join('-').split(' ').join('_');
	return datePart + '_' + timePart;
}

function showSideMenu() {
	slideIn('side-menu');
}

function hideSideMenu() {
	slideOut('side-menu');
}

function loadPage(page_id) {
	loadDOMPage(page_id);
	hideSideMenu();
}

function show(el){
	el.classList.remove('hide');
}

function hide(el){
	el.classList.add('hide');
}

