// CSV Insight Explorer JavaScript
class CSVInsightExplorer {
    constructor() {
        this.initializeElements();
        this.bindEvents();
        this.currentData = null;
        this.currentColumns = null;
    }

    initializeElements() {
        this.csvFile = document.getElementById('csvFile');
        this.fileUploadArea = document.getElementById('fileUploadArea');
        this.fileDropZone = document.getElementById('fileDropZone');
        this.browseBtn = document.getElementById('browseBtn');
        this.clearFileBtn = document.getElementById('clearFileBtn');
        this.fileInfo = document.getElementById('fileInfo');
        this.fileName = document.getElementById('fileName');
        this.fileSize = document.getElementById('fileSize');

        // Data preview
        this.dataPreview = document.getElementById('dataPreview');
        this.dataTable = document.getElementById('dataTable');
        this.tableHead = document.getElementById('tableHead');
        this.tableBody = document.getElementById('tableBody');
        this.rowCount = document.getElementById('rowCount');
        this.colCount = document.getElementById('colCount');

        // Query section
        this.querySection = document.getElementById('querySection');
        this.queryInput = document.getElementById('queryInput');
        this.askBtn = document.getElementById('askBtn');
        this.clearQueryBtn = document.getElementById('clearQueryBtn');
        this.columnsList = document.getElementById('columnsList');

        // Results
        this.queryResults = document.getElementById('queryResults');
        this.resultsContent = document.getElementById('resultsContent');
        this.copyResultsBtn = document.getElementById('copyResultsBtn');
        this.exportResultsBtn = document.getElementById('exportResultsBtn');

        // Sample data
        this.sampleDataSection = document.getElementById('sampleDataSection');
        this.loadSampleBtn = document.getElementById('loadSampleBtn');
    }

    bindEvents() {
        // File upload events
        this.browseBtn.addEventListener('click', () => this.csvFile.click());
        this.csvFile.addEventListener('change', (e) => this.handleFileSelect(e));
        this.clearFileBtn.addEventListener('click', () => this.clearFile());

        // Drag and drop events
        this.fileDropZone.addEventListener('dragover', (e) => this.handleDragOver(e));
        this.fileDropZone.addEventListener('dragleave', (e) => this.handleDragLeave(e));
        this.fileDropZone.addEventListener('drop', (e) => this.handleFileDrop(e));

        // Query events
        this.askBtn.addEventListener('click', () => this.processQuery());
        this.clearQueryBtn.addEventListener('click', () => this.clearQuery());
        this.queryInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
                this.processQuery();
            }
        });

        // Quick query buttons
        document.querySelectorAll('.quick-query').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const query = e.target.getAttribute('data-query');
                this.queryInput.value = query;
                this.processQuery();
            });
        });

        // Results actions
        this.copyResultsBtn.addEventListener('click', () => this.copyResults());
        this.exportResultsBtn.addEventListener('click', () => this.exportResults());

        // Sample data
        this.loadSampleBtn.addEventListener('click', () => this.loadSampleData());
    }

    handleDragOver(e) {
        e.preventDefault();
        this.fileDropZone.classList.add('border-teal-400', 'bg-teal-400', 'bg-opacity-10');
    }

    handleDragLeave(e) {
        e.preventDefault();
        this.fileDropZone.classList.remove('border-teal-400', 'bg-teal-400', 'bg-opacity-10');
    }

    handleFileDrop(e) {
        e.preventDefault();
        this.fileDropZone.classList.remove('border-teal-400', 'bg-teal-400', 'bg-opacity-10');

        const files = e.dataTransfer.files;
        if (files.length > 0 && files[0].type === 'text/csv') {
            this.processFile(files[0]);
        } else {
            this.showError('Please drop a valid CSV file.');
        }
    }

    handleFileSelect(e) {
        const file = e.target.files[0];
        if (file) {
            this.processFile(file);
        }
    }

    processFile(file) {
        if (!file.name.endsWith('.csv')) {
            this.showError('Please select a CSV file.');
            return;
        }

        // Show file info
        this.fileName.textContent = file.name;
        this.fileSize.textContent = `${(file.size / 1024).toFixed(1)} KB`;
        this.fileInfo.classList.remove('hidden');

        // Read and parse CSV
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const csvData = this.parseCSV(e.target.result);
                this.loadData(csvData);
            } catch (error) {
                this.showError('Error parsing CSV file. Please check the file format.');
            }
        };
        reader.readAsText(file);
    }

    parseCSV(csvText) {
        const lines = csvText.split('\n').filter(line => line.trim());
        if (lines.length === 0) {
            throw new Error('Empty CSV file');
        }

        const headers = this.parseCSVLine(lines[0]);
        const data = [];

        for (let i = 1; i < lines.length; i++) {
            const values = this.parseCSVLine(lines[i]);
            if (values.length === headers.length) {
                const row = {};
                headers.forEach((header, index) => {
                    row[header] = values[index];
                });
                data.push(row);
            }
        }

        return { headers, data };
    }

    parseCSVLine(line) {
        const result = [];
        let current = '';
        let inQuotes = false;

        for (let i = 0; i < line.length; i++) {
            const char = line[i];

            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                result.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }

        result.push(current.trim());
        return result;
    }

    loadData(csvData) {
        this.currentData = csvData.data;
        this.currentColumns = csvData.headers;

        // Hide sample section
        this.sampleDataSection.classList.add('hidden');

        // Show data preview
        this.displayDataPreview(csvData);

        // Show query section
        this.querySection.classList.remove('hidden');

        // Display columns
        this.displayColumns();

        this.showSuccess('CSV file loaded successfully!');
    }

    displayDataPreview(csvData) {
        const { headers, data } = csvData;

        // Update counts
        this.rowCount.textContent = `${data.length} rows`;
        this.colCount.textContent = `${headers.length} columns`;

        // Create table header
        this.tableHead.innerHTML = `
            <tr class="border-b border-gray-600">
                ${headers.map(header => `<th class="text-left p-2 font-medium text-teal-300">${header}</th>`).join('')}
            </tr>
        `;

        // Create table body (first 10 rows)
        const previewRows = data.slice(0, 10);
        this.tableBody.innerHTML = previewRows.map(row => `
            <tr class="border-b border-gray-700 hover:bg-gray-700 hover:bg-opacity-50">
                ${headers.map(header => `<td class="p-2 text-gray-300">${row[header] || ''}</td>`).join('')}
            </tr>
        `).join('');

        this.dataPreview.classList.remove('hidden');
    }

    displayColumns() {
        this.columnsList.innerHTML = this.currentColumns.map(column => {
            const columnType = this.detectColumnType(column);
            const uniqueCount = this.getUniqueCount(column);
            const nullCount = this.getNullCount(column);

            return `
                <div class="column-card bg-gray-700 bg-opacity-50 rounded-lg p-3 border-l-4 border-teal-500">
                    <div class="flex justify-between items-start">
                        <div>
                            <p class="font-medium text-teal-300">${column}</p>
                            <p class="text-xs text-gray-400">Type: ${columnType}</p>
                        </div>
                        <div class="text-right">
                            <p class="text-xs text-gray-400">Unique: ${uniqueCount}</p>
                            <p class="text-xs text-gray-400">Empty: ${nullCount}</p>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    detectColumnType(column) {
        const values = this.currentData.map(row => row[column]).filter(val => val && val.trim());

        if (values.length === 0) return 'empty';

        // Check if all values are numbers
        const numericValues = values.filter(val => !isNaN(val) && val !== '');
        if (numericValues.length === values.length) {
            return 'numeric';
        }

        // Check if all values are dates
        const dateValues = values.filter(val => !isNaN(Date.parse(val)));
        if (dateValues.length === values.length) {
            return 'date';
        }

        // Check for boolean-like values
        const boolValues = values.filter(val =>
            ['true', 'false', 'yes', 'no', '1', '0'].includes(val.toLowerCase())
        );
        if (boolValues.length === values.length) {
            return 'boolean';
        }

        return 'text';
    }

    getUniqueCount(column) {
        const values = this.currentData.map(row => row[column]).filter(val => val && val.trim());
        return new Set(values).size;
    }

    getNullCount(column) {
        return this.currentData.filter(row => !row[column] || row[column].trim() === '').length;
    }

    processQuery() {
        const query = this.queryInput.value.trim();

        if (!query) {
            this.showError('Please enter a query.');
            return;
        }

        // Show loading state
        this.askBtn.querySelector('span').textContent = 'Analyzing...';
        this.askBtn.disabled = true;

        // Simulate AI processing
        setTimeout(() => {
            const results = this.analyzeQuery(query);
            this.displayResults(results, query);
            this.askBtn.querySelector('span').textContent = '🔍 Analyze Data';
            this.askBtn.disabled = false;
        }, 1500);
    }

    analyzeQuery(query) {
        const lowerQuery = query.toLowerCase();
        const results = [];

        // Summary statistics
        if (lowerQuery.includes('summary') || lowerQuery.includes('statistics') || lowerQuery.includes('stats')) {
            results.push(this.generateSummaryStats());
        }

        // Column information
        if (lowerQuery.includes('column') || lowerQuery.includes('field') || lowerQuery.includes('type')) {
            results.push(this.generateColumnInfo());
        }

        // Missing values
        if (lowerQuery.includes('missing') || lowerQuery.includes('null') || lowerQuery.includes('empty')) {
            results.push(this.generateMissingValuesReport());
        }

        // Unique values
        if (lowerQuery.includes('unique') || lowerQuery.includes('distinct')) {
            results.push(this.generateUniqueValuesReport());
        }

        // Average, mean calculations
        if (lowerQuery.includes('average') || lowerQuery.includes('mean')) {
            results.push(this.calculateAverages());
        }

        // Top/bottom values
        if (lowerQuery.includes('top') || lowerQuery.includes('highest') || lowerQuery.includes('maximum')) {
            results.push(this.findTopValues());
        }

        if (lowerQuery.includes('bottom') || lowerQuery.includes('lowest') || lowerQuery.includes('minimum')) {
            results.push(this.findBottomValues());
        }

        // Count operations
        if (lowerQuery.includes('count') || lowerQuery.includes('how many')) {
            results.push(this.generateCounts());
        }

        // If no specific analysis found, provide general insights
        if (results.length === 0) {
            results.push(this.generateGeneralInsights());
        }

        return results;
    }

    generateSummaryStats() {
        const numericColumns = this.currentColumns.filter(col =>
            this.detectColumnType(col) === 'numeric'
        );

        const stats = {
            title: '📈 Summary Statistics',
            type: 'summary',
            content: `Dataset contains ${this.currentData.length} rows and ${this.currentColumns.length} columns.`
        };

        if (numericColumns.length > 0) {
            stats.content += ` Found ${numericColumns.length} numeric columns for statistical analysis.`;
        }

        return stats;
    }

    generateColumnInfo() {
        const columnInfo = this.currentColumns.map(col => ({
            name: col,
            type: this.detectColumnType(col),
            unique: this.getUniqueCount(col),
            empty: this.getNullCount(col)
        }));

        return {
            title: '📋 Column Information',
            type: 'columns',
            content: columnInfo
        };
    }

    generateMissingValuesReport() {
        const missingReport = {};
        let totalMissing = 0;

        this.currentColumns.forEach(col => {
            const missing = this.getNullCount(col);
            if (missing > 0) {
                missingReport[col] = missing;
                totalMissing += missing;
            }
        });

        const missingPercentage = ((totalMissing / (this.currentData.length * this.currentColumns.length)) * 100).toFixed(1);

        return {
            title: '❓ Missing Values Analysis',
            type: 'missing',
            content: {
                totalMissing,
                missingPercentage,
                columnsWithMissing: Object.keys(missingReport).length,
                details: missingReport
            }
        };
    }

    generateUniqueValuesReport() {
        const uniqueReport = {};

        this.currentColumns.forEach(col => {
            const uniqueCount = this.getUniqueCount(col);
            const totalCount = this.currentData.length - this.getNullCount(col);

            if (uniqueCount < 20 && uniqueCount > 1) { // Only show for columns with reasonable number of unique values
                uniqueReport[col] = {
                    uniqueCount,
                    totalCount,
                    percentage: ((uniqueCount / totalCount) * 100).toFixed(1)
                };
            }
        });

        return {
            title: '🔢 Unique Values Analysis',
            type: 'unique',
            content: uniqueReport
        };
    }

    calculateAverages() {
        const numericColumns = this.currentColumns.filter(col =>
            this.detectColumnType(col) === 'numeric'
        );

        const averages = {};

        numericColumns.forEach(col => {
            const values = this.currentData
                .map(row => parseFloat(row[col]))
                .filter(val => !isNaN(val));

            if (values.length > 0) {
                const average = values.reduce((sum, val) => sum + val, 0) / values.length;
                const min = Math.min(...values);
                const max = Math.max(...values);

                averages[col] = {
                    average: average.toFixed(2),
                    min: min.toFixed(2),
                    max: max.toFixed(2),
                    count: values.length
                };
            }
        });

        return {
            title: '📊 Statistical Analysis',
            type: 'statistics',
            content: averages
        };
    }

    findTopValues() {
        const results = {};

        // Find top values for numeric columns
        const numericColumns = this.currentColumns.filter(col =>
            this.detectColumnType(col) === 'numeric'
        );

        numericColumns.forEach(col => {
            const values = this.currentData
                .map(row => ({ value: parseFloat(row[col]), row }))
                .filter(item => !isNaN(item.value))
                .sort((a, b) => b.value - a.value)
                .slice(0, 5);

            if (values.length > 0) {
                results[col] = values;
            }
        });

        return {
            title: '🔝 Top Values',
            type: 'top',
            content: results
        };
    }

    findBottomValues() {
        const results = {};

        // Find bottom values for numeric columns
        const numericColumns = this.currentColumns.filter(col =>
            this.detectColumnType(col) === 'numeric'
        );

        numericColumns.forEach(col => {
            const values = this.currentData
                .map(row => ({ value: parseFloat(row[col]), row }))
                .filter(item => !isNaN(item.value))
                .sort((a, b) => a.value - b.value)
                .slice(0, 5);

            if (values.length > 0) {
                results[col] = values;
            }
        });

        return {
            title: '🔻 Bottom Values',
            type: 'bottom',
            content: results
        };
    }

    generateCounts() {
        const counts = {
            totalRows: this.currentData.length,
            totalColumns: this.currentColumns.length,
            numericColumns: this.currentColumns.filter(col => this.detectColumnType(col) === 'numeric').length,
            textColumns: this.currentColumns.filter(col => this.detectColumnType(col) === 'text').length,
            dateColumns: this.currentColumns.filter(col => this.detectColumnType(col) === 'date').length
        };

        return {
            title: '📊 Dataset Counts',
            type: 'counts',
            content: counts
        };
    }

    generateGeneralInsights() {
        const insights = [];

        // Data quality insights
        const totalCells = this.currentData.length * this.currentColumns.length;
        let emptyCells = 0;
        this.currentColumns.forEach(col => {
            emptyCells += this.getNullCount(col);
        });

        const completeness = ((totalCells - emptyCells) / totalCells * 100).toFixed(1);
        insights.push(`Data completeness: ${completeness}%`);

        // Column type distribution
        const numericCount = this.currentColumns.filter(col => this.detectColumnType(col) === 'numeric').length;
        const textCount = this.currentColumns.filter(col => this.detectColumnType(col) === 'text').length;

        if (numericCount > 0) {
            insights.push(`Contains ${numericCount} numeric columns for analysis`);
        }
        if (textCount > 0) {
            insights.push(`Contains ${textCount} text columns for categorization`);
        }

        return {
            title: '💡 General Insights',
            type: 'insights',
            content: insights
        };
    }

    displayResults(results, query) {
        this.resultsContent.innerHTML = `
            <div class="bg-gray-700 bg-opacity-50 rounded-lg p-3 mb-4">
                <p class="text-sm text-gray-300">Query: <span class="text-teal-300">"${query}"</span></p>
            </div>
            ${results.map(result => this.renderResult(result)).join('')}
        `;

        this.queryResults.classList.remove('hidden');
        this.queryResults.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    renderResult(result) {
        switch (result.type) {
            case 'summary':
                return `
                    <div class="result-card bg-gray-700 bg-opacity-50 rounded-lg p-4 border-l-4 border-teal-500">
                        <h4 class="font-medium text-teal-300 mb-2">${result.title}</h4>
                        <p class="text-gray-200">${result.content}</p>
                    </div>
                `;

            case 'columns':
                return `
                    <div class="result-card bg-gray-700 bg-opacity-50 rounded-lg p-4 border-l-4 border-blue-500">
                        <h4 class="font-medium text-blue-300 mb-2">${result.title}</h4>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                            ${result.content.map(col => `
                                <div class="bg-gray-800 bg-opacity-50 rounded p-2">
                                    <p class="text-sm font-medium text-gray-300">${col.name}</p>
                                    <p class="text-xs text-gray-400">Type: ${col.type} | Unique: ${col.unique} | Empty: ${col.empty}</p>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;

            case 'missing':
                return `
                    <div class="result-card bg-gray-700 bg-opacity-50 rounded-lg p-4 border-l-4 border-yellow-500">
                        <h4 class="font-medium text-yellow-300 mb-2">${result.title}</h4>
                        <p class="text-sm text-gray-300 mb-2">Total missing: ${result.content.totalMissing} (${result.content.missingPercentage}% of all cells)</p>
                        <p class="text-sm text-gray-300">Columns with missing data: ${result.content.columnsWithMissing}</p>
                        ${Object.keys(result.content.details).length > 0 ? `
                            <div class="mt-2">
                                ${Object.entries(result.content.details).map(([col, count]) =>
                                    `<span class="inline-block bg-yellow-500 bg-opacity-20 text-yellow-300 text-xs px-2 py-1 rounded mr-2 mb-1">${col}: ${count}</span>`
                                ).join('')}
                            </div>
                        ` : ''}
                    </div>
                `;

            case 'statistics':
                return `
                    <div class="result-card bg-gray-700 bg-opacity-50 rounded-lg p-4 border-l-4 border-green-500">
                        <h4 class="font-medium text-green-300 mb-2">${result.title}</h4>
                        <div class="space-y-2">
                            ${Object.entries(result.content).map(([col, stats]) => `
                                <div class="bg-gray-800 bg-opacity-50 rounded p-2">
                                    <p class="text-sm font-medium text-gray-300">${col}</p>
                                    <p class="text-xs text-gray-400">Average: ${stats.average} | Min: ${stats.min} | Max: ${stats.max} | Count: ${stats.count}</p>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;

            case 'insights':
                return `
                    <div class="result-card bg-gray-700 bg-opacity-50 rounded-lg p-4 border-l-4 border-purple-500">
                        <h4 class="font-medium text-purple-300 mb-2">${result.title}</h4>
                        <ul class="space-y-1">
                            ${result.content.map(insight =>
                                `<li class="text-sm text-gray-200">• ${insight}</li>`
                            ).join('')}
                        </ul>
                    </div>
                `;

            default:
                return `
                    <div class="result-card bg-gray-700 bg-opacity-50 rounded-lg p-4 border-l-4 border-gray-500">
                        <h4 class="font-medium text-gray-300 mb-2">${result.title}</h4>
                        <pre class="text-xs text-gray-300 overflow-x-auto">${JSON.stringify(result.content, null, 2)}</pre>
                    </div>
                `;
        }
    }

    clearQuery() {
        this.queryInput.value = '';
        this.queryResults.classList.add('hidden');
    }

    clearFile() {
        this.csvFile.value = '';
        this.fileInfo.classList.add('hidden');
        this.dataPreview.classList.add('hidden');
        this.querySection.classList.add('hidden');
        this.queryResults.classList.add('hidden');
        this.sampleDataSection.classList.remove('hidden');
        this.currentData = null;
        this.currentColumns = null;
    }

    async copyResults() {
        const resultsText = this.extractResultsText();

        try {
            await navigator.clipboard.writeText(resultsText);
            this.showSuccess('Results copied to clipboard!');
        } catch (err) {
            this.showError('Failed to copy results. Please select and copy manually.');
        }
    }

    extractResultsText() {
        let text = 'CSV INSIGHT EXPLORER RESULTS\n';
        text += '=' .repeat(50) + '\n\n';

        if (this.queryInput.value) {
            text += `Query: "${this.queryInput.value}"\n\n`;
        }

        const resultCards = this.resultsContent.querySelectorAll('.result-card');
        resultCards.forEach(card => {
            const title = card.querySelector('h4').textContent;
            text += `${title}\n${'-'.repeat(title.length)}\n`;

            const content = card.querySelector('p, .grid, ul, pre, div.space-y-2');
            if (content) {
                text += content.textContent + '\n\n';
            }
        });

        text += `\nGenerated on: ${new Date().toLocaleString()}\n`;
        text += 'Tool: CSV Insight Explorer by Philemon Ofotan';

        return text;
    }

    exportResults() {
        const resultsText = this.extractResultsText();

        // Create and download file
        const blob = new Blob([resultsText], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `csv-insights-${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        this.showSuccess('Results exported successfully!');
    }

    loadSampleData() {
        const sampleData = {
            headers: ['Product', 'Price', 'Category', 'Sales', 'Rating', 'Stock'],
            data: [
                { Product: 'Laptop', Price: '999.99', Category: 'Electronics', Sales: '45', Rating: '4.5', Stock: '12' },
                { Product: 'Mouse', Price: '29.99', Category: 'Electronics', Sales: '120', Rating: '4.2', Stock: '85' },
                { Product: 'Keyboard', Price: '79.99', Category: 'Electronics', Sales: '67', Rating: '4.7', Stock: '34' },
                { Product: 'Monitor', Price: '299.99', Category: 'Electronics', Sales: '23', Rating: '4.6', Stock: '8' },
                { Product: 'Desk Chair', Price: '199.99', Category: 'Furniture', Sales: '34', Rating: '4.1', Stock: '15' },
                { Product: 'Desk', Price: '399.99', Category: 'Furniture', Sales: '18', Rating: '4.4', Stock: '6' },
                { Product: 'Headphones', Price: '149.99', Category: 'Electronics', Sales: '89', Rating: '4.3', Stock: '42' },
                { Product: 'Webcam', Price: '59.99', Category: 'Electronics', Sales: '156', Rating: '4.0', Stock: '67' },
                { Product: 'Coffee Mug', Price: '12.99', Category: 'Kitchen', Sales: '234', Rating: '4.8', Stock: '120' },
                { Product: 'Notebook', Price: '8.99', Category: 'Office', Sales: '345', Rating: '4.2', Stock: '200' }
            ]
        };

        this.loadData(sampleData);
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 px-6 py-3 rounded-lg text-white font-medium z-50 ${
            type === 'error' ? 'bg-red-500' : 'bg-green-500'
        }`;
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Initialize the CSV Insight Explorer when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CSVInsightExplorer();
});