'use client'
import { download } from '@/actions/apis';
import { Editore } from '@/components/editor';
import { FileSelection } from '@/components/file-selection';
import { RequireSpan } from '@/components/require-span';
import { SinglePackageSelection } from '@/components/single-package-selection';
import { packageManagers } from '@/consts';
import { PackageManager, MonacoEditor, Mode, Form } from '@/types';
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
  FormErrorMessage
} from '@chakra-ui/react'
import { useEffect, useRef, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const schema = z.object({
  packageManager: z.string().min(1, { message: 'Required' }),
  packageManagerVersion: z.string().min(1, { message: 'Required' }),
  packageName: z.string(),
  packageVersion: z.string(),
  groupId: z.string().default(''),
});

export default function Page() {

  const [isValid, setIsValid] = useState(false)
  const [packageManager, setPackageManager] = useState<PackageManager>()
  const [languageVersion, setLanguageVersion] = useState<string | undefined>()
  const [mode, setMode] = useState<Mode>(Mode.Single)
  const editorRef = useRef<MonacoEditor | null>(null);

  const { colorMode, toggleColorMode } = useColorMode()
  const toast = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Form>({
    resolver: zodResolver(schema),
  });
  useEffect(() => {
    if (packageManager)
      setLanguageVersion(packageManager?.package.versions[0])
  }, [packageManager])

  const onSubmit: SubmitHandler<Form> = async (data) => {
    debugger;
    toast({
      title: 'Your request has been reach to server!',
      description: "Waiting to finalization...",
      status: 'success',
      duration: 9000,
      isClosable: true,
    })

    let content = '';

    if (data.mode == Mode.Multiple) {
      content = editorRef.current!.getValue()
    }
    else {
      let packageManager = packageManagers.find(x => x.name === data.packageManager);
      content = packageManager!.package.format.replace("{PACKAGE_NAME}", data.packageName!)
        .replace("{PACKAGE_VERSION}", data.packageVersion!);
    }

    const res = await download(packageManager!.name.toLowerCase(),
      languageVersion!,
      content)
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
  }

  return (
    <form style={{ padding: 100 }} onSubmit={handleSubmit(onSubmit)}>
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
            <FormLabel>Package managers of language <RequireSpan /></FormLabel>
            <Select {...register('packageManager')} defaultValue={""} onChange={(e) => {
              setPackageManager(packageManagers.find(x => x.name === e.target.value))
            }}>
              <option value={""} disabled>Select package managers</option>
              {packageManagers.map((manager => (
                <option disabled={manager.disabled} key={manager.name} value={manager.name}>{manager.name}</option>
              )))}
            </Select>
            <FormHelperText>such as NPM, Pypi, Maven, etc.</FormHelperText>
            {errors.packageManager?.message && <FormErrorMessage>{errors.packageManager?.message}</FormErrorMessage>}
          </FormControl>
        </Box>
        {!!packageManager && (
          <Box width={100}>
            <FormControl>
              <FormLabel>Versions <RequireSpan /></FormLabel>
              <Select {...register('packageManagerVersion')} onChange={(e) => {
                setLanguageVersion(e.target.value)
              }} defaultValue={packageManager!.package.versions[0]}>
                {packageManager.package.versions.map((version => (
                  <option key={version} value={version}>{version}</option>
                )))}
              </Select>
              {errors.packageManagerVersion?.message && <FormErrorMessage>{errors.packageManagerVersion?.message}</FormErrorMessage>}
            </FormControl>
          </Box>
        )}
        {mode == Mode.Single && !!packageManager && (
          <SinglePackageSelection errors={errors} register={register} packageManager={packageManager} />
        )}
        {mode == Mode.Multiple && !!packageManager && (
          <FileSelection setPackageManager={setPackageManager} packageManager={packageManager} />
        )}
      </SimpleGrid>

      {mode == Mode.Multiple && !!packageManager && (
        <Editore key={packageManager.package.format} editorRef={editorRef} packageManager={packageManager} setIsValid={setIsValid} />
      )}
      <Box mt={10}>
        <Button type="submit" isDisabled={!!isValid} visibility={!!!packageManager ? "hidden" : "visible"}>Download</Button>
      </Box>
    </form>
  )
}
