// Module for handling data manipulation
const dataModule = (function () {
    const npaRate = 20;
    const da = {}
    const data = JSON.parse(localStorage.getItem('data')) || [];

    function getDaysInMonth(month, year) {
        return new Date(year, month, 0).getDate();
    }

    function daysRemainingInMonth(date) {
        let endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        return endDate.getDate() - (date.getDate() - 1);
    }

    function getCurrentMonthAndYear(startDate, endDate) {
        let years = (new Date(endDate).getFullYear() - new Date(startDate).getFullYear());
        let months = (new Date(endDate).getMonth() - new Date(startDate).getMonth()) + (years * 12) + 1;
        const monthsName = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

        let currentMonth = new Date(startDate).getMonth() + 1;
        let currentYear = new Date(startDate).getFullYear();

        let monthAndYear = [];
        for (let i = 0; i < months; i++) {
            let currentMonthAndYear = {};
            if (i === 0) {
                currentMonthAndYear.monthAndYear = monthsName[currentMonth] + "/" + currentYear;
                currentMonthAndYear.days = daysRemainingInMonth(new Date(startDate));
                currentMonth++;
            } else if (i === months - 1) {
                currentMonthAndYear.monthAndYear = monthsName[currentMonth] + "/" + currentYear;
                currentMonthAndYear.days = new Date(endDate).getDate();
            } else if (currentMonth === 12) {
                currentMonthAndYear.monthAndYear = monthsName[currentMonth] + "/" + currentYear;
                currentMonthAndYear.days = getDaysInMonth(currentMonth, currentYear);
                currentYear++;
                currentMonth = 1;
            } else {
                currentMonthAndYear.monthAndYear = monthsName[currentMonth] + "/" + currentYear;
                currentMonthAndYear.days = getDaysInMonth(currentMonth, currentYear);
                currentMonth++;
            }
            monthAndYear.push(currentMonthAndYear);
        }
        return monthAndYear;
    }

    return {
        saveData: function (name, designation, empId, salary, npa, washing, fromDate, toDate) {
            const obj = {};
            const date = new Date(fromDate);
            const totalDays = daysRemainingInMonth(date);
            const totalData = getCurrentMonthAndYear(fromDate, toDate);
            console.log(totalData);
            for (let month of totalData) {
                console.log(month.monthAndYear);
                console.log(month.days);
            }
            obj.name = name.trim();
            obj.designation = designation.trim();
            obj.empId = empId.trim();
            obj.salary = Number(salary);
            obj.npa = npa;
            obj.washing = washing;
            obj.fromDate = fromDate;
            obj.toDate = toDate;
            obj.salary = salary;
            obj.arear = {};
            let paid = [];
            const npaAmountPerDay = ((obj.salary * npaRate / 100) / getDaysInMonth(date.getMonth() + 1, date.getFullYear())).toFixed(2);
            const basicSalaryPerDay = (salary / getDaysInMonth(date.getMonth() + 1, date.getFullYear())).toFixed(2);
            const washingAllowancePerDay = (150 / getDaysInMonth(date.getMonth() + 1, date.getFullYear())).toFixed(2);
            /*
            paid : [{
                month : 'January/2017',
                days : 29,
                basicAmt : 25000,
                npaAmt : 1000,
                washingAmt : 100,
                daAmt : 5000,
                totalAmt : 30000
            }],*/
            for (let month of totalData) {
                let obj = {};
                obj.month = month.monthAndYear;
                obj.days = month.days;
                obj.basicAmt = Math.round(this.days * basicSalaryPerDay);
                obj.npaAmt = (this.npa === 'yes') ? Math.round(this.days * npaAmountPerDay) : 0;
                obj.washingAmt = (this.washing === 'yes') ? Math.round(this.days * washingAllowancePerDay) : 0;
                obj.totalPaid = this.basicAmt + this.npaAmt + this.washingAmt;
                paid.push(obj);
            }
            obj.arear.paid = paid;
            obj.washingAllowance = washing;
            let daAmountPerDay;
            if (date >= new Date(2017, 00, 01) && date <= new Date(2017, 05, 30)) {
                daAmountPerDay = ((obj.salary * 4 / 100) / getDaysInMonth(date.getMonth() + 1, date.getFullYear())).toFixed(2);
            } else if (date >= new Date(2017, 06, 01) && date <= new Date(2017, 11, 31)) {
                daAmountPerDay = ((obj.salary * 5 / 100) / getDaysInMonth(date.getMonth() + 1, date.getFullYear())).toFixed(2);
            } else if (date >= new Date(2018, 00, 01) && date <= new Date(2018, 05, 30)) {
                daAmountPerDay = ((obj.salary * 7 / 100) / getDaysInMonth(date.getMonth() + 1, date.getFullYear())).toFixed(2);
            } else if (date >= new Date(2018, 06, 01) && date <= new Date(2018, 11, 31)) {
                daAmountPerDay = ((obj.salary * 9 / 100) / getDaysInMonth(date.getMonth() + 1, date.getFullYear())).toFixed(2);
            } else if (date >= new Date(2019, 00, 01) && date <= new Date(2019, 05, 30)) {
                daAmountPerDay = ((obj.salary * 12 / 100) / getDaysInMonth(date.getMonth() + 1, date.getFullYear())).toFixed(2);
            } else if (date >= new Date(2019, 06, 01) && date <= new Date(2021, 05, 30)) {
                daAmountPerDay = ((obj.salary * 17 / 100) / getDaysInMonth(date.getMonth() + 1, date.getFullYear())).toFixed(2);
            } else if (date >= new Date(2021, 06, 01) && date <= new Date(2021, 11, 31)) {
                daAmountPerDay = ((obj.salary * 31 / 100) / getDaysInMonth(date.getMonth() + 1, date.getFullYear())).toFixed(2);
            } else if (date >= new Date(2022, 00, 01) && date <= new Date(2022, 05, 30)) {
                daAmountPerDay = ((obj.salary * 34 / 100) / getDaysInMonth(date.getMonth() + 1, date.getFullYear())).toFixed(2);
            } else if (date >= new Date(2022, 06, 01) && date <= new Date(2022, 11, 31)) {
                daAmountPerDay = ((obj.salary * 38 / 100) / getDaysInMonth(date.getMonth() + 1, date.getFullYear())).toFixed(2);
            } else if (date >= new Date(2023, 00, 01) && date <= new Date(2023, 05, 30)) {
                daAmountPerDay = ((obj.salary * 42 / 100) / getDaysInMonth(date.getMonth() + 1, date.getFullYear())).toFixed(2);
            }
            // obj.salary = Math.round(totalDays * basicSalaryPerDay);
            // obj.totalNPAAmount = (obj.npa === 'yes') ? Math.round(totalDays * npaAmountPerDay) : 0;
            obj.washingAllowance = (obj.washing === 'yes') ? Math.round(totalDays * washingAllowancePerDay) : 0
            obj.daAmount = Math.round(totalDays * daAmountPerDay);
            obj.days = totalDays;
            // obj.month = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(date) + "/" + date.getFullYear();
            // obj.month = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(date) + "/" + date.getFullYear();
            data.push(obj);
            localStorage.setItem('data', JSON.stringify(data));
            console.log(obj);
            return obj;
        },
        getData: function () {
            return data;
        },
        deleteData: function (index) {
            data.splice(index, 1);
            localStorage.setItem('data', JSON.stringify(data));
        }
    }
})();

// Module for handling UI related tasks
const uiModule = (function () {
    const tableBodyData = document.querySelector('tbody');

    return {
        getDOM: function () {
            return {
                name: document.getElementById('name').value,
                designation: document.getElementById('designation').value,
                empId: document.getElementById('empId').value,
                salary: document.getElementById('salary').value,
                npa: document.getElementById('npa').value,
                washing: document.getElementById('washing').value,
                fromDate: document.getElementById('fromDate').value,
                toDate: document.getElementById('toDate').value,
            };
        },
        addRow: function (entry, index) {
            const row = document.createElement('tr');
            document.getElementById('name').innerText = `Name of Employee : ${entry.name}`;
            row.id = `row-${index}`;
            row.innerHTML = `
            <td></td>
            <td>${entry.month}</td>
            <td>${entry.days}</td>
            <td><input type="number">${entry.salary}</td>
            <td>${entry.totalNPAAmount}</td>
            <td>${entry.washingAllowance}</td>
            <td>${entry.daAmount}</td>
            <td>${entry.salary + entry.daAmount + entry.totalNPAAmount + entry.washingAllowance}</td>
            <td><button class="delete-btn" data-id="${row.id}">Delete</button></td>
            `;
            tableBodyData.appendChild(row);
        },
        deleteRow: function (id) {
            const row = document.getElementById(id);
            tableBodyData.removeChild(row);
        },
        populateTable: function () {
            const data = JSON.parse(localStorage.getItem('data')) || [];
            data.forEach((item, index) => {
                console.log(item, index);
                this.addRow(item, index);
            });
        }
    }
})();

console.log(uiModule.getDOM());

// Main App Module for integrating different modules
const appModule = (function (dataCtrl, uiCtrl) {
    uiCtrl.populateTable();
    document.getElementById('form').addEventListener('submit', function (event) {
        event.preventDefault();
        const inputData = uiCtrl.getDOM();
        console.log(inputData);
        const newData = dataCtrl.saveData(inputData.name, inputData.designation, inputData.empId, inputData.salary, inputData.npa, inputData.washing, inputData.fromDate, inputData.toDate);
        console.log(newData);
        uiCtrl.addRow(newData, dataCtrl.getData().length - 1);
    });
    document.querySelector('tbody').addEventListener('click', function (event) {
        if (event.target.classList.contains('delete-btn')) {
            const row = event.target.parentElement.parentElement;
            const index = Array.from(row.parentElement.children).indexOf(row);
            uiCtrl.deleteRow(event.target.dataset.id);
            dataCtrl.deleteData(index);
        }
    })
})(dataModule, uiModule);



function getDaysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
}

function daysRemainingInMonth(date) {
    let endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    return endDate.getDate() - (date.getDate() - 1);
}


/*
let obj = {
    name : 'Anwar Moazam',
    designation : 'Data Entry Operator',
    empId : 'PALAM14456',
    fromDate : 'dateFrom',
    toDate : 'toDate',
    npa : 'yes',
    washing : 'yes',
    arear : {
        paid : [{
            month : 'January/2017',
            days : 29,
            basicAmt : 25000,
            npaAmt : 1000,
            washingAmt : 100,
            daAmt : 5000,
            totalAmt : 30000
        }],
        toBePaid : [{
            month : 'January/2017',
            days : 29,
            basicAmt : 25000,
            npaAmt : 1000,
            washingAmt : 100,
            daAmt : 5000,
            totalAmt : 30000
        }]
    }
}
*/
