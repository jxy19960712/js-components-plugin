class AjaxTree {
    constructor({id, data, itemKey, isExpand}) {
        //指定容器;
        this.contain = document.querySelector(id);
        //创建未展开状态list数据元素;
        this.createunExpandListEls = (list, containElName, itemElName, callback) => {
            if (list && list.length > 0) {
                const containEL = document.createElement(containElName);
                list.forEach(val => {
                    const itemEl = document.createElement(itemElName);
                    callback(val, itemEl)
                    containEL.appendChild(itemEl);
                });
                return containEL;
            } else {
                return
            }
        };
        //创建展开状态list数据元素;
        this.createExpandedListEls = (data) => {
            const type = this.getType(data)
            if (type == 'Array') {
                let resultEl = document.createElement('ul');

                for (let i = 0; i < data.length; i++) {
                    resultEl.appendChild(this.createExpandedListEls(data[i]))
                }
                return resultEl
            }
            else if (type == 'Object') {
                let itemEl = document.createElement('li');
                let expandBtn = document.createElement('a');
                let labelEl = document.createElement('span');
                for (let key in data) {
                    if (key == 'value') {
                        labelEl.innerHTML = data[key];
                        itemEl.appendChild(labelEl);
                        itemEl.appendChild(expandBtn);
                    }
                    else if (key == 'nodeCode') {
                        itemEl.dataset.itemId = data[key];
                    } else {
                        itemEl.appendChild(this.createExpandedListEls(data[key]))
                    }
                }
                return itemEl
            }
        }
        //推送到指定容器;
        var result = null;
        if (isExpand) {
            result = this.createExpandedListEls(data);
        } else {
            result = this.createunExpandListEls(data, 'ul', 'li', (val, itemEl) => {
                itemEl.dataset.itemId = val[itemKey.id];
                const expandBtn = document.createElement('a');
                const labelEl = document.createElement('span');
                labelEl.innerHTML = val[itemKey.label];
                itemEl.appendChild(labelEl);
                itemEl.appendChild(expandBtn);
            });
        }
        this.contain.appendChild(result);
        
    };
    getType(obj) {
        const type = Object.prototype.toString.call(obj);
        if (type == '[object Array]') return 'Array'
        else if (type == '[object Object]') return 'Object'
        else return 'param'
    }
};

let ajaxTree = new AjaxTree({
    id: '#ajaxTree',
    data: [
        {
            value: 'data1',
            nodeCode: '0',
            children: [
                {
                    value: 'data1-1',
                    nodeCode: '00',
                    children: [
                        {
                            value: 'data1-1-1',
                            nodeCode: '00'
                        },
                        {
                            value: 'data1-2-1',
                            nodeCode: '01'
                        },
                    ]
                },
                {
                    value: 'data1-2',
                    nodeCode: '01'
                },
            ]
        },
        {
            value: 'data2',
            nodeCode: '1',
            children: [
                {
                    value: 'data2-1',
                    nodeCode: '00'
                },
                {
                    value: 'data2-2',
                    nodeCode: '01'
                },
            ]
        },
        {
            value: 'data3',
            nodeCode: '2'
        },
        {
            value: 'data4',
            nodeCode: '3'
        },
        {
            value: 'data5',
            nodeCode: '4'
        }
    ],
    itemKey: {
        label: 'value',
        id: 'nodeCode',
    },
    isExpand:true
});