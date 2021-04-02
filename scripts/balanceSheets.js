let bsSelected = undefined;

function loadBalanceSheets(dom_id){
    html = `<div class='b-sheets'>`
    balanceSheets.forEach(bs => {
        html += `<div class='b-sheet' oncontextmenu='bSheetCtxMenu(event, "${bs.name}")' onclick='loadBalanceSheet("${bs.name}")'> <div class='b-sheet-head'>${bs.name}</div> 
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
        loadPage('page-transactions', sheetName);
    }
}

function bSheetCtxMenu(event, sheetName){
    bsSelected = sheetName;
    console.log(sheetName);
    console.log(event);

    let ctxMenu = document.getElementById('bs-ctx-menu');
    positionCtxMenu(ctxMenu, event.clientX, event.clientY);
    show(ctxMenu);

    document.addEventListener('click', ()=>{
        hide(ctxMenu);
    });
    event.preventDefault();
}

function positionCtxMenu(menu, x, y){
    menu.style.top = `${y}px`;
    menu.style.left = `${x}px`;
}

function onBsCtxMenuClick(action_name){
    switch(action_name){
        case 'open':
            loadBalanceSheet(bsSelected);
            break;
        case 'delete':
            console.log('Delete is in progress..');
            break;
    }
}