const createTable = (finalArr, fields) => {
    let tableHeader = document.querySelector(".table-header");
    let tableContent = document.querySelector(".table-content");

    fields.forEach(
        (e) => (tableHeader.innerHTML += `<div class="header__item">${e}</div>`)
    );

    for (let i = 0; i < finalArr.length; i++) {
        tableContent.innerHTML += `<div class="table-row"></div>`;
        let tableRow = document.querySelectorAll(".table-row");
        for (let j = 0; j < fields.length; j++) {
            tableRow[
                tableRow.length - 1
            ].innerHTML += `<div class="table-data"> ${
                finalArr[i][fields[j]]
            } </div>`;
        }
    }
};

const fileUpload = (event) => {
    var reader = new FileReader();
    reader.onload = onReaderLoad;
    reader.readAsText(event.target.files[0]);
};

const onReaderLoad = (event) => {
    let obj = JSON.parse(event.target.result);
    obj = obj.products;

    let finalArr = [];

    for (const key in obj) {
        let tempObj = new Object();
        tempObj.productID = key;
        for (const k in obj[key]) tempObj[k] = obj[key][k];
        finalArr.push(tempObj);
    }

    for (let i = 0; i < finalArr.length; i++)
        finalArr[i].popularity = parseInt(finalArr[i].popularity);

    finalArr.sort((a, b) => (a.popularity > b.popularity ? -1 : 1));

    let lastClicked = -1;
    let lastClicked2 = -1;
    let fields = [];
    let current = null;
    let toRemove = null;

    for (const key in obj) {
        let newObj = obj[key];
        $(".available-fields .field").append(`<span>productID</span>`);
        for (const kk in newObj) {
            $(".available-fields .field").append(`<span>${kk}</span>`);
        }
        break;
    }

    let availableFieldSpan = document.querySelectorAll(
        ".available-fields .field span"
    );
    let displayFieldSpan = 0;

    availableFieldSpan.forEach((el, i) => {
        el.addEventListener("click", (e) => {
            if (lastClicked != -1)
                availableFieldSpan[lastClicked].classList.remove("active");
            availableFieldSpan[i].classList.add("active");
            lastClicked = i;
            current = e.target.innerText;
        });
    });

    $(".add").click(() => {
        let found = false;
        for (let i = 0; i < fields.length; i++)
            if (fields[i] === current) found = true;
        if (found == true)
            availableFieldSpan[lastClicked].classList.remove("active");
        if (current != null && found == false) {
            $(".display-fields .field").append(`<span>${current}</span>`);
            availableFieldSpan[lastClicked].classList.remove("active");
            fields.push(current);
            current = null;
            displayFieldSpan = document.querySelectorAll(
                ".display-fields .field span"
            );

            displayFieldSpan.forEach((el, i) => {
                el.addEventListener("click", (e) => {
                    if (lastClicked2 != -1)
                        displayFieldSpan[lastClicked2].classList.remove(
                            "active"
                        );
                    displayFieldSpan[i].classList.add("active");
                    lastClicked2 = i;
                    toRemove = e.target.innerText;
                });
            });
        }
    });

    $(".remove").click(() => {
        if (toRemove != null) {
            for (var i = 0; i < fields.length; i++)
                if (fields[i] == toRemove) fields.splice(i, 1);
            if (displayFieldSpan != 0) {
                displayFieldSpan[lastClicked2].remove();
                toRemove = null;
            }
        }
    });

    $(".next").click(async () => {
        if (fields.length > 0) {
            $(".main").css("display", "none");
            $(".step").css("display", "none");
            $(".buttons").css("display", "none");
            $(".title").css("display", "none");
            $(".table").css("display", "block");
            await createTable(finalArr, fields);
        }
    });
};

$("#file").on("change", fileUpload);
