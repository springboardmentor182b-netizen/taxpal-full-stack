const fs = require('fs');
const path = require('path');

const generateReportFile = async (data) => {
    // For now, generate a simple JSON file with the data
    const fileName = `financial-report-${data.userId}-${Date.now()}.json`;
    const filePath = path.join(__dirname, '../../../temp', fileName); // Assuming temp dir

    // Ensure temp dir exists
    if (!fs.existsSync(path.dirname(filePath))) {
        fs.mkdirSync(path.dirname(filePath), { recursive: true });
    }

    // Write data to file
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

    return filePath;
};

module.exports = { generateReportFile };
