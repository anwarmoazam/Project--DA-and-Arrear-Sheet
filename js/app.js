const npaRate = 20;
const months = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const nameDOM = document.getElementById('name');
const salaryDOM = document.getElementById('salary');
const dateDOM = document.getElementById('date');
const tableBodyData = document.querySelector('tbody');
const tableHeading = document.querySelectorAll('th');
const isNPA = document.getElementById('npa');
const data = []

document.getElementById('input').addEventListener('submit', function (event) {
    event.preventDefault();
    saveData();
    getData(data);
})

function getDaysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
}

function daysRemainingInMonth(date) {
    let endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    return endDate.getDate() - (date.getDate() - 1);
}

function saveData() {
    const obj = {};
    const date = new Date(dateDOM.value);
    const totalDays = daysRemainingInMonth(date);
    obj.name = nameDOM.value.trim();
    obj.salary = Number(salaryDOM.value);
    obj.npa = isNPA.value;
    const npaAmountPerDay = ((obj.salary * npaRate / 100) / getDaysInMonth(date.getMonth() + 1, date.getFullYear())).toFixed(2);
    obj.totalNPAAmount = (obj.npa === 'yes') ? Math.round(totalDays * npaAmountPerDay) : 0;
    obj.days = totalDays;
    obj.month = months[date.getMonth() + 1];
    data.push(obj);
}

function getData(arr) {
    tableBodyData.innerText = "";
    const fragmentDOM = document.createDocumentFragment();
    for (let entry of arr) {
        const tr = document.createElement('tr');
        const nameTd = document.createElement('td');
        const monthTd = document.createElement('td');
        const daysTd = document.createElement('td');
        const npaAmtTd = document.createElement('td');
        nameTd.innerText = entry.name;
        monthTd.innerText = entry.month;
        daysTd.innerText = entry.days;
        npaAmtTd.innerText = entry.totalNPAAmount;
        tr.append(nameTd,monthTd,daysTd,npaAmtTd);
        fragmentDOM.appendChild(tr);
    }
    tableBodyData.appendChild(fragmentDOM);
}