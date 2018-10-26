// ============================================
//option说明:
//id  放置组件容器元素的id;
//data  树形结构的数据;
//itemKey  树组件每一项的展示key与data中每一项的key相对照;
//isExpand  初始化是否展开全部;
//loadNode  加载节点的回调函数
// ---------------  -------------------
//data属性结构说明:
//     {
//         label:'xxx',    节点文本
//         id:'xxx',       节点id
//         children:[]     节点下的子节点
//     }
//(1.如果配置项中的isAsync为true的话,children存在即代表有下级节点并生成相应的展开按钮;)
//(2.如果配置项中的isAsync为false的话,children存在并且children的长度大于0即代表有下级节点并生成相应的展开按钮;)
// ----------------------------------
//loadNode回调函数说明:
//      loadNode(nodeData,resolve,reject){
//          $.get("demo_ajax_load.txt", function(result){
//              resolve(result)
//          });
//      }
//参数说明:
//     参数:nodeData
//     类型:Object
//     说明:当前节点的返回数据 {label:'', id:'', children:[]}
//     可选值:_________

//     参数:reslove
//     类型:Function
//     说明:传入需要加载节点的数据(类型必须为Array) [{label:'',id:'',children:[]},{label:'',id:'',children:[]}]
//     可选值:Array

//     参数:reject
//     类型:Function
//     说明:传入加载节点失败的信息
//     可选值:String
// ----------------------------------
// ============================================
(function () {
    class AjaxTree {
        constructor({id, data, itemKey, isExpand, isAsync, loadNode, htmlFormatter}) {
            //指定容器;
            this.contain = document.querySelector(id);
            //节点元素绑定事件
            this.bindSubNode = (bindEl, data) => {
                bindEl.addEventListener('click', (e) => {
                    this.subNode.prototype = data;
                    this.subNode(e);
                });
            };
            //节点事件回调
            this.subNode = (e) => {
                let liEl = e.target.parentNode;
                let childrenData = this.subNode.prototype.children;
                let resultEl = null;
                if (childrenData && childrenData.length > 0) {
                    if (liEl.dataset.expand == 'true') {
                        //收起节点
                        let rmELs = [].filter.call(liEl.children, val => val.tagName == 'UL')
                        for (var i = rmELs.length - 1; i >= 0; i--) {
                            liEl.removeChild(rmELs[i]);
                        }
                        liEl.dataset.expand = 'false';
                    } else {
                        //如果children已有数据则加载默认数据
                        resultEl = this.createunExpandListEls(childrenData);
                        liEl.appendChild(resultEl);
                        liEl.dataset.expand = 'true';
                    }
                } else {
                    liEl.dataset.loading = !liEl.dataset.loading ? 'true' : 'fasle';
                    liEl.dataset.expand = 'true';
                    //节点点击次数限制判断
                    if (liEl.dataset.loading == 'true') {
                        this.loadNode(childrenData, liEl);
                    }
                }

            };
            //加载节点回调
            this.loadNode = (childrenData, el) => {
                if (loadNode && childrenData.length <= 0) {
                    //节点点击次数限制
                    el.dataset.loading = 'false'
                    const nodeData = {
                        label: el.querySelector('span').innerHTML,
                        id: el.dataset.itemId,
                        children: childrenData
                    };
                    new Promise((resolve, reject) => {
                        loadNode(nodeData, resolve, reject);
                    })
                        .then((result) => {
                            delete el.dataset.loading;
                            //缓存数据已加载后的数据
                            childrenData.push(...result);
                            let resultEl = this.createunExpandListEls(result);
                            el.appendChild(resultEl);
                        })
                        .catch((error) => {
                            delete el.dataset.loading;
                            throw new Error(error);
                        })
                }
            };
            //创建未展开状态list数据元素;
            this.createunExpandListEls = (data) => {
                if (data && data.length > 0) {
                    const containEL = document.createElement('ul');
                    data.forEach(val => {
                        const itemEl = document.createElement('li');
                        itemEl.dataset.itemId = val[itemKey.id];
                        //插入自定义Html内容
                        const customHtmlContainer = document.createElement('span');
                        customHtmlContainer.innerHTML = htmlFormatter(val);
                        itemEl.appendChild(customHtmlContainer);
                        //插入自定义Html内容
                        const labelEl = document.createElement('span');
                        labelEl.innerHTML = val[itemKey.label];
                        if (isAsync ? val[itemKey.children] : (val[itemKey.children] && val[itemKey.children].length > 0)) {
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
                    const labelEl = document.createElement('span');
                    labelEl.innerHTML = data[itemKey.label];
                    itemEl.dataset.itemId = data[itemKey.id];
                    //插入自定义Html内容
                    const customHtmlContainer = document.createElement('span');
                    customHtmlContainer.innerHTML = htmlFormatter(data);
                    itemEl.appendChild(customHtmlContainer);
                    //插入自定义Html内容
                    itemEl.appendChild(labelEl);
                    if (isAsync ? data[itemKey.children] : (data[itemKey.children] && data[itemKey.children].length > 0)) {
                        itemEl.dataset.expand = data[itemKey.children].length > 0;
                        const expandBtn = document.createElement('a');
                        this.bindSubNode(expandBtn, data);
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
    window.AjaxTree = AjaxTree;
})(window)

