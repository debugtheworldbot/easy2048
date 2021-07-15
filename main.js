const table1 = document.getElementById("t1");
const table2 = document.getElementById("t2");
const table3 = document.getElementById("t3");

//根据id获取元素： document.getElementById(id)
// 获取元素的第一个子元素：firstElementChild
// 获取下一个同级元素： nextElementSibling
// 删除元素：removeChild(childNode)
// 末级元素内的值：innerHTML或innerText

const getTag = (text) => text.slice(0, 1);
const getCount = (text) => text.slice(1);
const getText = (node) => node.innerText;
const isEqual = (node1, node2) => {
  const nodeText = getText(node1);
  const nextText = getText(node2);
  return (
    getTag(nodeText) === getTag(nextText) &&
    getCount(nodeText) === getCount(nextText)
  );
};

const mergeShortTable = (timeOut) => {
  let rmNodeMap = [];
  const compare = (node) => {
    if (!node) return;
    let nextEle = node.nextElementSibling;
    if (!nextEle) return;
    const nodeText = node.innerText;

    if (isEqual(node, nextEle)) {
      node.innerText = getTag(nodeText) + 2 * parseInt(getCount(nodeText));
      rmNodeMap.push(nextEle);
      nextEle = nextEle.nextElementSibling;
    }
    compare(nextEle);
  };
  const merge = (table) => {
    const oldLength = table.childNodes.length;
    compare(table.firstElementChild);
    rmNodeMap.forEach((n) => table.removeChild(n));
    rmNodeMap = [];
    const newLength = table.childNodes.length;
    const finished = oldLength === newLength;
    if (!timeOut && !finished) {
      merge(table);
    }
    return finished;
  };
  return { merge };
};
const mergeLongTable = () => {
  const childrenList = table3.getElementsByTagName("td");
  const a = [];
  for (let i = 0; i < childrenList.length; i++) {
    a.push(childrenList[i].innerHTML);
  }
  console.log(a);

  const compare = (current) => {
    if (!current) return;
  };
};
function bt1_click() {
  const { merge } = mergeShortTable();
  merge(table1);
  merge(table2);
  mergeLongTable();
}
function bt2_click() {
  let finish = false;
  const interval = (table, timeout) => {
    const id = setInterval(() => {
      const { merge } = mergeShortTable(22);
      const finished = merge(table) || finish;
      if (finished) {
        clearInterval(id);
        finish = true;
      }
    }, timeout);
  };
  interval(table1, 1000);
  interval(table2, 1500);
}
