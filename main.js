const table1 = document.getElementById("t1");
const table2 = document.getElementById("t2");
const table3 = document.getElementById("t3");

const getTag = (text) => text.slice(0, 1);
const getCount = (text) => text.slice(1);
const getTagAndCount = (text) => ({ tag: getTag(text), count: getCount(text) });
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
const canMerge = (left, right) => {
  if (!right) return false;
  const { tag: lTag, count: lCount } = getTagAndCount(left);
  const { tag: rTag, count: rCount } = getTagAndCount(right);
  const isEqual = lTag === rTag && lCount === rCount;
  return isEqual ? lTag + 2 * parseInt(lCount) : false;
};
const mergeLongTable = () => {
  const childrenList = table3.getElementsByTagName("td");
  const initArr = [];
  for (let i = 0; i < childrenList.length; i++) {
    initArr.push(childrenList[i].innerHTML);
  }
  const result = calcResult(initArr);
  const tdArr = [];
  result.forEach((r) => {
    const td = document.createElement("td");
    td.innerHTML = r;
    tdArr.push(td);
  });
  const newTable = document.createElement("tr");
  tdArr.forEach((td) => newTable.appendChild(td));
  table3.replaceWith(newTable);
};
const calcResult = (result) => {
  const res = [];
  let mergable = false;
  for (let i = 0; i < result.length; i++) {
    const current = result[i];
    const next = result[i + 1];
    if (!next) {
      res.push(current);
      break;
    }
    const rr = canMerge(current, next);
    if (!!rr) {
      mergable = true;
      res.push(rr);
    } else {
      res.push(current, next);
    }
    i += 1;
  }
  return mergable ? calcResult(res) : res;
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
