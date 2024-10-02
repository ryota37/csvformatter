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

        checkbox.addEventListener('change', () => displayDataAsList(data));
    });

    // 最初の表示
    displayDataAsList(data);
}

function displayDataAsList(data) {
    const dataContainer = document.getElementById('csvDataDisplay');
    dataContainer.innerHTML = '';  // 古い内容をクリアする

    const selectedColumns = Array.from(document.querySelectorAll('#columnSelector input:checked'))
                                 .map(input => input.value);

    if (selectedColumns.length === 0) {
        dataContainer.innerText = 'Please select at least one column';
        return;
    }

    // 選択した列ごとにデータを表示
    selectedColumns.forEach(column => {
        const header = document.createElement('h3');
        header.innerText = column;
        dataContainer.appendChild(header);

        const list = document.createElement('ul');

        data.forEach((row, index) => {
            if (index > 0) {  // 2行目以降をリストとして表示
                const cellValue = row[column];
                if (cellValue && cellValue.trim() !== '') {  // 空白でないかをチェック
                    const listItem = document.createElement('li');
                    listItem.innerText = cellValue;
                    list.appendChild(listItem);
                }
            }
        });

        if (list.childElementCount > 0) {
            dataContainer.appendChild(list);
        }
    });
}
