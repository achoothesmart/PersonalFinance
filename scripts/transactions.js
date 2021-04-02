function loadTransactions() {
	let html = '<table>';
	
    // html += '<tr> <th class="id-col"><input id="chk_all" type="checkbox" class="chk" onclick="selectAllTrans()"/>ID</th>'
	// html += '<th> Date </th>';

    html += '<tr> <th class="id-col"> <input id="chk_all" type="checkbox" class="chk" onclick="selectAllTrans()"/> </th>'
	html += '<th> Date </th>';

    html += '<th>Particular</th> <th>Amount (INR)</th> </tr>';
	html += lst_trans.map(tran =>
		`<tr onclick='onTranClick(event, ${tran.id})'> 
			<td> <input id='chk_${tran.id}' type='checkbox' class='chk'/> </td>
			<td>  ${tran.date ? tran.date : ''}</td>
			<td>${tran.particular}</td> 
			<td class='${tran.type}'>${currency(tran.amount)}</td> 
		</tr>`
	).join(' ');

	// Add new Trans row
	// html += getNewTransRow();

	html += `<tr class='total-row'> <td colspan='3'>Total Credit</td> <td>${currency(getTotal('credit'))}</td> </tr>`;
	html += `<tr class='total-row'> <td colspan='3'>Total Debit</td>  <td>- ${currency(getTotal('debit'))}</td> </tr>`;
	html += `<tr class='total-row'> <td colspan='3'>Balance</td> <td colspan='1'>= ${currency(getTotal())}</td>  </tr>`;
	html += '</table>';
	document.getElementById('transactions').innerHTML = html;
}

function getNewTransRow(date = new Date(), particular = '', debit = '', credit = ''){
	date = getDateFormat(date, 'yyyy-MM-dd');
	return `<tr'> 
		<td> <input type='button' value='+' id='new-trans-add-btn' onclick='addNewTrans()' /> </td> 
		<td> <input type='date' id='newTranDate' value='${date}'/>  </td>
		<td> <input type='text' class='input-small' id='newTranParticular' value='${particular}'/> </td> 
		<td> <input type='number' class='input-small' id='newTranDebit'  onkeydown='onAmountKeyDown(event)' oninput='onNewTranInput("debit")'  value='${debit}'/>  </td> 
		<td> <input type='number' class='input-small' id='newTranCredit' onkeydown='onAmountKeyDown(event)' oninput='onNewTranInput("credit")' value='${credit}'/> </td> 
	</tr>`;
}