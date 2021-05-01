function loadTransactions() {
	let html = '<table>';
	
    // html += '<tr> <th class="id-col"><input id="chk_all" type="checkbox" class="chk" onclick="selectAllTrans()"/>ID</th>'
	// html += '<th> Date </th>';

    html += '<tr> <th class="id-col"> <input id="chk_all" type="checkbox" class="chk" onclick="selectAllTrans()"/> </th>'
	html += '<th> Date </th>';
    html += '<th>Particular</th> <th>Amount (INR)</th> </tr>';
	html += lst_trans.map(tran =>
		`<tr class='${tran.saved ? 'saved' : 'unsaved'}' onclick='onTranClick(event, ${tran.id})'> 
			<td class="id-col"> <input id='chk_${tran.id}' type='checkbox' class='chk'/> </td>
			<td> ${tran.date ? tran.date : ''}</td>
			<td> ${tran.particular} </td> 
			<td> ${tran.type == 'credit' ? '<span class="badge credit">Cr</span>' : ''} ${currency(tran.amount)}</td> 
		</tr>`
	).join(' ');

	// Add new Trans row
	html += getNewTransRow();

	html += `<tr class='total-row'> <td colspan='3'>Total Credit</td> <td>${currency(getTotal('credit'))}</td> </tr>`;
	html += `<tr class='total-row'> <td colspan='3'>Total Debit</td>  <td>- ${currency(getTotal('debit'))}</td> </tr>`;
	html += `<tr class='total-row'> <td colspan='3'>Balance</td> <td colspan='1'>= ${currency(getTotal())}</td>  </tr>`;
	html += '</table>';
	document.getElementById('transactions').innerHTML = html;
}

function getNewTransRow(date = new Date(), particular = '', amount = '', tranType = 'debit'){
	date = getDateFormat(date, 'yyyy-MM-dd');

	return `<tr'> 
		<td> <input type='button' value='+' id='new-trans-add-btn' onclick='addNewTrans()' /> </td> 
		<td> <input type='date' id='newTranDate' value='${date}'/>  </td>
		<td> <input type='text' class='input-small' id='newTranParticular' value='${particular}'/> </td> 
		<td>
			<button id='tran-type-toggle' class="debit" onclick='toggleTranType()' tran-type='debit'>Debit</button>
			<input type='number' class='input-small' id='newTranAmount' onkeydown='onAmountKeyDown(event)' oninput='onNewTranInput("debit")'  value='${amount}'/>  
		</td> 
		
	</tr>`;
	
	// Old code
	// return `<tr'> 
	// 	<td> <input type='button' value='+' id='new-trans-add-btn' onclick='addNewTrans()' /> </td> 
	// 	<td> <input type='date' id='newTranDate' value='${date}'/>  </td>
	// 	<td> <input type='text' class='input-small' id='newTranParticular' value='${particular}'/> </td> 
	// 	<td> <input type='number' class='input-small' id='newTranDebit'  onkeydown='onAmountKeyDown(event)' oninput='onNewTranInput("debit")'  value='${debit}'/>  </td> 
	// 	<td> <input type='number' class='input-small' id='newTranCredit' onkeydown='onAmountKeyDown(event)' oninput='onNewTranInput("credit")' value='${credit}'/> </td> 
	// </tr>`;

}

function toggleTranType(){
	let tranTypeToggle = document.getElementById('tran-type-toggle');
	let tranType = tranTypeToggle.attributes['tran-type'].value;
	if(tranType == 'debit'){
		tranTypeToggle.attributes['tran-type'].value = 'credit';
		tranTypeToggle.innerText = 'Credit';
		tranTypeToggle.classList.remove('debit');
		tranTypeToggle.classList.add('credit');
	}
	else if(tranType == 'credit'){
		tranTypeToggle.attributes['tran-type'].value = 'debit';
		tranTypeToggle.innerText = 'Debit';
		tranTypeToggle.classList.remove('credit');
		tranTypeToggle.classList.add('debit');
	}
}

function onAmountKeyDown(event){
	console.log(event);
	if(event.key == 'Enter'){
		addNewTrans();
	}
}

function addNewTrans(){
	let date = new Date(document.getElementById('newTranDate').value);
	let particular = document.getElementById('newTranParticular').value;
	let amount = document.getElementById('newTranAmount').value;
	let tranType = document.getElementById('tran-type-toggle').attributes['tran-type'].value;

	console.log(`${date} | ${particular} | ${tranType} | ${amount}`);

	addTransaction(date, particular, amount, tranType);
}

function addTransaction(date = new Date(), particular = '', amount = '', tranType = 'debit'){
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
	if(amount && amount != undefined && amount != null && amount >= 0){
		valid[2]=1;
	}
	
	// if(debit && debit != undefined && debit != null){
	// 	valid[2]=1;
	// }
	// else if(credit && credit != undefined && credit != null){
	// 	valid[2]=1;
	// }

	if(valid.join() == '1,1,1'){
		lst_trans.push({
			id: newTranId(),
			date: getDateFormat(date, 'dd/MM/yyyy'),
			particular: particular,
			amount: Number.parseFloat(amount),
			type: tranType,
			saved: false
		});
		balanceSheets.filter(bs => bs.name == bsSelected)[0].saved = false;
		loadTransactions();
	}
	else{
		console.log('Error while adding Transaction');
	}

	
}

function onNewTranInput(tranType){
	// switch(tranType){
	// 	case 'debit':
	// 		document.getElementById('newTranCredit').value = '';
	// 		break;
	// 	case 'credit':
	// 		document.getElementById('newTranDebit').value = '';
	// 		break;
	// }
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
