let changeColor = document.getElementById('changeColor');
let triggerDelete = document.getElementById('triggerDelete');
let getList = document.getElementById('getList');
let getWeiBoList = document.getElementById('getWeiboList');
let weiboList = document.getElementById('weiboList');

chrome.storage.sync.get('color', function (data) {
    changeColor.style.backgroundColor = data.color;
    changeColor.setAttribute('value', data.color);
});
changeColor.onclick = function (element) {
    let color = element.target.value;
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.executeScript(
            tabs[0].id,
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
            tabs[0].id,
            { code: text });
    });
};
getList.onclick = function (element) {
    let text = '.WB_cardwrap.WB_feed_type.S_bg2.WB_feed_like';
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.executeScript(
            tabs[0].id,
            { code: text });
    });
};

getWeiBoList.onclick = function () {
    let text = `let listItemList = document.querySelectorAll('div[action-type="feed_list_item"]');
        let arr = [];
        for(let i = 0; i<listItemList.length; i++){
            let item = listItemList[i];
            let mid = item.attributes['mid'].value;
            let contentText = item.querySelector('div[node-type=feed_list_content]').innerText;
            arr.push({
                mid,
                text:contentText
            })
        };`;
    chromeTabs(text);
}

function draw(data) {
    let str = "";
    data.map((item, index) => {
        str += "<li style='padding-right:50px;'>" + item.text + "<a href='javascript:;' onClick='delWeiBo(" + item.mid + ")'>删除</a></li>";
    })
    weiboList.innerHTML = str;
}

function delWeiBo(mid) {
    alert(mid);
}

function chromeTabs(text) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.executeScript(
            tabs[0].id,
            { code: text });
    });
}