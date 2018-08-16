function getList() {
    let arr = [];
    if (location.pathname.includes('home')||location.pathname.includes('profile')) {//我的主页
        let listItemList = document.querySelectorAll('div[action-type="feed_list_item"]');
        for (let i = 0; i < listItemList.length; i++) {
            let item = listItemList[ i ];
            let mid = item.attributes[ 'mid' ].value;
            let contentText = item.querySelector('div[node-type=feed_list_content]').innerText;
            arr.push({
                mid,
                text: contentText
            })
        }
    } else if (location.pathname.includes('fans')) {//我的粉丝
        let listItemList = document.querySelectorAll('.follow_item.S_line2');
        for (let i = 0, len = listItemList.length; i < len; i++) {
            let item = listItemList[ i ];
            let action = item.attributes[ 'action-data' ].value;
            let actions = action.split('&');
            arr.push({
                mid: actions[ 0 ].split('=')[ 1 ],
                text: actions[ 1 ].split('=')[ 1 ]
            })
        }
    }
    return arr;
}

chrome.runtime.sendMessage({ type: 'getList', data: getList() }, function (response) {
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
        for (let i = 0; i < data.length; i++) {
            // setTimeout(()=>deleteMidItem(data[ i ]), 2000 * i);
            deleteMidItem(data[ i ]);
        }
    } else {
        deleteMidItem(data);
    }
    document.querySelector('.WB_tab_a .S_txt1.S_line1').click();
}

function deleteMidItem(mid) {
    let xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://weibo.com/aj/mblog/del?ajwvr=6');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send(encodeURI('mid=' + mid));
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {//4代表执行完成
            if (xhr.status === 200) {//200代表执行成功
                chrome.runtime.sendMessage({ type: 'deleteMidCallback', data: mid }, function (response) {
                    console.log(response.farewell);
                });

            }
        }
    };
}

//@ sourceURL=getWeiBoList.js