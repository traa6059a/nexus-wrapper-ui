'use client'
import { packageManagers } from '@/consts';
import { PackageManager } from '@/types';
import {
  Text, Heading,
  Select,
  FormHelperText,
  FormControl, Box, FormLabel, SimpleGrid, Button,
  useColorMode,
  useToast
} from '@chakra-ui/react'
import Editor, { } from '@monaco-editor/react';
import { useEffect, useRef, useState } from 'react';

interface MonacoEditor {
  getValue(): string;
}

export default function Page() {

  const [packageManager, setPackageManager] = useState<PackageManager>()
  const [languageVersion, setLanguageVersion] = useState<string | undefined>()
  const [error, setError] = useState<string>()
  const { colorMode, toggleColorMode } = useColorMode()
  const toast = useToast()

  useEffect(() => {
    if (packageManager)
      setLanguageVersion(packageManager?.package.versions[0])
  }, [packageManager])

  const editorRef = useRef<MonacoEditor | null>(null);

  function handleEditorDidMount(editor: MonacoEditor) {
    editorRef.current = editor;
  }

  const handleEditorValidation = (markers: any) => {
    let error = "";
    markers.forEach((marker: any) => error += marker.message + ".\n\r");
    setError(error);
  }
  const download = () => {
    fetch(`${process.env.NEXT_PUBLIC_NEXUS_FETCHER_API_ENDPOINT}/upload?language=${packageManager!.name.toLowerCase()}&version=${languageVersion!}`, {
      method: 'POST',
      body: editorRef.current!.getValue(),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        if (res.status != 200)
          throw new Error("has an error")

        toast({
          title: 'Your request has been reach to server!',
          description: "Waiting to finalization...",
          status: 'success',
          duration: 9000,
          isClosable: true,
        })
      })
      .catch(error => {
        toast({
          title: 'Error',
          description: "",
          status: 'error',
          duration: 9000,
          isClosable: true,
        })
      });
  }
  return (
    <Box p={100}>
      <Box>
        <Button onClick={toggleColorMode}>
          Toggle {colorMode === 'light' ? 'Dark' : 'Light'}
        </Button>
      </Box>
      <Box mb={10}>
        <Heading textAlign='center' mb={10}>Nexus Fetcher</Heading>
        <Text>
          <strong>Nexus fetcher</strong> is a powerful and intuitive tool designed for seamless downloading and management of packages from Nexus repositories. Whether you{"'"}re working on a software development project or managing multiple dependencies, Nexus-Fetcher simplifies the process by providing a streamlined solution for retrieving and organizing packages.
        </Text>
      </Box>
      <SimpleGrid columns={packageManager === undefined ? 1 : 2}>
        <Box maxW='sm'>
          <FormControl>
            <FormLabel>Package managers of language</FormLabel>
            <Select defaultValue={""} onChange={(e) => {
              setPackageManager(packageManagers.find(x => x.name === e.target.value))
            }}>
              <option value={""} disabled>Select package managers</option>
              {packageManagers.map((manager => (
                <option disabled={manager.disabled} key={manager.name} value={manager.name}>{manager.name}</option>
              )))}
            </Select>
            <FormHelperText>such as NPM, Pypi, Maven, etc.</FormHelperText>
          </FormControl>
        </Box>
        {!!packageManager && (
          <Box maxW='sm'>
            <FormControl>
              <FormLabel>Versions of language</FormLabel>
              <Select onChange={(e) => {
                setLanguageVersion(e.target.value)
              }} defaultValue={packageManager!.package.versions[0]}>
                {packageManager.package.versions.map((version => (
                  <option key={version} value={version}>{version}</option>
                )))}
              </Select>
            </FormControl>
          </Box>
        )}

      </SimpleGrid>
      {(!!packageManager) && (
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
      )}
      <Box mt={10}>
        <Button onClick={download} isDisabled={!!error} visibility={!!!packageManager ? "hidden" : "visible"}>Download</Button>
      </Box>
    </Box>
  )
}