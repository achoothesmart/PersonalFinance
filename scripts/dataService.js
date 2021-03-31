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
        data_el.innerHTML = getData(key);
    });
}

function initData(dataKeyValueObj){
    Object.keys(dataKeyValueObj).forEach(key => {
        setData(key, dataKeyValueObj[key]);
    });
}

function dataKeys(){
    Object.keys(data);
}

/*
module.exports = {
    getData : function(key){
        return data[key];
    },

    setData: function(key, value){
        data[key] = value;
        this.refreshDOM();
    },

    refreshDOM: function(){
        document.querySelectorAll('[data]').forEach(data_el => {
            let key = data_el.getAttribute('data');
            data_el.innerHTML = this.getData(key);
        });
    },

    initData: function(dataKeyValueObj){
        Object.keys(dataKeyValueObj).forEach(key => {
            this.setData(key, dataKeyValueObj[key]);
        });
    },

    dataKeys: function(){
        Object.keys(data);
    }
}

*/