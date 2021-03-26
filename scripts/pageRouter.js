let pages = ['page-home', 'page-transactions', 'page-balancesheet'];

let currentPage = 'page-transactions';

loadDOMPage(currentPage);

function loadDOMPage(page_id){
    let dom_pages = document.querySelectorAll('#pages .page');
    dom_pages.forEach(dom_page => {
        if(dom_page.id == page_id){
            dom_page.classList.remove('hidden');
        }
        else{
            dom_page.classList.add('hidden');
        }
    });
    document.getElementById('page-label').innerText = document.getElementById(page_id).attributes['page-label'].value;
}