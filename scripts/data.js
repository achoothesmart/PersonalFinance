var data = {};

function getData(key){
	return data[key];
}

function setData(key, value){
    data[key] = value;
    refreshDOM();
}

function refreshDOM(){
    document.querySelectorAll('[data]').forEach(data_el => {
        let key = data_el.getAttribute('data');
        // console.log(key, getData(key));
        data_el.innerHTML = getData(key);
    });
}

function initData(dataKeyValueObj){
    Object.keys(dataKeyValueObj).forEach(key => {
        setData(key, dataKeyValueObj[key]);
    });
}