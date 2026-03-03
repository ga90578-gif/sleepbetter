const fs = require('fs');

const content = fs.readFileSync('index.html', 'utf-8');

const headEnd = content.indexOf('</head>') + 7;
const headerEnd = content.indexOf('</header>') + 9;
const headAndHeader = content.substring(0, headerEnd);

const footerStart = content.indexOf('<footer class="footer">');
const footerAndRest = content.substring(footerStart);

const prodStart = content.indexOf('<section id="productos"');
if (prodStart === -1) {
    console.error('Could not find products section');
    process.exit(1);
}

const prodEnd = content.indexOf('</section>', prodStart) + 10;
const productsSection = content.substring(prodStart, prodEnd);

const productosHtml = `${headAndHeader}

    <main style="padding-top: 100px;">
        ${productsSection}
    </main>

    ${footerAndRest}`;

fs.writeFileSync('productos.html', productosHtml, 'utf-8');

const newIndex = content.substring(0, prodStart) + content.substring(prodEnd);
fs.writeFileSync('index.html', newIndex, 'utf-8');

console.log('Success');
