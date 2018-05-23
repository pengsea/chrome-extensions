let triggerDelete = document.getElementById('triggerDelete');
let postDelete = document.getElementById('postDelete');
let weiboList = document.getElementById('weiboList');

triggerDelete.onclick = function () {
    chromeTabs('cycleDeleteWithClick.js');
};
postDelete.onclick = function (element) {
};

chromeTabs('getWeiBoList.js');

function draw(data) {
    data.map((item) => {
        let li = document.createElement('li');
        li.style.paddingRight = '50px';
        li.innerText = item.text;
        let a = document.createElement('a');
        a.innerText = '删除';
        a.attributes['mid'] = item.mid;
        a.onclick = () => deleteMid(item.mid);
        li.appendChild(a);
        weiboList.appendChild(li);
    });
}

function deleteMid(mid) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { type: "deleteMid", data: mid }, function (response) {
            console.log(response.farewell);
        });
    });
}

function chromeTabs(file) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.executeScript(
            tabs[0].id,
            { file });
    });
}

let triggerDeleteCount = 0, postDeleteCount = 0;
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log(sender.tab ?
        "from a content script:" + sender.tab.url :
        "from the extension");
    switch (request.type) {
        case 'trigger'://点击删除事件
            triggerDeleteCount++;
            document.getElementById('triggerDeleteCount').innerText = triggerDeleteCount;
            sendResponse({ farewell: "ok" });
            break;
        case 'getList'://获得列表
            draw(request.data);
            break;
        case 'deleteMidCallback'://获得列表
            postDeleteCount++;
            document.getElementById('postDeleteCount').innerText = postDeleteCount;
            sendResponse({ farewell: "ok" });
            break;
        default:
            console.log('错误的类型');
    }
});