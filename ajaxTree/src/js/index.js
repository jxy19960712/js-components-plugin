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
            let nodeData = this.subNode.prototype.children;
            let result = this.createunExpandListEls(nodeData);
            if(nodeData&&nodeData.length>0){
                e.target.parentNode.appendChild(result);
            }
        };
        //创建未展开状态list数据元素;
        this.createunExpandListEls = (data, containElName, itemElName) => {
            if (data && data.length > 0) {
                const containEL = document.createElement('ul');
                data.forEach(val => {
                    const itemEl = document.createElement('li');
                    itemEl.dataset.itemId = val[itemKey.id];
                    const expandBtn = document.createElement('a');
                    const labelEl = document.createElement('span');
                    labelEl.innerHTML = val[itemKey.label];
                    this.bindSubNode(expandBtn, val);
                    itemEl.appendChild(labelEl);
                    itemEl.appendChild(expandBtn);
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
                expandBtn.addEventListener('click', (e) => {
                    this.subNode.prototype = data;
                    this.subNode(e);
                });
                this.bindSubNode(expandBtn, data);


                labelEl.innerHTML = data[itemKey.label];
                itemEl.dataset.itemId = data[itemKey.id];
                itemEl.appendChild(labelEl);
                if (data[itemKey.children] && data[itemKey.children].length > 0) {
                    itemEl.appendChild(expandBtn);
                    itemEl.appendChild(this.createExpandedListEls(data[itemKey.children]));
                }
                return itemEl
            }
        };


        //推送到指定容器;
        let result = null;
        if (isExpand) {
            result = this.createExpandedListEls(data);
        } else {
            result = this.createunExpandListEls(data);
        }
        this.contain.appendChild(result);
    };
    getType(obj) {
        const type = Object.prototype.toString.call(obj);
        if (type == '[object Array]') return 'Array'
        else if (type == '[object Object]') return 'Object'
        else return 'param'
    };
};

