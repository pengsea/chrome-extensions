//循环删除
for (let i = 0,
         len =
             location.pathname.includes('home') ? document.querySelectorAll('.WB_cardwrap.WB_feed_type.S_bg2.WB_feed_like').length :
             location.pathname.includes('profile') ? document.querySelectorAll('.WB_cardwrap.WB_feed_type.S_bg2.WB_feed_like').length :
                 location.pathname.includes('fans') ? document.querySelectorAll('.follow_item.S_line2').length : 0
    ; i < len; i++) {
    setTimeout(batchClick, 2000 * i);
}

function batchClick() {
    if (location.pathname.includes('home')||location.pathname.includes('profile')) {//我的主页
        document.querySelector('a[action-type="fl_menu"]').click();
        document.querySelector('a[title="删除此条微博"]').click();
        document.querySelector('a[action-type="ok"]').click();
    } else if (location.pathname.includes('fans')) {//粉丝
        document.querySelector('div[node-type="layer_menu_list"]').style.display='block';
        document.querySelector('a[action-type="removeFan"]').click();
        document.querySelector('.W_btn_a').click();
    } else {

    }

    chrome.runtime.sendMessage({ type: "trigger" }, function (response) {
        console.log(response.farewell);
    });
}

//@ sourceURL=cycleDeleteWithClick.js