'use client'
import { download } from '@/actions/apis';
import { Editore } from '@/components/editor';
import { packageManagers } from '@/consts';
import { PackageManager, MonacoEditor, Mode } from '@/types';
import {
  Text, Heading,
  Select,
  FormHelperText,
  FormControl, Box, FormLabel, SimpleGrid, Button,
  useColorMode,
  useToast,
  Radio,
  Stack,
  RadioGroup,
  Input
} from '@chakra-ui/react'
import { useEffect, useRef, useState } from 'react';

export default function Page() {

  const [isValid, setIsValid] = useState(false)
  const [packageManager, setPackageManager] = useState<PackageManager>()
  const [languageVersion, setLanguageVersion] = useState<string | undefined>()
  const [mode, setMode] = useState<Mode>(Mode.Single)
  const editorRef = useRef<MonacoEditor | null>(null);

  const { colorMode, toggleColorMode } = useColorMode()
  const toast = useToast()

  useEffect(() => {
    if (packageManager)
      setLanguageVersion(packageManager?.package.versions[0])
  }, [packageManager])



  return (
    <Box p={100}>
      <Box>
        <Button onClick={toggleColorMode}>
          Toggle {colorMode === 'light' ? 'Dark' : 'Light'}
        </Button>
      </Box>
      <Box>
        <Heading textAlign='center' mb={10}>Nexus Fetcher</Heading>
        <Text>
          <strong>Nexus fetcher</strong> is a powerful and intuitive tool designed for seamless downloading and management of packages from Nexus repositories. Whether you{"'"}re working on a software development project or managing multiple dependencies, Nexus-Fetcher simplifies the process by providing a streamlined solution for retrieving and organizing packages.
        </Text>
      </Box>
      <Box m={10}>
        <RadioGroup onChange={(_mode: "Single" | "Multiple") => {
          setMode(Mode[_mode]);
        }} defaultValue={Mode[Mode.Single]}>
          <Stack direction='row'>
            {[Mode.Single, Mode.Multiple].map((mode) => (
              <Radio key={Mode[mode]} value={Mode[mode]}>{Mode[mode]}</Radio>
            ))}
          </Stack>
        </RadioGroup>
      </Box>
      <SimpleGrid columns={5}>
        <Box>
          <FormControl>
            <FormLabel>Package managers of language <RequiredSpan /></FormLabel>
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
          <Box width={100}>
            <FormControl>
              <FormLabel>Versions <RequiredSpan /></FormLabel>
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
        {mode == Mode.Single && !!packageManager && (
          <SinglePackageSelection />
        )}
        {mode == Mode.Multiple && !!packageManager && (
          <Box>
            <FormControl>
              <FormLabel>Upload your package (Optional)</FormLabel>
              <Input type='file' multiple={false} onChange={(e) => {
                if (e.target.files == null) return;

                const file = e.target.files[0];

                if (file) {
                  const reader = new FileReader();

                  reader.onload = (e) => {
                    const format = e.target!.result;
                    if (format == null) return;

                    const newPackageManager = { ...packageManager };
                    newPackageManager.package.format = format as string;
                    setPackageManager(newPackageManager);
                  };
                  reader.readAsText(file);
                }
              }} />
            </FormControl>
          </Box>
        )}
      </SimpleGrid>

      {mode == Mode.Multiple && !!packageManager && (
        <Editore key={packageManager.package.format} editorRef={editorRef} packageManager={packageManager} setIsValid={setIsValid} />
      )}
      <Box mt={10}>
        <Button onClick={async () => {
          toast({
            title: 'Your request has been reach to server!',
            description: "Waiting to finalization...",
            status: 'success',
            duration: 9000,
            isClosable: true,
          })
          const res = await download(packageManager!.name.toLowerCase(),
            languageVersion!,
            editorRef.current!.getValue())
          if (res.isSuccess) {
            toast({
              title: 'Package has been added',
              description: "Successfully is completed.",
              status: 'success',
              duration: 9000,
              isClosable: true,
            })
          } else {
            toast({
              title: 'Error',
              description: "",
              status: 'error',
              duration: 9000,
              isClosable: true,
            })
          }
        }} isDisabled={!!isValid} visibility={!!!packageManager ? "hidden" : "visible"}>Download</Button>
      </Box>
    </Box>
  )
}

const SinglePackageSelection = () => {
  return (
    <>
      <Box>
        <FormControl>
          <FormLabel>Package name <RequiredSpan /></FormLabel>
          <Input type='text' />
          <FormHelperText>such as Flask, React, Pandas, etc.</FormHelperText>
        </FormControl>
      </Box>
      <Box ml={5}>
        <FormControl>
          <FormLabel>Version of package <RequiredSpan /></FormLabel>
          <Input type='text' />
          <FormHelperText></FormHelperText>
        </FormControl>
      </Box>
    </>
  )
}

const RequiredSpan = () => (
  <span style={{ color: 'red', fontWeight: 'bold' }}>*</span>
)