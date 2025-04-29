# ContextCraft ✨

Generate LLM context prompts from local folders directly in your browser! No installation needed, and your files stay securely on your device.

## The Problem 🤔

Manually copying file trees and the contents of multiple source files into a Large Language Model (LLM) prompt is tedious, time-consuming, and error-prone.

## The Solution 🚀

**ContextCraft** simplifies this process entirely within your web browser. Using the modern File System Access API, it allows you to:

1.  Select a project folder on your local machine.
2.  Automatically generate a clean file tree structure.
3.  Extract the content of common text-based files (like `.py`, `.js`, `.md`, `.txt`, etc.).
4.  Combine everything into a single, formatted text block, ready to be copied and pasted directly into your favorite LLM.

## Features ✨

*   **Purely Browser-Based:** Runs 100% in your browser. No server, no installation, no dependencies beyond a modern browser.
*   **Privacy-Focused:** Your files are accessed locally via the File System Access API and **never leave your machine**. Requires explicit user permission.
*   **File Tree Generation:** Creates an easy-to-read directory structure.
*   **Automatic Content Extraction:** Reads content from configurable text file types.
*   **Configurable:** Easily customize which file extensions to include and which files/folders to ignore via `script.js`.
*   **Simple Output:** Cleanly formatted text output, perfect for LLM context windows.
*   **Copy to Clipboard:** Convenient button to copy the entire generated context.

## How to Use 📋

1.  **Download/Clone:** Get the `index.html` and `script.js` files from this repository.
2.  **Open:** Open the `index.html` file in a modern web browser (Chrome, Edge, Firefox, Safari recommended).
3.  **Select Folder:** Click the "Select Folder" button.
4.  **Grant Permission:** Choose the project folder you want to process and grant the browser permission to read its contents when prompted.
5.  **Copy Output:** Wait for the processing to complete. The file tree and contents will appear in the text area. Click the "Copy to Clipboard" button.
6.  **Paste into LLM:** Paste the copied context into your LLM prompt window!

## Output Format

The generated output follows this structure:

```
YourSelectedFolderName/
└── file1.txt
├── subfolder/
│ └── script.py
└── README.md

file1.txt

=== FILE CONTENT START ===
Content of the first text file.
=== FILE CONTENT END ===

subfolder/script.py

=== FILE CONTENT START ===

A python script example

print("Hello from script!")
=== FILE CONTENT END ===

README.md

=== FILE CONTENT START ===

Project Title

This is the readme content.
=== FILE CONTENT END ===
```

## Technology Used 💻

*   HTML5
*   CSS3
*   JavaScript (ES6+)
*   [File System Access API](https://developer.mozilla.org/en-US/docs/Web/API/File_System_Access_API)

## Configuration ⚙️

You can customize the behavior by editing these constants at the top of `script.js`:

*   `TEXT_FILE_EXTENSIONS`: A `Set` of file extensions (lowercase, including the dot) and specific filenames (like `readme`) whose content should be included.
*   `IGNORE_LIST`: A `Set` of folder and file names (lowercase) to completely exclude from both the tree and content extraction (e.g., `.git`, `node_modules`).

## Browser Compatibility 🌐

This tool relies on the File System Access API, which is supported in most modern browsers. Check [Can I use](https://caniuse.com/native-filesystem-api) for specific version support.

## Security & Privacy 🔒

**Your data stays local.** This tool operates entirely within your browser sandbox. Files are only accessed when you explicitly select a folder and grant permission through the browser's native dialogs. No data is uploaded or sent anywhere.

## Contributing 🙌

Contributions, issues, and feature requests are welcome! Feel free to check [issues page](https://github.com/louiskaneko34m/ContextCraft/issues)

## License 📄

Distributed under the MIT License. 
