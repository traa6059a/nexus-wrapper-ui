'use client'
import { PackageManager, MonacoEditor } from '@/types';
import {

    FormHelperText,
    FormControl, Box, FormLabel,
    useColorMode
} from '@chakra-ui/react'
import Editor from '@monaco-editor/react';
import { Dispatch, MutableRefObject, SetStateAction, useState } from 'react';

export const Editore = ({ packageManager, setIsValid, editorRef }: {
    packageManager: PackageManager,
    setIsValid: Dispatch<SetStateAction<boolean>>,
    editorRef: MutableRefObject<MonacoEditor | null>
}) => {
    console.log("editoring", packageManager.package.format);
    const { colorMode } = useColorMode()
    const [error, setError] = useState<string>()

    function handleEditorDidMount(editor: MonacoEditor) {
        editorRef.current = editor;
    }

    const handleEditorValidation = (markers: { message: string }[]) => {
        let error = '';
        markers.forEach((marker: { message: string }) => error += marker.message);
        setError(error);

        if (error !== '')
            setIsValid(false);
    }
    return (
        <Box mt={10}>
            <FormControl>
                <FormLabel>Format of package manager</FormLabel>
                <Editor height="30vh"
                    language={packageManager!.package.language}
                    value={packageManager!.package.format}
                    onMount={handleEditorDidMount}
                    onValidate={handleEditorValidation}
                    theme={colorMode === 'light' ? "light" : "vs-dark"}
                />
                {error && (
                    <FormHelperText color="red">Format error: {error}</FormHelperText>
                )}
            </FormControl>
        </Box>
    )
}

