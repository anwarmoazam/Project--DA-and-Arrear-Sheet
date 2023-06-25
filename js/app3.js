// Module for handling data manipulation
const dataModule = (function () {
    const npaRate = 20;
    const daRate = {}
    const data = JSON.parse(localStorage.getItem('data')) || {};
    const monthsName = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];


    function getDaysInMonth(month, year) {
        return new Date(year, month, 0).getDate();
    }

    function daysRemainingInMonth(date) {
        let endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        return endDate.getDate() - (date.getDate() - 1);
    }

    function getArrearRate(date) {
        let daRate = 0;
        date = new Date(date);
        if (date >= new Date(2017, 0, 1) && date <= new Date(2017, 5, 30)) {
            daRate = 4;
        } else if (date >= new Date(2017, 6, 1) && date <= new Date(2017, 11, 31)) {
            daRate = 5;
        } else if (date >= new Date(2018, 0, 1) && date <= new Date(2018, 5, 30)) {
            daRate = 7;
        } else if (date >= new Date(2018, 6, 1) && date <= new Date(2018, 11, 31)) {
            daRate = 9;
        } else if (date >= new Date(2019, 0, 1) && date <= new Date(2019, 5, 30)) {
            daRate = 12;
        } else if (date >= new Date(2019, 6, 1) && date <= new Date(2021, 5, 30)) {
            daRate = 17;
        } else if (date >= new Date(2021, 6, 1) && date <= new Date(2021, 11, 31)) {
            daRate = 31;
        } else if (date >= new Date(2022, 0, 1) && date <= new Date(2022, 5, 30)) {
            daRate = 34;
        } else if (date >= new Date(2022, 6, 1) && date <= new Date(2022, 11, 31)) {
            daRate = 38;
        } else if (date >= new Date(2023, 0, 1) && date <= new Date(2023, 5, 30)) {
            daRate = 42;
        }
        return daRate;
    }

    function getCurrentMonthAndYear(startDate, endDate) {
        let years = (new Date(endDate).getFullYear() - new Date(startDate).getFullYear());
        let months = (new Date(endDate).getMonth() - new Date(startDate).getMonth()) + (years * 12) + 1;

        let currentMonth = new Date(startDate).getMonth() + 1;
        let currentYear = new Date(startDate).getFullYear();

        let monthAndYear = [];
        for (let i = 0; i < months; i++) {
            let currentMonthAndYear = {};
            if (i === 0) {
                currentMonthAndYear.date = new Date(startDate).getDate();
                currentMonthAndYear.month = currentMonth;
                currentMonthAndYear.year = currentYear;
                currentMonthAndYear.days = daysRemainingInMonth(new Date(startDate));
                currentMonth++;
            } else if (i === months - 1) {
                currentMonthAndYear.date = new Date(endDate).getDate();
                currentMonthAndYear.month = currentMonth;
                currentMonthAndYear.year = currentYear;
                currentMonthAndYear.days = new Date(endDate).getDate();
            } else if (currentMonth === 12) {
                currentMonthAndYear.date = 1;
                currentMonthAndYear.month = currentMonth;
                currentMonthAndYear.year = currentYear;
                currentMonthAndYear.days = getDaysInMonth(currentMonth, currentYear);
                currentYear++;
                currentMonth = 1;
            } else {
                currentMonthAndYear.date = 1;
                currentMonthAndYear.month = currentMonth;
                currentMonthAndYear.year = currentYear;
                currentMonthAndYear.days = getDaysInMonth(currentMonth, currentYear);
                currentMonth++;
            }
            monthAndYear.push(currentMonthAndYear);
        }
        return monthAndYear;
    }

    return {
        saveData: function (name, designation, empId, salary, npa, washing, fromDate, toDate) {
            const totalData = getCurrentMonthAndYear(fromDate, toDate);
            data.name = name.trim();
            data.designation = designation.trim();
            data.empId = empId.trim();
            data.salary = salary;
            data.npaAllowance = npa;
            data.washingAllowance = washing;
            data.fromDate = fromDate;
            data.toDate = toDate;
            data.salary = salary;
            data.arear = {};
            let paid = [];
            for (let month of totalData) {
                const basicSalaryPerDay = (salary / getDaysInMonth(month.month, month.year)).toFixed(2);
                const npaAmountPerDay = (salary * npaRate / 100) / (getDaysInMonth(month.month, month.year));
                const washingAmountPerDay = 150 / (getDaysInMonth(month.month, month.year));
                const date = month.year + "," + month.month + "," + 1;
                month.basicSalary = Math.round(basicSalaryPerDay * month.days);
                data.npaAllowance === 'yes' ? month.npaAmount = Math.round(npaAmountPerDay * month.days) : 0;
                data.washingAllowance === 'yes' ? month.washingAmount = Math.round(washingAmountPerDay * month.days) : 0;
                month.totalAmount = month.basicSalary + (month.npaAmount || 0) + (month.washingAmount || 0);
                month.daAmount = Math.round(month.basicSalary * getArrearRate(date) / 100);
                paid.push(month);
            }
            data.arear.paid = paid;

            localStorage.setItem('data', JSON.stringify(data));
            return data;
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
    const tableHeadData = document.querySelector('tHead');
    const tableBodyData = document.querySelector('tbody');

    function getTableData(obj){
        const row = document.createElement('tr');
    }

    return {
        getDOM: function () {
            return {
                name: document.getElementById('name').value,
                designation: document.getElementById('designation').value,
                empId: document.getElementById('empId').value,
                salary: Number(document.getElementById('salary').value),
                npa: document.getElementById('npa').value,
                washing: document.getElementById('washing').value,
                fromDate: document.getElementById('fromDate').value,
                toDate: document.getElementById('toDate').value,
            };
        },
        addRow: function (entry,index) {
            console.log(entry);
            const tableHeading = document.createElement('tr');
            let heading = "";
            if (entry.npaAllowance === 'yes' && entry.washingAllowance === 'no') {
                heading = `<th>S.No.</th><th>Month/Year</th><th>Days</th><th>Basic Amount</th><th>NPA Amount</th><th>DA Amount</th><th>Total</th><th>Actions</th>`;
                tableHeading.innerHTML = heading;
                let tableData = getTableData(entry.arear.paid);
            } else if (entry.washingAllowance === 'yes' && entry.npaAllowance === 'no') {
                heading = `<th>S.No.</th><th>Month/Year</th><th>Days</th><th>Basic Amount</th><th>Washing Allowance Amount</th><th>DA Amount</th><th>Total</th><th>Actions</th>`;
                tableHeading.innerHTML = heading;
            } else if (entry.npaAllowance === 'yes' && entry.washingAllowance === 'yes') {
                heading = `<th>S.No.</th><th>Month/Year</th><th>Days</th><th>Basic Amount</th><th>NPA Amount</th><th>Washing Allowance Amount</th><th>DA Amount</th><th>Total</th><th>Actions</th>`;
                tableHeading.innerHTML = heading;
            } else {
                heading = `<th>S.No.</th><th>Month/Year</th><th>Days</th><th>Basic Amount</th><th>DA Amount</th><th>Total</th><th>Actions</th>`;
                tableHeading.innerHTML = heading;
            }
            tableHeadData.appendChild(tableHeading);
            console.log(tableHeading.childNodes);
        },
        // addRow: function (entry, index) {
        //     const row = document.createElement('tr');

        //     // document.getElementById('emp-detail').innerText = `Name of Employee : ${entry.name} | Designation : ${entry.designation} | Employee ID : ${entry.empId}`;
        //     for (let rowData of entry.arear.paid) {
        //         console.log(row, rowData.index);
        //         row.id = `row-${index}`;
        //         row.innerHTML = `
        //         <td></td>
        //         <td>${rowData.month} / ${rowData.year}</td>
        //         <td>${entry.days}</td>
        //         <td><input type="number" placeholder=${entry.salary}></td>
        //         <td>${entry.totalNPAAmount}</td>
        //         <td>${entry.washingAllowance}</td>
        //         <td>${entry.daAmount}</td>
        //         <td>${entry.salary + entry.daAmount + entry.totalNPAAmount + entry.washingAllowance}</td>
        //         <td><button class="delete-btn" data-id="${row.id}">Delete</button></td>
        //         `;
        //     }
        //     tableBodyData.appendChild(row);
        // },
        deleteRow: function (id) {
            const row = document.getElementById(id);
            tableBodyData.removeChild(row);
        },
        populateTable: function () {
            const data = JSON.parse(localStorage.getItem('data')) || {};
            // data.forEach((item, index) => {
            //     console.log(item, index);
            //     this.addRow(item, index);
            // });
        }
    }
})();

// Main App Module for integrating different modules
const appModule = (function (dataCtrl, uiCtrl) {
    uiCtrl.populateTable();
    document.getElementById('form').addEventListener('submit', function (event) {
        event.preventDefault();
        const inputData = uiCtrl.getDOM();
        const newData = dataCtrl.saveData(inputData.name, inputData.designation, inputData.empId, inputData.salary, inputData.npa, inputData.washing, inputData.fromDate, inputData.toDate);
        console.log(newData);
        // uiCtrl.addHeading(newData);
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

