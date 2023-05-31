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
        },
        getData: function () {
            return data;
        },
        deleteData: function(index){
            data.splice(index,1);
            localStorage.setItem('data',JSON.stringify(data));
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
        addRow: function (entry, index) {
            const row = document.createElement('tr');
            row.id = `row-${index}`;
            row.innerHTML = `
                <td></td>
                <td>${entry.name}</td>
                <td>${entry.month}</td>
                <td>${entry.days}</td>
                <td>${entry.totalNPAAmount}</td>
                <td><button class="delete-btn" data-id="${row.id}">Delete</button></td>
            `;
            tableBodyData.appendChild(row);
        },
        deleteRow: function(id){
            const row = document.getElementById(id);
            tableBodyData.removeChild(row);
        },
        populateTable: function () {
            const data = JSON.parse(localStorage.getItem('data')) || [];
            data.forEach((item, index) => {
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
        const newData = dataCtrl.saveData(inputData.name, inputData.salary, inputData.npa, inputData.date);
        uiCtrl.addRow(newData, dataCtrl.getData().length - 1);
    });
    document.querySelector('tbody').addEventListener('click',function(event){
        if(event.target.classList.contains('delete-btn')){
            const row = event.target.parentElement.parentElement;
            const index = Array.from(row.parentElement.children).indexOf(row);
            uiCtrl.deleteRow(event.target.dataset.id);
            dataCtrl.deleteData(index);
        }
    })
})(dataModule, uiModule);