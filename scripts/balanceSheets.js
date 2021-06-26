let bsSelected = undefined;
function getBalanceSheets() {
    getBalanceSheetsFromFirebase().then((bs) => {
        balanceSheets = bs;
        console.log('From Firebase ->', balanceSheets);
        loadBalanceSheets('balance-sheets', balanceSheets);
    }).catch((err) => {
        console.error(err);
    });
}


function loadBalanceSheets(dom_id) {
    html = `<div class='b-sheets'>`
    balanceSheets.forEach(bs => {
        html += `<div class='b-sheet' oncontextmenu='bSheetCtxMenu(event, "${bs.name}")' onclick='loadBalanceSheet("${bs.name}")'> <div class='b-sheet-head'>${bs.name}</div> 
            <div class='b-sheet-body'> 
                ${bs.transactions.length} trans
                ${bs.saved ? '' : ' (' + bs.transactions.filter(tr => !tr.saved).length + ' unsaved)'}
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

function loadBalanceSheet(sheetName) {
    let bs_trans = balanceSheets.filter(bs => bs.name == sheetName)[0];
    // console.log(sheetName, bs_trans);
    if (bs_trans) {
        bsSelected = sheetName;
        lst_trans = bs_trans.transactions;
        loadTransactions(); // external call
        loadPage('page-transactions', sheetName);
    }
    else {
        console.log(sheetName);
        if (sheetName == '#NEW_SHEET') {
            bsSelected = 'untitled';
            lst_trans = [];
            loadTransactions(); // external call
            loadPage('page-transactions', bsSelected);
        }
    }
}

function bSheetCtxMenu(event, sheetName) {
    bsSelected = sheetName;
    console.log(sheetName);
    console.log(event);

    let ctxMenu = document.getElementById('bs-ctx-menu');
    positionCtxMenu(ctxMenu, event.clientX, event.clientY);
    show(ctxMenu);

    document.addEventListener('click', () => {
        hide(ctxMenu);
    });
    event.preventDefault();
}

function positionCtxMenu(menu, x, y) {
    menu.style.top = `${y}px`;
    menu.style.left = `${x}px`;
}

function onBsCtxMenuClick(action_name) {
    switch (action_name) {
        case 'open':
            loadBalanceSheet(bsSelected);
            break;
        case 'delete':
            console.log('Delete is in progress..');
            break;
    }
}


function onSaveBalancesheetClick() {
    // check if bsSelected is present in balanceSheets
    if (balanceSheets.filter(bs => bs.name == bsSelected).length > 0) {
        // save existing BS 1
        let bs = saveBSLocal();
        loadBalanceSheet(bsSelected);
        console.log('BS Saved Locally!');
        saveExistingBSToFirebase(bs, () => {
            console.log('BS Saved in cloud!');
        });
    }
    else {
        // save new BS
        loadPopup('savebs-popup');
        document.getElementById('new_bs_name').value = bsSelected;
    }
    getBalanceSheets();
}

function suggestNewBSName(suggestion) {
    console.log(suggestion);
    let parts = suggestion.split('-');
    let year = parts[0];
    let d = (new Date(new_bs_month.value));
    let month = d.toLocaleString('default', { month: 'short' });
    document.getElementById('new_bs_name').value = `${month} ${year}`;

}

function saveBSLocal() {
    if (balanceSheets.filter(bs => bs.name == bsSelected).length > 0) {
        lst_trans.forEach(trans => { trans.saved = true; });
        let bs = balanceSheets.filter(bs => bs.name == bsSelected)[0];
        bs.transactions = lst_trans;
        bs.saved = true;
        return bs;
    }
    return null;
}

function saveNewBalancesheet() {
    // save add lst_trans to balanceSheets if the name is not exists
    // If name already there, update the BS.

    bsSelected = document.getElementById('new_bs_name').value;
    // console.log(lst_trans);

    if (bsSelected && bsSelected != '' && lst_trans && lst_trans.length > 0) {
        if (balanceSheets.filter(bs => bs.name == bsSelected).length > 0) {
            // save existing BS 2

        }
        else {
            // save new BS
            lst_trans.forEach(trans => { trans.saved = true; });
            let newBS = {
                name: bsSelected,
                saved: true,
                transactions: lst_trans
            };
            balanceSheets.push(newBS);
            console.log('BS Saved Locally!');
            saveNewBSToFirebase(newBS, () => {
                console.log('BS Saved in cloud!');
            });
            getBalanceSheets();
            loadBalanceSheet(bsSelected);
            closePopup('savebs-popup');
        }
    }
}

