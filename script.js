const selectFolderBtn = document.getElementById('selectFolderBtn');
const outputArea = document.getElementById('outputArea');
const statusDiv = document.getElementById('status');
const copyBtn = document.getElementById('copyBtn');

// --- Configuration ---
const TEXT_FILE_EXTENSIONS = new Set([
    '.py', '.js', '.html', '.css', '.json', '.md', '.txt',
    '.cfg', '.ini', '.yaml', '.yml', '.sh', '.bat', '.xml',
    '.java', '.c', '.cpp', '.h', '.hpp', '.cs', '.go', '.php',
    '.rb', '.rs', '.swift', '.kt', '.kts', '.sql', '.dockerfile',
    'readme', '.gitignore', '.env', '.config', '.toml'
]);

const IGNORE_LIST = new Set([
    '.git', '.vscode', '.idea', 'node_modules', '__pycache__',
    '.DS_Store', 'venv', '.env', 'dist', 'build', 'target',
]);

// --- Event Listener ---
selectFolderBtn.addEventListener('click', async () => {
    try {
        const directoryHandle = await window.showDirectoryPicker();

        if (!directoryHandle) {
            statusDiv.textContent = 'Status: Folder selection cancelled.';
            return;
        }

        statusDiv.textContent = 'Status: Processing folder...';
        outputArea.value = '';
        copyBtn.style.display = 'none';

        // Start processing - Pass empty string for initial relative path
        const { tree, fileContents } = await processDirectory(directoryHandle, '', ''); // Pass '' for relativePath

        // Combine and display results in the new desired format
        const fullOutput = `${directoryHandle.name}/\n${tree}\n\n${fileContents}`;
        outputArea.value = fullOutput;
        statusDiv.textContent = `Status: Done processing folder "${directoryHandle.name}".`;
        copyBtn.style.display = 'inline-block';

    } catch (error) {
        if (error.name === 'AbortError') {
            statusDiv.textContent = 'Status: Folder selection cancelled.';
        } else {
            statusDiv.textContent = `Status: Error - ${error.message}`;
            console.error('Error accessing directory:', error);
        }
        outputArea.value = `Error: ${error.message}\n\nPlease ensure your browser supports the File System Access API and you grant permission.`;
        copyBtn.style.display = 'none';
    }
});

copyBtn.addEventListener('click', () => {
    outputArea.select();
    try {
        document.execCommand('copy');
        statusDiv.textContent = 'Status: Copied to clipboard!';
    } catch (err) {
        statusDiv.textContent = 'Status: Failed to copy (try manual copy).';
        console.error('Copy failed:', err);
    }
     window.getSelection().removeAllRanges();
});


// --- Core Processing Function ---
async function processDirectory(directoryHandle, relativePath, indent) {
    let tree = '';
    let fileContents = '';

    const entries = [];
    for await (const entry of directoryHandle.values()) {
         if (!IGNORE_LIST.has(entry.name.toLowerCase())) {
            entries.push(entry);
         }
    }

    entries.sort((a, b) => {
        if (a.kind !== b.kind) {
            return a.kind === 'directory' ? -1 : 1;
        }
        return a.name.localeCompare(b.name);
    });

    for (let i = 0; i < entries.length; i++) {
        const entry = entries[i];
        const isLast = i === entries.length - 1;
        const connector = isLast ? '└── ' : '├── ';
        const currentRelativePath = relativePath ? `${relativePath}/${entry.name}` : entry.name;

        if (entry.kind === 'directory') {
            tree += `${indent}${connector}${entry.name}/\n`;
            const subIndent = indent + (isLast ? '    ' : '│   ');
            const subResult = await processDirectory(entry, currentRelativePath, subIndent);
            tree += subResult.tree;
            fileContents += subResult.fileContents;
        } else if (entry.kind === 'file') {
            tree += `${indent}${connector}${entry.name}\n`;
            if (isTextFile(entry.name)) {
                try {
                    const file = await entry.getFile();
                    const content = await file.text();
                    // **MODIFIED LINES HERE** - Using start and end markers
                    fileContents += `# ${currentRelativePath}\n=== FILE CONTENT START ===\n${content}\n=== FILE CONTENT END ===\n\n`;
                } catch (readError) {
                    console.warn(`Could not read file: ${currentRelativePath}`, readError);
                    // **MODIFIED LINES HERE** - Using start and end markers in error message
                    fileContents += `# ${currentRelativePath}\n=== FILE CONTENT START ===\n# --- Error reading file: ${readError.message} ---\n=== FILE CONTENT END ===\n\n`;
                }
            }
        }
    }

    return { tree, fileContents };
}

// --- Helper Function ---
function isTextFile(filename) {
    const lowerFilename = filename.toLowerCase();
    if (TEXT_FILE_EXTENSIONS.has(lowerFilename)) {
        return true;
    }
    const extension = '.' + lowerFilename.split('.').pop();
    return TEXT_FILE_EXTENSIONS.has(extension);
}