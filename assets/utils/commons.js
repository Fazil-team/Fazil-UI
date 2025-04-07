export const genQueryParam = (data) => {
    let params = "";
    for (var key in data) {
        params += key + "=" + data[key] + "&";
    }
    return params.substring(0, params.lastIndexOf("&"));
};

export const size2Str = (size) => {
    console.log( '123' ,size >Math.pow(1024, 3), size)
    if (size < 1024) {
        return size + ` B`;
    } else if (size >= 1024 && size < Math.pow(1024, 2)) {
        return parseFloat(size / 1024).toFixed(2) + " KB";
    } else if (size > Math.pow(1024, 2) && size < Math.pow(1024, 3)) {
        return parseFloat(size / Math.pow(1024, 2)).toFixed(2) + " MB";
    } else if (size >= Math.pow(1024, 3) && size < Math.pow(1024, 4)) {
        return parseFloat(size / Math.pow(1024, 3)).toFixed(2) + " GB";
    } else if(size >= Math.pow(1024, 4) && size < Math.pow(1024, 5)) {
        return parseFloat(size / Math.pow(1024, 4)).toFixed(2) + " TB";
    }else if(size >= Math.pow(1024, 5) && size < Math.pow(1024, 6)) {
        return parseFloat(size / Math.pow(1024, 5)).toFixed(2) + " PB";
    }
    else {
        return 0 + " B";
    }
};

export const send_msg = (msg)=>{
    if(window.Notification && Notification.permission !== "denied") {
        Notification.requestPermission(function(status) {
            if (status === "granted") {
                var n = new Notification(msg);
            } else {
                alert(msg);
            }
        });
    }
}
