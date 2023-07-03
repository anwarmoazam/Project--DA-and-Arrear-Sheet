// Module for handling data manipulation
const dataModule = (function () {
    const npaRate = 20;
    const daRate = {}
    const data = JSON.parse(localStorage.getItem('data')) || {};


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
            let toBePaid = [], alreadyPaid = [];
            for (let month of totalData) {
                const basicSalaryPerDay = (salary / getDaysInMonth(month.month, month.year)).toFixed(2);
                const npaAmountPerDay = (salary * npaRate / 100) / (getDaysInMonth(month.month, month.year));
                const washingAmountPerDay = 150 / (getDaysInMonth(month.month, month.year));
                const date = month.year + "," + month.month + "," + 1;
                let surrender = {};
                console.log(month);
                month.basicSalary = Math.round(basicSalaryPerDay * month.days);
                data.npaAllowance === 'yes' ? month.npaAmount = Math.round(npaAmountPerDay * month.days) : 0;
                data.washingAllowance === 'yes' ? month.washingAmount = Math.round(washingAmountPerDay * month.days) : 0;
                month.totalAmount = month.basicSalary + (month.npaAmount || 0) + (month.washingAmount || 0);
                data.npaAllowance === 'yes' ? month.daAmount = Math.round((month.basicSalary + month.npaAmount) * getArrearRate(date) / 100) : month.daAmount = Math.round(month.basicSalary * getArrearRate(date) / 100);
                toBePaid.push(month);
                if (month.month === 3) {
                    surrender = { ...month };
                    surrender.washingAmount ? surrender.washingAmount = 0 : 0;
                    surrender.totalSurrenderAmount = surrender.totalAmount;
                    delete surrender.totalAmount;
                    toBePaid.push(surrender);
                    console.log(surrender)
                }
            }
            data.arear.toBePaid = toBePaid;
            alreadyPaid = [...toBePaid];
            data.arear.alreadyPaid = alreadyPaid;

            localStorage.setItem('data', JSON.stringify(data));
            return data;
        },
        getData: function () {
            return data;
        },
        deleteData: function (index) {
            data.splice(index, 1);
            localStorage.setItem('data', JSON.stringify(data));
        },
        updateData: function (index) {

        }
    }
})();

// Module for handling UI related tasks
const uiModule = (function () {
    const table = document.getElementById('output');
    const tableHeadData = document.querySelector('tHead');
    const tableBodyData = document.querySelector('tbody');
    const monthsName = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    function createHeading(headingValue) {
        console.log(headingValue);
        return `<tr><th ${headingValue.npaAllowance === 'yes' && headingValue.washingAllowance === 'yes' ? `colspan="14"` : headingValue.npaAllowance === 'yes' && headingValue.washingAllowance === 'no' || headingValue.npaAllowance === 'no' && headingValue.washingAllowance === 'yes' ? `colspan="12"` : headingValue.npaAllowance === 'no' && headingValue.washingAllowance === 'no' ? `colspan="10"` : ''}>Employee Name : ${headingValue.name} &emsp; | &emsp; Designation : ${headingValue.designation} &emsp; | &emsp; Employee ID : ${headingValue.empId}</th></tr><tr><th rowspan="2">S.No.</th><th rowspan="2">Month/Year</th><th rowspan="2">Days</th><th ${headingValue.npaAllowance === 'yes' && headingValue.washingAllowance === 'yes' ? `colspan="5"` : headingValue.npaAllowance === 'yes' && headingValue.washingAllowance === 'no' ? `colspan="4"` : headingValue.npaAllowance === 'no' && headingValue.washingAllowance === 'yes' ? `colspan="4"` : `colspan="3"`}>Pay to be Drawn</th><th ${headingValue.npaAllowance === 'yes' && headingValue.washingAllowance === 'yes' ? `colspan="5"` : headingValue.npaAllowance === 'yes' && headingValue.washingAllowance === 'no' ? `colspan="4"` : headingValue.npaAllowance === 'no' && headingValue.washingAllowance === 'yes' ? `colspan="4"` : `colspan="3"`}>Pay Already Drawn</th><th rowspan="2">Actions</th></tr><tr><th>Basic Salary</th>${headingValue.npaAllowance === 'yes' ? `<th>NPA Amount</th>` : ``} ${headingValue.washingAllowance === 'yes' ? `<th>Washing Allowance Amount</th>` : ``}<th>DA Amount</th><th>Total Amount</th><th>Basic Salary</th>${headingValue.npaAllowance === 'yes' ? `<th>NPA Amount</th>` : ''}${headingValue.washingAllowance === 'yes' ? `<th>Washing Allowance Amount</th>` : ``}<th>DA Amount</th><th>Total Amount</th></tr>`;
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
        addRow: function (entry, index) {
            table.innerHTML = "";
            // tableHeadData.innerHTML = createHeading(entry);
            tableBodyData.innerHTML = "";

            const row = document.createElement('tr');
            // document.getElementById('emp-name').innerText = `Name of Employee : ${entry.name}`;
            row.id = `row-${index}`;
            row.innerHTML = `
                    <td></td>
                    ${entry.month === 3 && entry.totalSurrenderAmount !== undefined ? `<td style="background-color : yellow">Surrender</td>` : `<td>${monthsName[entry.month]} / ${entry.year}</td>`} 
                    
                    <td>${entry.days}</td>
                    <td><input type="number" placeholder=${entry.basicSalary} class="salary"></td>

                    ${entry.npaAmount !== undefined ? `<td>${entry.npaAmount}</td>` : ''}
                    ${entry.washingAmount !== undefined ? `<td>${entry.washingAmount}</td>` : ''}
                    <td>${entry.daAmount}</td>
                    <td>${entry.basicSalary + entry.daAmount + (entry.npaAmount || 0) + (entry.washingAmount || 0)}</td>

                    <td><input type="number" placeholder=${entry.basicSalary}></td>
                    ${entry.npaAmount !== undefined ? `<td><input type="number" placeholder=${entry.npaAmount}></td>` : ''}
                    ${entry.washingAmount !== undefined ? `<td><input type="number" placeholder=${entry.washingAmount}></td>` : ''}
                    <td><input type="number" placeholder=${entry.daAmount}></td>
                    <td>${entry.basicSalary + (entry.daAmount || 0) + (entry.npaAmount || 0) + (entry.washingAmount || 0)}</td>
                    <td><button class="edit-btn">Edit</button><button class="delete-btn" data-id="${row.id}">Delete</button></td>`;
            tableBodyData.appendChild(row);
            console.log(tableBodyData);

            // table.append(tableHeadData, tableBodyData);
        },

        addRow1: function (entry, index) {
            table.innerHTML = "";
            // tableHeadData.innerHTML = createHeading(entry);
            tableBodyData.innerHTML = "";
            console.log(tableHeadData);
            // let index = 1;
            console.log('Obj : ', entry.arear.toBePaid);
            for (let rowData of entry.arear.toBePaid) {
                const row = document.createElement('tr');
                console.log(rowData);
                row.id = `row-${index}`;
                row.innerHTML = `
                    <td></td>
                    ${rowData.month === 3 && rowData.totalSurrenderAmount !== undefined ? `<td style="background-color : yellow">Surrender</td>` : `<td>${monthsName[rowData.month]} / ${rowData.year}</td>`} 
                    
                    <td>${rowData.days}</td>
                    <td><input type="number" placeholder=${rowData.basicSalary} class="salary"></td>

                    ${rowData.npaAmount !== undefined ? `<td>${rowData.npaAmount}</td>` : ''}
                    ${rowData.washingAmount !== undefined ? `<td>${rowData.washingAmount}</td>` : ''}
                    <td>${rowData.daAmount}</td>
                    <td>${rowData.basicSalary + rowData.daAmount + (rowData.npaAmount || 0) + (rowData.washingAmount || 0)}</td>

                    <td><input type="number" placeholder=${rowData.basicSalary}></td>
                    ${rowData.npaAmount !== undefined ? `<td><input type="number" placeholder=${rowData.npaAmount}></td>` : ''}
                    ${rowData.washingAmount !== undefined ? `<td><input type="number" placeholder=${rowData.washingAmount}></td>` : ''}
                    <td><input type="number" placeholder=${rowData.daAmount}></td>
                    <td>${rowData.basicSalary + (rowData.daAmount || 0) + (rowData.npaAmount || 0) + (rowData.washingAmount || 0)}</td>
                    <td><button class="edit-btn">Edit</button><button class="delete-btn" data-id="${row.id}">Delete</button></td>`;
                tableBodyData.appendChild(row);
                index++;
            }
            console.log(tableHeadData);;
            table.append(tableHeadData, tableBodyData);
        },
        deleteRow: function (id) {
            const row = document.getElementById(id);
            console.log(row);
            tableBodyData.removeChild(row);
        },
        populateTable: function () {
            const data = JSON.parse(localStorage.getItem('data')) || {};
            const heading = createHeading(data);
            console.log(heading);
            console.log(tableHeadData);
            table.innerHTML = "";
            tableHeadData.innerHTML = heading;
            console.log(tableHeadData);
            console.log('data : ', data.arear.alreadyPaid);
            data.arear.alreadyPaid.forEach((item, index) => {
                console.log(item, index);
                this.addRow(item, index);
            });
            table.append(tableHeadData,tableBodyData);
        }
    }
})();

// Main App Module for integrating different modules
const appModule = (function (dataCtrl, uiCtrl) {
    uiCtrl.populateTable();
    document.getElementById('form').addEventListener('submit', function (event) {
        event.preventDefault();
        const inputData = uiCtrl.getDOM();
        console.log(inputData);
        // uiCtrl.createHeading(inputData);
        const newData = dataCtrl.saveData(inputData.name, inputData.designation, inputData.empId, inputData.salary, inputData.npa, inputData.washing, inputData.fromDate, inputData.toDate);
        uiCtrl.addRow(newData, dataCtrl.getData().length - 1);
    });
    document.querySelector('tbody').addEventListener('click', function (event) {
        if (event.target.classList.contains('delete-btn')) {
            const row = event.target.parentElement.parentElement;
            const index = Array.from(row.parentElement.children).indexOf(row);
            uiCtrl.deleteRow(event.target.dataset.id);
            // dataCtrl.deleteData(index);
        }
        if (event.target.classList.contains('salary')) {
            const row = event.target.parentElement.parentElement;
            // const index = Array.from(row.parentElement.children).indexOf(row);
            // uiCtrl.deleteRow(event.target.dataset.id);
            console.log('clicked', row);
            event.target.addEventListener('change', function (event) {
                console.log('changed');
            })
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
