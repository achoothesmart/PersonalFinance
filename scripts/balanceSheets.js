let bsSelected = undefined;

function loadBalanceSheets(dom_id){
    html = `<div class='b-sheets'>`
    balanceSheets.forEach(bs => {
        html += `<div class='b-sheet' oncontextmenu='bSheetCtxMenu(event, "${bs.name}")' onclick='loadBalanceSheet("${bs.name}")'> <div class='b-sheet-head'>${bs.name}</div> 
            <div class='b-sheet-body'> 
                ${bs.transactions.length} trans
                ${bs.saved ? '': ' (' + bs.transactions.filter(tr => !tr.saved).length + ' unsaved)'}
            </div>
        </div>`;
    });

    // add new sheet
    html += `<div class='b-sheet b-sheet-new' oncontextmenu='bSheetCtxMenu(event, "#NEW_SHEET")' onclick='loadBalanceSheet("#NEW_SHEET")'> <div class='b-sheet-head'>Add New</div> 
        <div class='b-sheet-new-body'> + </div>
    </div>`;

    html += `</div>`;

    document.getElementById(dom_id).innerHTML = html;
}

function loadBalanceSheet(sheetName){
    let bs_trans = balanceSheets.filter(bs => bs.name == sheetName)[0];
    // console.log(sheetName, bs_trans);
    if(bs_trans){
        bsSelected = sheetName;
        lst_trans = bs_trans.transactions;
        loadTransactions(); // external call
        loadPage('page-transactions', sheetName);
    }
    else{
        console.log(sheetName);
        if(sheetName == '#NEW_SHEET'){
            bsSelected = 'untitled';
            lst_trans = [];
            loadTransactions(); // external call
            loadPage('page-transactions', bsSelected);
        }
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