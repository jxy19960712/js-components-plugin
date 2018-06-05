// ============================================
//option说明:
//id  放置组件容器元素的id;
//data  树形结构的数据;
//itemKey  树组件每一项的展示key与data中每一项的key相对照;
//isExpand  初始化是否展开全部;
// ============================================
class AjaxTree {
    constructor({id, data, itemKey, isExpand}) {
        //指定容器;
        this.contain = document.querySelector(id);
        //节点元素绑定事件
        this.bindSubNode = (bindEl, data) => {
            bindEl.addEventListener('click', (e) => {
                this.subNode.prototype = data;
                this.subNode(e);
            });
        }
        //节点事件
        this.subNode = (e) => {
            let liEl = e.target.parentNode;
            let nodeData = this.subNode.prototype.children;
            let resultEl = null;
            if (nodeData && nodeData.length > 0) {
                if (liEl.dataset.expand == 'true') {
                    let rmELs = liEl.getElementsByTagName('ul');
                    for (let i = 0; i < rmELs.length; i++) {
                        debugger
                        liEl.removeChild(rmELs[i]);
                    }
                    liEl.dataset.expand = false;
                } else {
                    resultEl = this.createunExpandListEls(nodeData);
                    liEl.appendChild(resultEl);
                    liEl.dataset.expand = true;
                }
            }
        };
        //创建未展开状态list数据元素;
        this.createunExpandListEls = (data) => {
            if (data && data.length > 0) {
                const containEL = document.createElement('ul');
                data.forEach(val => {
                    const itemEl = document.createElement('li');
                    itemEl.dataset.itemId = val[itemKey.id];
                    const labelEl = document.createElement('span');
                    labelEl.innerHTML = val[itemKey.label];
                    if (val.children && val.children.length > 0) {
                        itemEl.dataset.expand = false;
                        const expandBtn = document.createElement('a');
                        this.bindSubNode(expandBtn, val);
                        itemEl.appendChild(expandBtn);
                    }
                    itemEl.appendChild(labelEl);
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
                const itemEl = document.createElement('li');
                const expandBtn = document.createElement('a');
                const labelEl = document.createElement('span');
                this.bindSubNode(expandBtn, data);
                labelEl.innerHTML = data[itemKey.label];
                itemEl.dataset.itemId = data[itemKey.id];
                itemEl.appendChild(labelEl);
                if (data[itemKey.children] && data[itemKey.children].length > 0) {
                    itemEl.dataset.expand = true;
                    itemEl.appendChild(expandBtn);
                    itemEl.appendChild(this.createExpandedListEls(data[itemKey.children]));
                }
                return itemEl
            }
        };
        //推送到指定容器;
        let resultEl = null;
        if (isExpand) {
            resultEl = this.createExpandedListEls(data);
        } else {
            resultEl = this.createunExpandListEls(data);
        }
        this.contain.appendChild(resultEl);
    };

    getType(obj) {
        const type = Object.prototype.toString.call(obj);
        if (type == '[object Array]') return 'Array'
        else if (type == '[object Object]') return 'Object'
        else return 'param'
    };
};

