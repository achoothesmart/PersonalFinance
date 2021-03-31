function loadBalanceSheets(dom_id){
    html = `<div class='b-sheets'>`
    balanceSheets.forEach(bs => {
        html += `<div class='b-sheet' onclick='loadBalanceSheet("${bs.name}")'> <div class='b-sheet-head'>${bs.name}</div> 
            <div class='b-sheet-body'> ${bs.transactions.length} Transactions </div>
        </div>`;
    });
    html += `</div>`;

    document.getElementById(dom_id).innerHTML = html;
}

function loadBalanceSheet(sheetName){
    let bs_trans = balanceSheets.filter(bs => bs.name == sheetName)[0];
    console.log(sheetName, bs_trans);
    if(bs_trans){
        lst_trans = bs_trans.transactions;
        loadTransactions(); // external call
        loadPage('page-transactions');
    }
}