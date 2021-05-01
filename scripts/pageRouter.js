let pages = ['page-home', 'page-balancesheets', 'page-transactions'];

let currentPage = 'page-balancesheets';

loadDOMPage(currentPage);

function loadDOMPage(page_id, page_title = '') {
    try {
        let dom_pages = document.querySelectorAll('#pages .page');
        dom_pages.forEach(dom_page => {
            if (dom_page.id == page_id) {
                dom_page.classList.remove('hidden');
            }
            else {
                dom_page.classList.add('hidden');
            }
        });

        if(page_title && page_title != ''){
            document.getElementById('page-label').innerText = page_title;
        }
        else{
            document.getElementById('page-label').innerText = document.getElementById(page_id).attributes['page-label'].value;
        }
        onPageLoad(page_id);
    }
    catch { }
}

function onPageLoad(page_id){
    switch(page_id){
        case 'page-balancesheets':
            loadBalanceSheets('balance-sheets', balanceSheets);
            break;
    }
}
