let listItemList = document.querySelectorAll('div[action-type="feed_list_item"]');
let arr = [];
for (let i = 0; i < listItemList.length; i++) {
    let item = listItemList[ i ];
    let mid = item.attributes[ 'mid' ].value;
    let contentText = item.querySelector('div[node-type=feed_list_content]').innerText;
    arr.push({
        mid,
        text: contentText
    })
}
chrome.runtime.sendMessage({ type: 'getList', data: arr }, function (response) {
    console.log(response.farewell);
});


chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log(sender.tab ?
        "from a content script:" + sender.tab.url :
        "from the extension");
    switch (request.type) {
        case 'deleteMid'://post删除
            deleteMid(request.data);
            break;
        default:
            console.log('错误的类型');
    }
});

function deleteMid(data) {
    if (Array.isArray(data)) {
        for (let item of data) {
            deleteMidItem(item);
        }
    } else {
        deleteMidItem(data);
    }
}

function deleteMidItem(data) {
    let xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://weibo.com/aj/mblog/del?ajwvr=6');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send(encodeURI('mid=' + data));
    xhr.onreadystatechange=()=>{
        if (xhr.readyState === 4) {//4代表执行完成
            if (xhr.status === 200) {//200代表执行成功
                chrome.runtime.sendMessage({ type: 'deleteMidCallback' }, function (response) {
                    console.log(response.farewell);
                });
            }
        }
    };
}
//@ sourceURL=getWeiBoList.js