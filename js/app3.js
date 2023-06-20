// Module for handling data manipulation
const dataModule = (function () {
    const npaRate = 20;
    const data = JSON.parse(localStorage.getItem('data')) || [];

    function getDaysInMonth(month, year) {
        return new Date(year, month, 0).getDate();
    }

    function daysRemainingInMonth(date) {
        let endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        return endDate.getDate() - (date.getDate() - 1);
    }

    return {
        saveData: function (name, salary, npa, dateValue, washing) {
            const obj = {};
            const date = new Date(dateValue);
            const totalDays = daysRemainingInMonth(date);
            obj.name = name.trim();
            obj.salary = Number(salary);
            obj.npa = npa;
            obj.washing = washing;
            obj.salary = salary;
            const npaAmountPerDay = ((obj.salary * npaRate / 100) / getDaysInMonth(date.getMonth() + 1, date.getFullYear())).toFixed(2);
            const basicSalaryPerDay = (salary / getDaysInMonth(date.getMonth() + 1, date.getFullYear())).toFixed(2);
            const washingAllowancePerDay = (150 / getDaysInMonth(date.getMonth() + 1, date.getFullYear())).toFixed(2);
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
            obj.salary = Math.round(totalDays * basicSalaryPerDay);
            obj.totalNPAAmount = (obj.npa === 'yes') ? Math.round(totalDays * npaAmountPerDay) : 0;
            obj.washingAllowance = (obj.washing === 'yes') ? Math.round(totalDays * washingAllowancePerDay) : 0
            obj.daAmount = Math.round(totalDays * daAmountPerDay);
            obj.days = totalDays;
            obj.month = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(date) + "/" + date.getFullYear();
            data.push(obj);
            localStorage.setItem('data', JSON.stringify(data));
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
                salary: document.getElementById('salary').value,
                npa: document.getElementById('npa').value,
                date: document.getElementById('date').value,
                washing: document.getElementById('washing').value,
            };
        },
        addRow: function (entry, index) {
            const row = document.createElement('tr');
            document.getElementById('emp-name').innerText = `Name of Employee : ${entry.name}`;
            row.id = `row-${index}`;
            row.innerHTML = `
                <td></td>
                <td>${entry.month}</td>
                <td>${entry.days}</td>
                <td>${entry.salary}</td>
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

// Main App Module for integrating different modules
const appModule = (function (dataCtrl, uiCtrl) {
    uiCtrl.populateTable();
    document.getElementById('form').addEventListener('submit', function (event) {
        event.preventDefault();
        const inputData = uiCtrl.getDOM();
        const newData = dataCtrl.saveData(inputData.name, inputData.salary, inputData.npa, inputData.date, inputData.washing);
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

function getMonths(startDate, endDate) {
    let years = (new Date(endDate).getFullYear() - new Date(startDate).getFullYear());
    let months = (new Date(endDate).getMonth() - new Date(startDate).getMonth()) + (years * 12) + 1;
    const monthsName = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    let currentMonth = new Date(startDate).getMonth() + 1;
    let currentYear = new Date(startDate).getFullYear();

    let daysInMonth = [];
    for (let i = 0; i < months; i++) {
        if (i === 0) {
            daysInMonth.push(daysRemainingInMonth(new Date(startDate)));
            currentMonth++;
        } else if(i === months - 1) {
            daysInMonth.push(new Date(endDate).getDate());
        } else if (currentMonth === 12) {
            daysInMonth.push(getDaysInMonth(currentMonth, currentYear));
            currentYear++;
            currentMonth = 1;
        } else {
            daysInMonth.push(getDaysInMonth(currentMonth, currentYear));
            currentMonth++;
        }
    }
    return daysInMonth;
}

function getDaysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
}

function daysRemainingInMonth(date) {
    let endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    return endDate.getDate() - (date.getDate() - 1);
}

console.log(getMonths('2020,02,01', '2025,01,12'));