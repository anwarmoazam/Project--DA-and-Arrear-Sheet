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

    function getDaRate(date) {
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
        } else {
            daRate = 42;
        }
        return daRate;
    }

    function getHraRate(date) {
        let hraRate = 0;
        date = new Date(date);
        if (date >= new Date(2021, 6, 1)) {
            hraRate = 9;
        } else {
            hraRate = 8;
        }
        return hraRate;
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
            console.log(currentMonthAndYear);
            monthAndYear.push(currentMonthAndYear);
        }
        console.log(monthAndYear);
        return monthAndYear;
    }

    function getMessAllowance(obj, amount1,amount2,amount3) {
        // let date = new Date(2022, 3, 1);
        // (new Date(obj.year, obj.month) <= new Date(2022,3,1)) ? amount1 : new Date(obj.year, obj.month) >= new Date(2022,3,1) ? amount2 : new Date(obj.year, obj.month) >= new Date(2023,6,1) ? amount3 : 0;
        if(new Date(obj.year,obj.month) <= new Date(2022,3,1)){
            return amount1;
        } else if(new Date(obj.year,obj.month) >= new Date(2022,3,1) && new Date(obj.year,obj.month) <= new Date(2023,6,1)){
            return amount2;
        } else if(new Date(obj.year,obj.month) >= new Date(2023,6,1)){
            return amount3;
        }
    }

    function getHdaAllowance(obj, amount1, amount2) {
        let date = new Date(2023, 6, 1);
        return (new Date(obj.year, obj.month) <= date) ? amount1 : amount2;
    }

    function getWashingAllowance(obj,amount1,amount2){
        if(new Date(obj.year,obj.month) >= new Date(2017,0,1) && new Date(obj.year,obj.month) <= new Date(2023,6,1)){
            return Math.round((150 / getDaysInMonth(obj.month, obj.year)) * obj.days);
        } else if(new Date(obj.year,obj.month) >= new Date(2023,6,1)){
            return Math.round((180 / getDaysInMonth(obj.month, obj.year)) * obj.days);
        }
    }

    function calculateData(obj) {
        const basicSalaryPerDay = (data.salary / getDaysInMonth(obj.month, obj.year)).toFixed(2);
        const date = obj.year + "," + obj.month + "," + 1;
        obj.basicSalary = Math.round(basicSalaryPerDay * obj.days);
        obj.hraAmount !== undefined ? obj.hraAmount = Math.round((obj.basicSalary * getHraRate(date)) / 100) : 0;
        obj.npaAmount !== undefined ? obj.npaAmount = Math.round(obj.basicSalary * npaRate / 100) : 0;
        obj.washingAmount !== undefined ? obj.washingAmount = getWashingAllowance(obj,150,180) : 0;
        obj.messAmount !== undefined && obj.messAmount === '1200-1320-1450' ? obj.messAmount = getMessAllowance(obj, 1200,1320,1450) : obj.messAmount !== undefined && obj.messAmount === '800-880-970' ? obj.messAmount = getMessAllowance(obj, 800,880,970) : obj.messAmount !== undefined && obj.messAmount === '250-275-300' ? obj.messAmount = getMessAllowance(obj, 250,275,300) : 0;
        obj.hdaAmount !== undefined ? obj.hdaAmount = getHdaAllowance(obj,200,250) : 0;
        obj.other !== undefined ? obj.otherAmount = 0 : 0;
        obj.npaAmount !== undefined ? obj.daAmount = (obj.basicSalary + obj.npaAmount) * getDaRate(date) / 100 : obj.daAmount = obj.basicSalary * getDaRate(date) / 100;
        obj.totalAmount = obj.basicSalary + obj.daAmount + (obj.hraAmount || 0) + (obj.npaAmount || 0) + (obj.washingAmount || 0) + (obj.messAmount || 0) + (obj.hdaAmount || 0) + (obj.otherAmount || 0);
        return obj;
    }

    return {
        saveData: function (name, designation, empId, empPan, salary, npa, hra, washing, mess, hda, other, fromDate, toDate) {
            const totalData = getCurrentMonthAndYear(fromDate, toDate);

            data.name = name.trim();
            data.designation = designation.trim();
            data.empId = empId.trim();
            data.empPan = empPan.trim();
            data.salary = salary;
            data.npaAllowance = npa;
            data.houseRentAllowance = hra;
            data.washingAllowance = washing;
            data.messAllowance = mess;
            data.hardDutyAllowance = hda;
            data.other = other;
            data.fromDate = fromDate;
            data.toDate = toDate;
            data.salary = salary;
            data.arear = {};
            let toBePaid = [], alreadyPaid = [];

            totalData.forEach((month, index) => {
                month.month === 7 && index !== 0 ? data.salary += Math.round((data.salary * 3 / 100) / 100) * 100 : data.salary;
                month.basicSalary = data.salary;
                data.npaAllowance === 'yes' ? month.npaAmount = 0 : 0;
                data.houseRentAllowance === 'yes' ? month.hraAmount = 0 : 0;
                data.washingAllowance === 'yes' ? month.washingAmount = 0 : 0;
                data.messAllowance === '1200-1320-1450' ? month.messAmount = data.messAllowance : data.messAllowance === '800-880-970' ? month.messAmount = data.messAllowance : data.messAllowance === '250-275-300' ? month.messAmount = data.messAllowance : 0;
                data.hardDutyAllowance === 'yes' ? month.hdaAmount = 0 : 0;
                data.other === 'yes' ? month.otherAmount = 0 : 0;
                alreadyPaid.push(calculateData(month));
                if (month.month === 3) {
                    let surrender = { ...month };
                    surrender.basicSalary = 0;
                    surrender.daAmount = 0;
                    surrender.npaAmount ? surrender.npaAmount = 0 : 0;
                    surrender.hraAmount ? surrender.hraAmount = 0 : 0;
                    surrender.washingAmount ? surrender.washingAmount = 0 : 0;
                    surrender.messAmount ? surrender.messAmount = 0 : 0;
                    surrender.hdaAmount ? surrender.hdaAmount = 0 : 0;
                    surrender.totalSurrenderAmount = surrender.totalAmount;
                    surrender.totalSurrenderAmount = 0;
                    surrender.totalAmount = 0;
                    alreadyPaid.push(surrender);
                }
            })

            data.arear.alreadyPaid = alreadyPaid;
            toBePaid = [...alreadyPaid];
            data.arear.toBePaid = toBePaid;

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
        updateData: function (obj) {

            const savedObj = this.getData();
            // const basicSalaryPerDay = (obj.basicSalary / getDaysInMonth(obj.month, obj.year)).toFixed(2);
            const basicSalaryPerDay = (data.salary / getDaysInMonth(obj.month, obj.year)).toFixed(2);
            const date = obj.year + "," + obj.month + "," + 1;
            obj.basicSalary = Math.round(basicSalaryPerDay * obj.days);
            obj.hraAmount !== undefined ? obj.hraAmount = Math.round((obj.basicSalary * getHraRate(date)) / 100) : 0;
            obj.npaAmount !== undefined ? obj.npaAmount = Math.round(obj.basicSalary * npaRate / 100) : 0;
            console.log(obj.npaAmount);
            obj.washingAmount !== undefined ? obj.washingAmount = Math.round((150 / getDaysInMonth(obj.month, obj.year)) * obj.days) : 0;
            obj.messAmount !== undefined && obj.messAmount === '1200-1320' ? obj.messAmount = getMessAllowance(obj, 1200, 1320) : obj.messAmount !== undefined && obj.messAmount === '800-880' ? obj.messAmount = getMessAllowance(obj, 800, 880) : obj.messAmount !== undefined && obj.messAmount === '250-275' ? obj.messAmount = getMessAllowance(obj, 250, 275) : 0;
            obj.hdaAmount !== undefined ? obj.hdaAmount = 200 : 0;
            obj.other !== undefined ? obj.otherAmount = 0 : 0;
            obj.npaAmount !== undefined ? obj.daAmount = (obj.basicSalary + obj.npaAmount) * getDaRate(date) / 100 : obj.daAmount = obj.basicSalary * getDaRate(date) / 100;
            console.log('da amount : ', obj.daAmount);
            obj.totalAmount = obj.basicSalary + obj.daAmount + (obj.hraAmount || 0) + (obj.npaAmount || 0) + (obj.washingAmount || 0) + (obj.messAmount || 0) + (obj.hdaAmount || 0) + (obj.otherAmount || 0);
            return obj;

            // const npaAmountPerDay = (obj.basicSalary * npaRate / 100) / (getDaysInMonth(obj.month, obj.year));
            // const washingAmountPerDay = 150 / (getDaysInMonth(obj.month, obj.year));
            // const date = obj.year + "," + obj.month + "," + 1;
            // // let surrender = {};
            // obj.basicSalary = Math.round(basicSalaryPerDay * obj.days);
            // savedObj.npaAllowance === 'yes' ? obj.npaAmount = Math.round(npaAmountPerDay * obj.days) : 0;
            // savedObj.washingAllowance === 'yes' ? obj.washingAmount = Math.round(washingAmountPerDay * obj.days) : 0;
            // savedObj.messAllowance === '1200-1320' ? obj.messAmount = getMessAllowance(obj, 1200, 1320) : savedObj.messAllowance === '800-880' ? obj.messAmount = getMessAllowance(obj, 800, 880) : savedObj.messAllowance === '250-275' ? obj.messAmount = getMessAllowance(obj, 250, 275) : 0;
            // savedObj.hardDutyAllowance == 'yes' ? obj.hdaAmount = 200 : 0;

            // obj.totalAmount = obj.basicSalary + (obj.npaAmount || 0) + (obj.washingAmount || 0) + (obj.messAmount || 0) + (obj.hdaAmount || 0);
            // savedObj.npaAllowance === 'yes' ? obj.daAmount = Math.round((obj.basicSalary + obj.npaAmount) * getDaRate(date) / 100) : obj.daAmount = Math.round(obj.basicSalary * getDaRate(date) / 100);
        }
    }
})();

// Module for handling UI related tasks
const uiModule = (function () {
    const table = document.getElementById('output');
    const tableHeadData = document.querySelector('tHead');
    const tableBodyData = document.querySelector('tbody');
    const monthsName = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    function createTotal(columValue) {
        const keys = Object.keys(columValue.arear.alreadyPaid[0]);
        console.log(keys);
        keys.splice(0, 4);
        const obj = {};
        console.log(keys);
        keys.forEach(item => {
            obj[item] = columValue.arear.alreadyPaid.reduce((acc, curr) => {
                acc += curr[item];
                return acc;
            }, 0)
        })
        console.log(obj);
        return obj;
    }

    function createHeading(headingValue) {
        const keys = Object.keys(headingValue.arear.alreadyPaid[0]);
        keys.splice(0, 4)
        console.log(keys);
        return `<tr><th ${keys.length === 9 ? `colspan="22"` : keys.length === 8 ? `colspan="20"` : keys.length === 7 ? `colspan="18"` : keys.length === 6 ? `colspan="16"` : keys.length === 5 ? `colspan="14"` : keys.length === 4 ? `colspan="12"` : keys.length === 3 ? `colspan="10"` : ``}>Employee Name : ${headingValue.name} &emsp; | &emsp; Designation : ${headingValue.designation} &emsp; | &emsp; Employee ID : ${headingValue.empId} &emsp; | &emsp; Employee PAN No. : ${headingValue.empPan}</th></tr>
        <tr><th rowspan="2">S.No.</th><th rowspan="2">Month / Year</th><th rowspan="2">Days</th><th ${keys.length === 9 ? `colspan="9"` : keys.length === 8 ? `colspan="8"` : keys.length === 7 ? `colspan="7"` : keys.length === 6 ? `colspan="6"` : keys.length === 5 ? `colspan="5"` : keys.length === 4 ? `colspan="4"` : keys.length === 3 ? `colspan="3"` : ``}>Pay to be Drawn</th><th ${keys.length === 9 ? `colspan="9"` : keys.length === 8 ? `colspan="8"` : keys.length === 7 ? `colspan="7"` : keys.length === 6 ? `colspan="6"` : keys.length === 5 ? `colspan="5"` : keys.length === 4 ? `colspan="4"` : keys.length === 3 ? `colspan="3"` : ``}>Pay Already Drawn</th><th rowspan="2">Actions</th></tr>
        <tr><th>Basic Salary</th><th>DA Amount</th>${headingValue.npaAllowance === 'yes' ? `<th>NPA Amount</th>` : ``} ${headingValue.houseRentAllowance === 'yes' ? `<th>HRA Amount</th>` : ``} ${headingValue.washingAllowance === 'yes' ? `<th>Washing Allowance Amount</th>` : ``} ${headingValue.messAllowance !== '0' ? `<th>Mess Amount</th>` : ``}${headingValue.hardDutyAllowance === 'yes' ? `<th>HDA Amount</th>` : ``}${headingValue.other === 'yes' ? `<th>Other Amount</th>` : ``}<th>Total Amount</th><th>Basic Salary</th><th>DA Amount</th>${headingValue.npaAllowance === 'yes' ? `<th>NPA Amount</th>` : ''}${headingValue.houseRentAllowance === 'yes' ? `<th>HRA Amount</th>` : ``}${headingValue.washingAllowance === 'yes' ? `<th>Washing Allowance Amount</th>` : ``}${headingValue.messAllowance !== '0' ? `<th>Mess Amount</th>` : ``}${headingValue.hardDutyAllowance === 'yes' ? `<th>HDA Amount</th>` : ``}${headingValue.other === 'yes' ? `<th>Other Amount</th>` : ``}<th>Total Amount</th></tr>`;

        /*
                return `<tr>
                    <th ${headingValue.npaAllowance === 'yes' && headingValue.houseRentAllowance === 'yes' && headingValue.washingAllowance === 'yes' && headingValue.messAllowance !== '0' && headingValue.hardDutyAllowance == 'yes' ? `colspan="20"` : 
                    headingValue.npaAllowance === 'no' && headingValue.houseRentAllowance === 'yes' && headingValue.washingAllowance === 'yes' && headingValue.messAllowance !== '0' && headingValue.hardDutyAllowance === 'yes' || headingValue.npaAllowance === 'yes' && headingValue.houseRentAllowance === 'no' && headingValue.washingAllowance === 'yes' && headingValue.messAllowance !== '0' && headingValue.hardDutyAllowance === 'yes' || headingValue.npaAllowance === 'yes' && headingValue.houseRentAllowance === 'yes' && headingValue.washingAllowance === 'no' && headingValue.messAllowance !== '0' && headingValue.hardDutyAllowance === 'yes' || headingValue.npaAllowance === 'yes' && headingValue.houseRentAllowance === 'yes' && headingValue.washingAllowance === 'yes' && headingValue.messAllowance === '0' && headingValue.hardDutyAllowance === 'yes' || headingValue.npaAllowance === 'yes' && headingValue.houseRentAllowance === 'yes' && headingValue.washingAllowance === 'yes' && headingValue.messAllowance !== '0' && headingValue.hardDutyAllowance === 'no' ? `colspan="18"` :
                    headingValue.npaAllowance === 'no' && headingValue.houseRentAllowance === 'no' && headingValue.washingAllowance === 'yes' && headingValue.messAllowance !== '0' && headingValue.hardDutyAllowance === 'yes' || headingValue.npaAllowance === 'no' && headingValue.houseRentAllowance === 'yes' && headingValue.washingAllowance === 'no' && headingValue.messAllowance !== '0' && headingValue.hardDutyAllowance === 'yes' || headingValue.npaAllowance === 'no' && headingValue.houseRentAllowance === 'yes' && headingValue.washingAllowance === 'yes' && headingValue.messAllowance === '0' && headingValue.hardDutyAllowance === 'yes' || headingValue.npaAllowance === 'no' && headingValue.houseRentAllowance === 'yes' && headingValue.washingAllowance === 'yes' && headingValue.messAllowance !== '0' && headingValue.hardDutyAllowance === 'no' || headingValue.npaAllowance === 'yes' && headingValue.houseRentAllowance === 'no' && headingValue.washingAllowance === 'no' && headingValue.messAllowance !== '0' && headingValue.hardDutyAllowance === 'yes' || headingValue.npaAllowance === 'yes' && headingValue.houseRentAllowance === 'no' && headingValue.washingAllowance === 'yes' && headingValue.messAllowance === '0' && headingValue.hardDutyAllowance === 'yes' || headingValue.npaAllowance === 'yes' && headingValue.houseRentAllowance === 'no' && headingValue.washingAllowance === 'yes' && headingValue.messAllowance !== '0' && headingValue.hardDutyAllowance === 'no' || headingValue.npaAllowance === 'yes' && headingValue.houseRentAllowance === 'yes' && headingValue.washingAllowance === 'no' && headingValue.messAllowance === '0' && headingValue.hardDutyAllowance === 'yes' || headingValue.npaAllowance === 'yes' && headingValue.houseRentAllowance === 'yes' && headingValue.washingAllowance === 'no' && headingValue.messAllowance !== '0' && headingValue.hardDutyAllowance === 'no' || headingValue.npaAllowance === 'yes' && headingValue.houseRentAllowance === 'yes' && headingValue.washingAllowance === 'yes' && headingValue.messAllowance === '0' && headingValue.hardDutyAllowance === 'no' ? `colspan="16"` : 
                    headingValue.npaAllowance === 'no' && headingValue.houseRentAllowance === 'no' && headingValue.washingAllowance === 'yes' && headingValue.messAllowance !== '0' && headingValue.hardDutyAllowance === 'yes' || headingValue.npaAllowance === 'no' && headingValue.houseRentAllowance === 'yes' && headingValue.washingAllowance === 'no' && headingValue.messAllowance !== '0' && headingValue.hardDutyAllowance === 'yes' || headingValue.npaAllowance === 'no' && headingValue.houseRentAllowance === 'yes' && headingValue.washingAllowance === 'yes' && headingValue.messAllowance === '0' && headingValue.hardDutyAllowance === 'yes' || headingValue.npaAllowance === 'no' && headingValue.houseRentAllowance === 'yes' && headingValue.washingAllowance === 'yes' && headingValue.messAllowance !== '0' && headingValue.hardDutyAllowance === 'no' || headingValue.npaAllowance === 'yes' && headingValue.houseRentAllowance === 'no' && headingValue.washingAllowance === 'no' && headingValue.messAllowance !== '0' && headingValue.hardDutyAllowance === 'yes' || headingValue.npaAllowance === 'yes' && headingValue.houseRentAllowance === 'no' && headingValue.washingAllowance === 'yes' && headingValue.messAllowance === '0' && headingValue.hardDutyAllowance === 'yes' || headingValue.npaAllowance === 'yes' && headingValue.houseRentAllowance === 'no' && headingValue.washingAllowance === 'yes' && headingValue.messAllowance !== '0' && headingValue.hardDutyAllowance === 'no' || headingValue.npaAllowance === 'yes' && headingValue.houseRentAllowance === 'yes' && headingValue.washingAllowance === 'no' && headingValue.messAllowance === '0' && headingValue.hardDutyAllowance === 'yes' || headingValue.npaAllowance === 'yes' && headingValue.houseRentAllowance === 'yes' && headingValue.washingAllowance === 'yes' && headingValue.messAllowance === '0' && headingValue.hardDutyAllowance === 'no' ? `colspan="14"` : 
                    headingValue.npaAllowance === 'no' && headingValue.washingAllowance === 'no' && headingValue.messAllowance !== '0' || headingValue.npaAllowance === 'yes' && headingValue.washingAllowance === 'no' && headingValue.messAllowance === '0' || headingValue.npaAllowance === 'no' && headingValue.washingAllowance === 'yes' && headingValue.messAllowance === '0' ? `colspan="12"` : 
                    headingValue.npaAllowance === 'no' && headingValue.washingAllowance === 'no' && headingValue.messAllowance === '0' ? `colspan="10"` : ''}>
                    Employee Name : ${headingValue.name} &emsp; | &emsp; Designation : ${headingValue.designation} &emsp; | &emsp; Employee ID : ${headingValue.empId} &emsp; | &emsp; Employee PAN No. : ${headingValue.empPan}</th>
                </tr>
                <tr>
                    <th rowspan="2">S.No.</th><th rowspan="2">Month / Year</th>
                    <th rowspan="2">Days</th>
                    <th ${headingValue.npaAllowance === 'yes' && headingValue.houseRentAllowance === 'yes' && headingValue.washingAllowance === 'yes' && headingValue.messAllowance !== '0' && headingValue.hardDutyAllowance === 'yes' ? `colspan="8"` : 
        
                    headingValue.npaAllowance === 'yes' && headingValue.houseRentAllowance === 'yes' && headingValue.washingAllowance === 'no' && headingValue.messAllowance !== '0' && headingValue.hardDutyAllowance === 'yes' || headingValue.npaAllowance === 'no' && headingValue.houseRentAllowance === 'yes' && headingValue.washingAllowance === 'yes' && headingValue.messAllowance !== '0' && headingValue.hardDutyAllowance === 'yes' || headingValue.npaAllowance === 'yes' && headingValue.houseRentAllowance === 'yes' && headingValue.washingAllowance === 'yes' && headingValue.messAllowance === '0' && headingValue.hardDutyAllowance === 'yes' || headingValue.npaAllowance === 'yes' && headingValue.houseRentAllowance === 'yes' && headingValue.washingAllowance === 'yes' && headingValue.messAllowance !== '0' && headingValue.hardDutyAllowance === 'no' || headingValue.npaAllowance === 'yes' && headingValue.houseRentAllowance === 'no' && headingValue.washingAllowance === 'yes' && headingValue.messAllowance !== '0' && headingValue.hardDutyAllowance === 'yes' ? `colspan="7"` : 
                    headingValue.npaAllowance === 'no' && headingValue.houseRentAllowance === 'no' && headingValue.washingAllowance === 'yes' && headingValue.messAllowance !== '0' && headingValue.hardDutyAllowance === 'yes' || headingValue.npaAllowance === 'no' && headingValue.houseRentAllowance === 'yes' && headingValue.washingAllowance === 'no' && headingValue.messAllowance !== '0' && headingValue.hardDutyAllowance === 'yes' || headingValue.npaAllowance === 'no' && headingValue.houseRentAllowance === 'yes' && headingValue.washingAllowance === 'yes' && headingValue.messAllowance === '0' && headingValue.hardDutyAllowance === 'yes' || headingValue.npaAllowance === 'no' && headingValue.houseRentAllowance === 'yes' && headingValue.washingAllowance === 'yes' && headingValue.messAllowance !== '0' && headingValue.hardDutyAllowance === 'no' || headingValue.npaAllowance === 'yes' && headingValue.houseRentAllowance === 'no' && headingValue.washingAllowance === 'no' && headingValue.messAllowance !== '0' && headingValue.hardDutyAllowance === 'yes' || headingValue.npaAllowance === 'yes' && headingValue.houseRentAllowance === 'no' && headingValue.washingAllowance === 'yes' && headingValue.messAllowance === '0' && headingValue.hardDutyAllowance === 'yes' || headingValue.npaAllowance === 'yes' && headingValue.houseRentAllowance === 'no' && headingValue.washingAllowance === 'yes' && headingValue.messAllowance !== '0' && headingValue.hardDutyAllowance === 'no' || headingValue.npaAllowance === 'yes' && headingValue.houseRentAllowance === 'yes' && headingValue.washingAllowance === 'no' && headingValue.messAllowance === '0' && headingValue.hardDutyAllowance === 'yes' || headingValue.npaAllowance === 'yes' && headingValue.houseRentAllowance === 'yes' && headingValue.washingAllowance === 'no' && headingValue.messAllowance !== '0' && headingValue.hardDutyAllowance === 'no' || headingValue.npaAllowance === 'yes' && headingValue.houseRentAllowance === 'yes' && headingValue.washingAllowance === 'yes' && headingValue.messAllowance === '0' && headingValue.hardDutyAllowance === 'no' ? `colspan="6"` : 
                    headingValue.npaAllowance === 'no' && headingValue.houseRentAllowance === 'no' && headingValue.washingAllowance === 'no' && headingValue.messAllowance !== '0' && headingValue.hardDutyAllowance === 'yes' || headingValue.npaAllowance === 'no' && headingValue.houseRentAllowance === 'no' && headingValue.washingAllowance === 'yes' && headingValue.messAllowance === '0' && headingValue.hardDutyAllowance === 'yes' || headingValue.npaAllowance === 'no' && headingValue.houseRentAllowance === 'no' && headingValue.washingAllowance === 'yes' && headingValue.messAllowance !== '0' && headingValue.hardDutyAllowance === 'no' || headingValue.npaAllowance === 'yes' && headingValue.houseRentAllowance === 'no' && headingValue.washingAllowance === 'no' && headingValue.messAllowance === '0' && headingValue.hardDutyAllowance === 'yes' || headingValue.npaAllowance === 'yes' && headingValue.houseRentAllowance === 'yes' && headingValue.washingAllowance === 'no' && headingValue.messAllowance === '0' && headingValue.hardDutyAllowance === 'no' ? `colspan="5"` : 
                    headingValue.npaAllowance === 'no' && headingValue.washingAllowance === 'no' && headingValue.messAllowance === '0' ? `colspan="3"` : ''}>Pay to be Drawn</th>
        
                    <th ${headingValue.npaAllowance === 'yes' && headingValue.houseRentAllowance === 'yes' && headingValue.washingAllowance === 'yes' && headingValue.messAllowance !== '0' && headingValue.hardDutyAllowance === 'yes' ? `colspan="8"` : 
                    headingValue.npaAllowance === 'yes' && headingValue.houseRentAllowance === 'yes' && headingValue.washingAllowance === 'no' && headingValue.messAllowance !== '0' && headingValue.hardDutyAllowance === 'yes' || headingValue.npaAllowance === 'no' && headingValue.houseRentAllowance === 'yes' && headingValue.washingAllowance === 'yes' && headingValue.messAllowance !== '0' && headingValue.hardDutyAllowance === 'yes' || headingValue.npaAllowance === 'yes' && headingValue.houseRentAllowance === 'yes' && headingValue.washingAllowance === 'yes' && headingValue.messAllowance === '0' && headingValue.hardDutyAllowance === 'yes' || headingValue.npaAllowance === 'yes' && headingValue.houseRentAllowance === 'yes' && headingValue.washingAllowance === 'yes' && headingValue.messAllowance !== '0' && headingValue.hardDutyAllowance === 'no' || headingValue.npaAllowance === 'yes' && headingValue.houseRentAllowance === 'no' && headingValue.washingAllowance === 'yes' && headingValue.messAllowance !== '0' && headingValue.hardDutyAllowance === 'yes' ? `colspan="7"` : 
                    headingValue.npaAllowance === 'yes' && headingValue.washingAllowance === 'yes' && headingValue.messAllowance === '0' && headingValue.hardDutyAllowance === 'no' || headingValue.npaAllowance === 'no' && headingValue.washingAllowance === 'yes' && headingValue.messAllowance === '0' && headingValue.hardDutyAllowance === 'yes' || headingValue.npaAllowance === 'no' && headingValue.washingAllowance === 'no' && headingValue.messAllowance !== '0' && headingValue.hardDutyAllowance === 'yes' || headingValue.npaAllowance === 'yes' && headingValue.washingAllowance === 'no' && headingValue.messAllowance !== '0' && headingValue.hardDutyAllowance === 'no' || headingValue.npaAllowance === 'yes' && headingValue.washingAllowance === 'no' && headingValue.messAllowance === '0' && headingValue.hardDutyAllowance === 'yes' || headingValue.npaAllowance === 'no' && headingValue.washingAllowance === 'yes' && headingValue.messAllowance !== '0' || headingValue.npaAllowance === 'yes' && headingValue.washingAllowance === 'yes' && headingValue.messAllowance === '0' ? `colspan="5"` : 
                    headingValue.npaAllowance === 'no' && headingValue.washingAllowance === 'no' && headingValue.messAllowance !== '0' || headingValue.npaAllowance === 'yes' && headingValue.washingAllowance === 'no' && headingValue.messAllowance === '0' || headingValue.npaAllowance === 'no' && headingValue.washingAllowance === 'yes' && headingValue.messAllowance === '0' ? `colspan="4"` : 
                    headingValue.npaAllowance === 'no' && headingValue.washingAllowance === 'no' && headingValue.messAllowance === '0' ? `colspan="3"` : ''}>Pay Already Drawn</th>
                    <th rowspan="2">Actions</th>
                </tr>
                <tr>
                    <th>Basic Salary</th><th>DA Amount</th>${headingValue.npaAllowance === 'yes' ? `<th>NPA Amount</th>` : ``} ${headingValue.houseRentAllowance === 'yes' ? `<th>HRA Amount</th>` : ``} ${headingValue.washingAllowance === 'yes' ? `<th>Washing Allowance Amount</th>` : ``} ${headingValue.messAllowance !== '0' ? `<th>Mess Amount</th>` : ``}${headingValue.hardDutyAllowance === 'yes' ? `<th>HDA Amount</th>` : ``}<th>Total Amount</th>
                    <th>Basic Salary</th><th>DA Amount</th>${headingValue.npaAllowance === 'yes' ? `<th>NPA Amount</th>` : ''}${headingValue.houseRentAllowance === 'yes' ? `<th>HRA Amount</th>` : ``}${headingValue.washingAllowance === 'yes' ? `<th>Washing Allowance Amount</th>` : ``}${headingValue.messAllowance !== '0' ? `<th>Mess Amount</th>` : ``}${headingValue.hardDutyAllowance === 'yes' ? `<th>HDA Amount</th>` : ``}<th>Total Amount</th></tr>`;
        */
    }

    return {
        getDOM: function () {
            return {
                name: document.getElementById('name').value,
                designation: document.getElementById('designation').value,
                empId: document.getElementById('empId').value,
                empPan: document.getElementById('pan').value,
                salary: Number(document.getElementById('salary').value),
                npa: document.getElementById('npa').value,
                hra: document.getElementById('hra').value,
                washing: document.getElementById('washing').value,
                mess: document.getElementById('mess').value,
                hda: document.getElementById('hda').value,
                other: document.getElementById('other').value,
                fromDate: document.getElementById('fromDate').value,
                toDate: document.getElementById('toDate').value,
            };
        },
        addRow: function (entry, index) {
            table.innerHTML = "";
            const row = document.createElement('tr');
            row.id = `row-${index}`;
            row.innerHTML += `
                    <td></td>
                    ${entry.totalSurrenderAmount !== undefined ? `<td style="background-color : yellow" colspan="2">Surrender</td>` : `<td class="month-year">${monthsName[entry.month]} / ${entry.year}</td>`} 
                    ${entry.totalSurrenderAmount !== undefined ? '' : `<td>${entry.days}</td>`}
                    <td><input type="number" placeholder=${entry.basicSalary} class="salary"></td>
                    <td>${entry.daAmount}</td>
                    ${entry.npaAmount !== undefined ? `<td>${entry.npaAmount}</td>` : ``}
                    ${entry.hraAmount !== undefined ? `<td>${entry.hraAmount}</td>` : ``}
                    ${entry.washingAmount !== undefined ? `<td>${entry.washingAmount}</td>` : ``}
                    ${entry.messAmount !== undefined ? `<td>${entry.messAmount}</td>` : ``}
                    ${entry.hdaAmount !== undefined ? `<td>${entry.hdaAmount}</td>` : ``}
                    ${entry.otherAmount !== undefined ? `<td><input type="number" placeholder=${entry.otherAmount} class="other-amount"></td>` : ``}
                    <td>${entry.totalAmount !== undefined ? entry.totalAmount : entry.totalSurrenderAmount}</td>

                    <td><input type="number" placeholder=${entry.basicSalary}></td>
                    <td><input type="number" placeholder=${entry.daAmount}></td>
                    ${entry.npaAmount !== undefined ? `<td><input type="number" placeholder=${entry.npaAmount}></td>` : ''}
                    ${entry.hraAmount !== undefined ? `<td><input type="number" placeholder=${entry.hraAmount}></td>` : ``}
                    ${entry.washingAmount !== undefined ? `<td><input type="number" placeholder=${entry.washingAmount}></td>` : ''}
                    ${entry.messAmount !== undefined ? `<td><input type="number" placeholder=${entry.messAmount}></td>` : ''}
                    ${entry.hdaAmount !== undefined ? `<td><input type="number" placeholder=${entry.hdaAmount}></td>` : ``}
                    ${entry.otherAmount !== undefined ? `<td><input type="number" placeholder=${entry.otherAmount}></td>` : ``}
                    ${`<td>${entry.totalAmount}</td>`}
                    <td><button class="edit-btn">Edit</button><button class="delete-btn" data-id="${row.id}">Delete</button></td>`;
            tableBodyData.appendChild(row);
        },

        deleteRow: function (id) {
            const row = document.getElementById(id);
            tableBodyData.removeChild(row);
        },
        populateTable: function () {
            const totalRow = document.createElement('tr');
            totalRow.classList.add('total');
            table.innerHTML = "";
            let heading;
            tableHeadData.innerHTML = "";
            tableBodyData.innerHTML = "";
            const data = JSON.parse(localStorage.getItem('data')) || {};
            (Object.keys(data).length !== 0) ? heading = createHeading(data) : '';
            tableHeadData.innerHTML = heading;
            if (Object.keys(data).length !== 0) {
                data.arear.alreadyPaid.forEach((item, index) => {
                    this.addRow(item, index);
                });
                const total = createTotal(data);
                totalRow.innerHTML = `<td colspan="3">Total</td><td>${total.basicSalary}</td><td>${Math.round(total.daAmount)}</td>${total.npaAmount !== undefined ? `<td>${total.npaAmount}</td>` : ``}${total.hraAmount !== undefined ? `<td>${total.hraAmount}</td>` : ``}${total.washingAmount !== undefined ? `<td>${total.washingAmount}</td>` : ``}${total.messAmount !== undefined ? `<td>${total.messAmount}</td>` : ``}${total.hdaAmount !== undefined ? `<td>${total.hdaAmount}</td>` : ``}${total.otherAmount !== undefined ? `<td>${total.otherAmount}</td>` : ``}<td>${Math.round(total.totalAmount)}</td><td>${total.basicSalary}</td><td>${total.daAmount}</td>${total.npaAmount !== undefined ? `<td>${total.npaAmount}</td>` : ``}${total.hraAmount !== undefined ? `<td>${total.hraAmount}</td>` : ``}${total.washingAmount !== undefined ? `<td>${total.washingAmount}</td>` : ``}${total.messAmount !== undefined ? `<td>${total.messAmount}</td>` : ``}${total.hdaAmount !== undefined ? `<td>${total.hdaAmount}</td>` : ``}${total.otherAmount !== undefined ? `<td>${total.otherAmount}</td>` : ``}<td>${total.totalAmount}</td><td></td>`
                console.log(totalRow);
            }
            tableBodyData.appendChild(totalRow);
            table.append(tableHeadData, tableBodyData);
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
        const newData = dataCtrl.saveData(inputData.name, inputData.designation, inputData.empId, inputData.empPan, inputData.salary, inputData.npa, inputData.hra, inputData.washing, inputData.mess, inputData.hda, inputData.other, inputData.fromDate, inputData.toDate);
        console.log(newData);
        uiCtrl.populateTable();
    });
    document.querySelector('tbody').addEventListener('click', function (event) {
        if (event.target.classList.contains('delete-btn')) {
            const row = event.target.parentElement.parentElement;
            const index = Array.from(row.parentElement.children).indexOf(row);
            uiCtrl.deleteRow(event.target.dataset.id);
            // dataCtrl.deleteData(index);
        }
    });
    document.querySelector('tbody').addEventListener('dblclick', function (event) {
        if (event.target.classList.contains('month-year')) {
            const row = event.target.parentElement;
            const index = Array.from(row.parentElement.children).indexOf(row);
            const data = dataCtrl.getData();
            const obj = (data.arear.alreadyPaid[index].date !== 1) ? { ...data.arear.alreadyPaid[index + 1] } : { ...data.arear.alreadyPaid[index] };
            let surrenderIndex = data.arear.alreadyPaid.indexOf(data.arear.alreadyPaid.find((item, idx) => item.totalSurrenderAmount !== undefined && idx > index), index);

            if (surrenderIndex >= 0) {
                data.arear.alreadyPaid[surrenderIndex].basicSalary = Math.round(obj.basicSalary / 2);
                data.arear.alreadyPaid[surrenderIndex].daAmount = Math.round(obj.daAmount / 2);
                obj.washingAmount ? data.arear.alreadyPaid[surrenderIndex].washingAmount = 0 : 0;
                obj.npaAmount ? data.arear.alreadyPaid[surrenderIndex].npaAmount = Math.round(obj.npaAmount / 2) : 0;
                data.arear.alreadyPaid[surrenderIndex].totalSurrenderAmount = data.arear.alreadyPaid[surrenderIndex].basicSalary + data.arear.alreadyPaid[surrenderIndex].daAmount + (data.arear.alreadyPaid[surrenderIndex].npaAmount || 0);
                data.arear.alreadyPaid[surrenderIndex].totalAmount = data.arear.alreadyPaid[surrenderIndex].basicSalary + data.arear.alreadyPaid[surrenderIndex].daAmount + (data.arear.alreadyPaid[surrenderIndex].npaAmount || 0);
            }
            localStorage.setItem('data', JSON.stringify(data));
            uiCtrl.populateTable();
        }
    });
    document.querySelector('tbody').addEventListener('change', function (event) {
        if (event.target.classList.contains('salary')) {
            const row = event.target.parentElement.parentElement;
            const index = Array.from(row.parentElement.children).indexOf(row);
            const data = dataCtrl.getData();
            console.log(data);
            const newSalary = Number(event.target.value);
            data.salary = newSalary;
            const obj = { ...data.arear.alreadyPaid[index] };
            console.log(data);
            // data.arear.alreadyPaid.splice(index);
            for (let i = index; i < data.arear.alreadyPaid.length; i++) {
                if (data.arear.alreadyPaid[i].totalSurrenderAmount === undefined) {
                    data.arear.alreadyPaid[i].basicSalary = newSalary;
                    dataCtrl.updateData(data.arear.alreadyPaid[i]);
                }
                if (data.arear.alreadyPaid[i].month === 7 && i !== index) {
                    data.salary += Math.round((data.salary * 3 / 100) / 100) * 100;
                    dataCtrl.updateData(data.arear.alreadyPaid[i]);
                }
            }
            localStorage.setItem('data', JSON.stringify(data));
            uiCtrl.populateTable();
        }
        if (event.target.classList.contains('other-amount')) {
            const row = event.target.parentElement.parentElement;
            const index = Array.from(row.parentElement.children).indexOf(row);
            const data = dataCtrl.getData();
            const value = Number(event.target.value);
            console.log(data);
            data.arear.alreadyPaid[index].otherAmount = value;
            data.arear.alreadyPaid[index].totalAmount += value;
            localStorage.setItem('data', JSON.stringify(data));
            uiCtrl.populateTable();
        }
    })
})(dataModule, uiModule);

function getMessAllowance(obj, oldAmt, newAmt) {
    let date = new Date(2022, 2, 31);
    return (new Date(obj.year, obj.month, obj.date) < date) ? oldAmt : newAmt;
}

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

