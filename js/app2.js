// Module for handling data manipulation
const dataModule = (function () {
    const npaRate = 20;
    const data = [];

    function getDaysInMonth(month, year) {
        return new Date(year, month, 0).getDate();
    }

    function daysRemainingInMonth(date) {
        let endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        return endDate.getDate() - (date.getDate() - 1);
    }

    return {
        saveData: function (name, salary, npa, dateValue) {
            const obj = {};
            const date = new Date(dateValue);
            const totalDays = daysRemainingInMonth(date);
            obj.name = name.trim();
            obj.salary = Number(salary);
            obj.npa = npa;
            const npaAmountPerDay = ((obj.salary * npaRate / 100) / getDaysInMonth(date.getMonth() + 1, date.getFullYear())).toFixed(2);
            obj.totalNPAAmount = (obj.npa === 'yes') ? Math.round(totalDays * npaAmountPerDay) : 0;
            obj.days = totalDays;
            obj.month = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(date);
            data.push(obj);
            localStorage.setItem('data', JSON.stringify(data));
            return obj;
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
                date: document.getElementById('date').value
            };
        },
        addRow: function (entry) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${entry.name}</td>
                <td>${entry.month}</td>
                <td>${entry.days}</td>
                <td>${entry.totalNPAAmount}</td>
            `;
            tableBodyData.appendChild(row);
        },
        populateTable: function () {
            const data = JSON.parse(localStorage.getItem('data')) || [];
            data.forEach(item => {
                this.addRow(item)
            });
        }
    }
})();

// Main App Module for integrating different modules
const appModule = (function (dataCtrl, uiCtrl) {
    uiCtrl.populateTable();
    document.getElementById('input').addEventListener('submit', function (event) {
        event.preventDefault();

        const inputData = uiCtrl.getDOM();
        const newData = dataCtrl.saveData(inputData.name, inputData.salary, inputData.npa, inputData.date);
        console.log(newData);
        uiCtrl.addRow(newData);
    });
})(dataModule, uiModule);