window.sheetRemoteSelect = {
    name: "Sheet1",
    celldata: [
        {
            r: 3,
            c: 5,
            v: {
                v: "123",
                ct: {
                    fa: "General",
                    t: "n",
                },
                m: "123",
                remoteSelect: {
                    enable: true,
                    onInput: function(value) {
                        return new Promise((resolve, reject) => {
                            console.log("外部收到内部输入框值", value);
                            setTimeout(() => {
                                resolve([]);
                            }, 1000);
                        });
                    },
                    onSelect: function(item) {
                        console.log("外部收到内部选择框值", item);
                    },
                    // 是否需要设定当前输入单元格的值
                    setValue(item) {
                        return item;
                    },
                    popperClass: "demo-remote-select-popper",
                },
            },
        },
    ],
    index: "0",
    zoomRatio: 1,
    order: "0",
    column: 18,
    row: 36,
    status: 1,
    ch_width: 2361,
    rh_height: 936,
    scrollLeft: 0,
    scrollTop: 0,
};
