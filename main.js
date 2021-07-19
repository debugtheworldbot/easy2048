const table1 = document.getElementById("t1");
const table2 = document.getElementById("t2");
const table3 = document.getElementById("t3");
const tdStatus = document.getElementById("t3_status");

// 工具函数
const getTag = (text) => text.slice(0, 1);
const getCount = (text) => text.slice(1);
const getTagAndCount = (text) => ({ tag: getTag(text), count: getCount(text) });
const getText = (node) => node.innerText;

const canMerge = (left, right) => {
  if (!right) return false;
  const { tag: lTag, count: lCount } = getTagAndCount(left);
  const { tag: rTag, count: rCount } = getTagAndCount(right);
  const isEqual = lTag === rTag && lCount === rCount;
  return isEqual ? lTag + 2 * parseInt(lCount) : false;
};
const mergeTable = (table, timeout, isLongTable) => {
  const childrenList = table.getElementsByTagName("td");
  const initArr = [];
  for (let i = 0; i < childrenList.length; i++) {
    initArr.push(childrenList[i].innerHTML);
  }
  const { result, finish } = isLongTable
    ? calcResult(calcLong(initArr, timeout), timeout)
    : calcResult(initArr, timeout);
  const tdArr = [];
  result.forEach((r) => {
    const td = document.createElement("td");
    td.innerHTML = r;
    tdArr.push(td);
  });
  const newTable = document.createElement("tr");
  tdArr.forEach((td) => newTable.appendChild(td));
  const id = table.getAttribute("id");
  newTable.setAttribute("id", id);
  table.replaceWith(newTable);
  return finish;
};
const calcResult = (result, timeout) => {
  for (let i = 0; i < result.length; i++) {
    const current = result[i];
    const next = result[i + 1];
    if (!next) {
      return { result, finish: true };
    }
    const rr = canMerge(current, next);
    if (!!rr) {
      result.splice(i + 1, 1);
      result[i] = rr;
      return timeout ? { result, finish: false } : calcResult(result);
    }
  }
};
const calcLong = (result, timeout) => {
  let mergable = false;
  for (let i = 0; i < result.length; i++) {
    const current = result[i];
    const next = result[i + 1];
    if (!next) {
      return result;
    }
    const rr = canMerge(current, next);
    if (!!rr) {
      mergable = true;
      result.splice(i + 1, 1);
      result[i] = rr;
    }
  }
  return mergable ? calcLong(result) : result;
};
function bt1_click() {
  mergeTable(document.getElementById("t1"));
  mergeTable(document.getElementById("t2"));
  mergeTable(document.getElementById("t3"), undefined, true);
}
function bt2_click() {
  let finished = false;
  const interval = (tableId, timeout, isThrid) => {
    const id = setInterval(() => {
      const finish = mergeTable(document.getElementById(tableId), timeout);
      if (isThrid) {
        finished = finished || finish;
        if (finished) {
          clearInterval(id);
          tdStatus.innerHTML = "已完成";
        }
      } else if (finish) {
        clearInterval(id);
        finished = true;
      }
    }, timeout);
  };
  interval("t1", 1000);
  interval("t2", 1500);
  interval("t3", 2000, true);
}
