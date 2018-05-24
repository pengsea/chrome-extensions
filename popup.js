let triggerDelete = document.getElementById('triggerDelete');//事件删除按钮
let postDelete = document.getElementById('postDelete');//接口删除按钮
let weiboList = document.getElementById('weiboList');//列表
let selectAll = document.getElementById('selectAll');//全选
let triggerDeleteCount = 0,
    postDeleteCount = 0,
    weiboSource = [],
    weiboSet = new Set();//删除的条数

triggerDelete.onclick = function () {
    chromeTabs('cycleDeleteWithClick.js');
};
selectAll.onclick = function (element) {
    if (element.target.checked) {//选中
        weiboSource.forEach(item => weiboSet.add(item.mid));
        document.querySelectorAll('#weiboList input').forEach(item => item.checked = true);
    } else {//未选中
        weiboSet = new Set();
        document.querySelectorAll('#weiboList input').forEach(item => item.checked = false);
    }
};
postDelete.onclick = function () {
    deleteMid();
};

chromeTabs('getWeiBoList.js');

function draw(data) {
    data.map((item, index) => {
        let li = document.createElement('li');
        // li.innerText = (index + 1) + ' . ' + item.text;
        li.className = 'mid_' + item.mid;

        let input = document.createElement('input');
        input.attributes[ 'mid' ] = item.mid;
        input.onclick = (e) => changeSet(e, item.mid);
        input.type = 'checkbox';
        li.appendChild(input);
        let div = document.createElement('div');
        div.innerText = (index + 1) + ' . ' + item.text;
        li.appendChild(div);
        // li.insertBefore(input, li.childNodes[ 0 ]);

        weiboList.appendChild(li);
    });
}

function changeSet(e, mid) {
    if (e.target.checked) {
        weiboSet.add(mid);
    } else {
        weiboSet.delete(mid);
    }
}

function deleteMid() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[ 0 ].id, { type: "deleteMid", data: [ ...weiboSet ] }, function (response) {
            console.log(response.farewell);
        });
    });
}

function chromeTabs(file) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.executeScript(
            tabs[ 0 ].id,
            { file });
    });
}

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
            weiboSource = request.data;
            draw(request.data);
            break;
        case 'deleteMidCallback'://获得列表
            postDeleteCount++;
            document.getElementById('postDeleteCount').innerText = postDeleteCount;
            weiboList.removeChild(document.querySelector(`.mid_${request.data}`));
            sendResponse({ farewell: "ok" });
            break;
        default:
            console.log('错误的类型');
    }
});