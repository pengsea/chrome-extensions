let changeColor = document.getElementById('changeColor');
let triggerDelete = document.getElementById('triggerDelete');
let getList = document.getElementById('getList');

chrome.storage.sync.get('color', function (data) {
    changeColor.style.backgroundColor = data.color;
    changeColor.setAttribute('value', data.color);
});
changeColor.onclick = function (element) {
    let color = element.target.value;
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.executeScript(
            tabs[ 0 ].id,
            { code: 'document.body.style.backgroundColor = "' + color + '";' });
    });
};
triggerDelete.onclick = function (element) {
    let text = `for (let i=0;i<100;i++){
        setTimeout(function () {
            document.querySelector('a[action-type="fl_menu"]').click();
            document.querySelector('a[title="删除此条微博"]').click();
            document.querySelector('a[action-type="ok"]').click();
        },1000*i);
    }`;
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.executeScript(
            tabs[ 0 ].id,
            { code: text });
    });
};
getList.onclick = function (element) {
    let text= '.WB_cardwrap.WB_feed_type.S_bg2.WB_feed_like';
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.executeScript(
            tabs[ 0 ].id,
            { code: text });
    });
};
