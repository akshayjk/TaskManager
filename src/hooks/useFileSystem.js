import { useState, useCallback } from 'react';

export function useFileSystem() {
    const [fileHandle, setFileHandle] = useState(null);
    const [fileContent, setFileContent] = useState(null);
    const [isDirty, setIsDirty] = useState(false);

    const verifyPermission = async (handle, readWrite) => {
        const options = {};
        if (readWrite) {
            options.mode = 'readwrite';
        }
        if ((await handle.queryPermission(options)) === 'granted') {
            return true;
        }
        if ((await handle.requestPermission(options)) === 'granted') {
            return true;
        }
        return false;
    };

    const openFile = useCallback(async () => {
        try {
            const pickerOptions = {
                types: [
                    {
                        description: 'JSON Files',
                        accept: {
                            'application/json': ['.json'],
                        },
                    },
                ],
                excludeAcceptAllOption: true,
                multiple: false,
            };

            const [handle] = await window.showOpenFilePicker(pickerOptions);
            setFileHandle(handle);

            const file = await handle.getFile();
            const text = await file.text();
            try {
                const json = JSON.parse(text);
                setFileContent(json);
            } catch (e) {
                console.error("Invalid JSON", e);
                alert("Selected file is not valid JSON. Starting with empty data.");
                setFileContent({ tasks: [], notes: [] });
            }
        } catch (err) {
            console.error('Error opening file:', err);
        }
    }, []);

    const saveFile = useCallback(async (content) => {
        if (!fileHandle) return;

        try {
            const hasPerm = await verifyPermission(fileHandle, true);
            if (!hasPerm) return;

            const writable = await fileHandle.createWritable();
            await writable.write(JSON.stringify(content, null, 2));
            await writable.close();
            setFileContent(content);
            setIsDirty(false);
        } catch (err) {
            console.error('Error saving file:', err);
        }
    }, [fileHandle]);

    return {
        fileHandle,
        fileContent,
        setFileContent, // For in-memory updates
        openFile,
        saveFile,
        isDirty
    };
}
