document.getElementById('csvFileInput').addEventListener('change', function (event) {
    const file = event.target.files[0];
    
    if (file) {
        Papa.parse(file, {
            header: true,
            complete: function(results) {
                setupColumnSelector(results.data);
            }
        });
    }
});

function setupColumnSelector(data) {
    if (data.length === 0) {
        return;
    }

    const columnSelector = document.getElementById('columnSelector');
    columnSelector.innerHTML = '';  // 古い内容をクリアする

    // ヘッダーを取得してチェックボックスを作成
    const headers = Object.keys(data[0]);
    headers.forEach(header => {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = header;
        checkbox.id = `column-${header}`;
        checkbox.checked = true;  // 初期状態ではすべてチェック

        const label = document.createElement('label');
        label.htmlFor = `column-${header}`;
        label.innerText = header;

        columnSelector.appendChild(checkbox);
        columnSelector.appendChild(label);
        columnSelector.appendChild(document.createElement('br'));

        checkbox.addEventListener('change', () => displayTable(data));
    });

    // 最初のテーブルを表示
    displayTable(data);
}

function displayTable(data) {
    const tableContainer = document.getElementById('csvTable');
    tableContainer.innerHTML = '';  // 古い内容をクリアする

    const selectedColumns = Array.from(document.querySelectorAll('#columnSelector input:checked'))
                                 .map(input => input.value);

    if (selectedColumns.length === 0) {
        tableContainer.innerText = 'Please select at least one column';
        return;
    }

    const table = document.createElement('table');

    // ヘッダー行を作成
    const headerRow = document.createElement('tr');
    selectedColumns.forEach(column => {
        const th = document.createElement('th');
        th.innerText = column;
        headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    // データ行を作成
    data.forEach(row => {
        const dataRow = document.createElement('tr');
        selectedColumns.forEach(column => {
            const td = document.createElement('td');
            td.innerText = row[column];
            dataRow.appendChild(td);
        });
        table.appendChild(dataRow);
    });

    // テーブルをコンテナに追加
    tableContainer.appendChild(table);
}
