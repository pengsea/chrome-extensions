//循环删除
for (let i = 0, len = document.querySelectorAll('.WB_cardwrap.WB_feed_type.S_bg2.WB_feed_like').length; i < len; i++) {
    setTimeout(batchClick, 2000 * i);
}

function batchClick() {
    document.querySelector('a[action-type="fl_menu"]').click();
    document.querySelector('a[title="删除此条微博"]').click();
    document.querySelector('a[action-type="ok"]').click();

    chrome.runtime.sendMessage({ type: "trigger" }, function (response) {
        console.log(response.farewell);
    });
}
//@ sourceURL=cycleDeleteWithClick.js