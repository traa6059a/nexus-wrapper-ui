'use client'
import { Text, Container, Heading, Select, FormHelperText, FormControl, Box, FormLabel, SimpleGrid, Button } from '@chakra-ui/react'
import Editor, { DiffEditor, useMonaco, loader } from '@monaco-editor/react';
import { useRef, useState } from 'react';

const packageProviders = [
  {
    name: "NuGet",
    package: {
      language: "xml",
      format: `
<Project Sdk="Microsoft.Net.Sdk">
  <ItemGroup>
    <PackageReference Include="{PACKAGE_NAME}" Version="{PACKAGE_VERSION}" />
  </ItemGroup>
</Project>
      `.trim(),
      versions: ["net8.0", "net7.0", "net6.0", "net5.0"],
    }
  },
  {
    name: "NPM",
    package: {
      language: "json",
      format: `
{
    "name": "demo",
    "version": "1.0.0",
    "dependencies": {
      "{PACKAGE_NAME}": "{PACKAGE_VERSION}"
    }
  }
      `.trim(),
      versions: ["22", "20", "18"],

    }
  },
  {
    name: "Maven",
    package: {
      language: "xml",
      format: `
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <groupId>com.example</groupId>
    <artifactId>demo</artifactId>
    <version>1.0-SNAPSHOT</version>
    <dependencies>
        <dependency>
            <groupId>{PACKAGE_NAME}</groupId>
            <artifactId>{PACKAGE_ARTIFACT_ID}</artifactId>
            <version>{PACKAGE_VERSION}</version>
        </dependency>
    </dependencies>
</project>
      `.trim(),
      versions: ["22", "17", "11", "8"],
    }
  },
  {
    name: "Pypi",
    package: {
      language: "markdown",
      format: `
Flask
docker
      `.trim(),
      versions: ["3.12", "3.11", "3.10", "3.9"],

    }
  },
  {
    name: "Docker Hub",
    package: {
      language: "",
      format: "",
      versions: ["net8.0", "net7.0", "net6.0", "net5.0"],
    },
    disabled: true,
  },
  {
    name: "Helm Chart",
    package: {
      language: "yaml",
      format: "",
      versions: [],
    },
    disabled: true,
  }
] as Array<{ name: string, package: { language: string, format: string, versions: string[] }, disabled: boolean }>

export default function Page() {

  const [provider, setProvider] = useState<string>()
  const packageProvider = packageProviders.find(x => x.name == provider)
  const monacoRef = useRef(null);

  function handleEditorWillMount(monaco: any) {
    // here is the monaco instance
    // do something before editor is mounted
    monaco.languages.typescript.javascriptDefaults.setEagerModelSync(true);
  }

  function handleEditorDidMount(editor: any, monaco: any) {
    // here is another way to get monaco instance
    // you can also store it in `useRef` for further usage
    monacoRef.current = monaco;
  }

  const handleEditorValidation = (markers: any) => {
    // model markers
    markers.forEach((marker: any) => console.log('onValidate:', marker.message));
  }
  return (
    <Box p={100}>
      <Box mb={10}>
        <Heading textAlign='center' mb={10}>Nexus wrapper ui</Heading>
        <Text>
          There are many benefits to a joint design and development system.
        </Text>
      </Box>
      <SimpleGrid columns={packageProvider === undefined ? 1 : 2}>
        <Box maxW='sm'>
          <FormControl>
            <FormLabel>Package managers of language</FormLabel>
            <Select onChange={(e) => {
              setProvider(e.target.value);
            }}>
              <option selected disabled>Select provider</option>
              {packageProviders.map((provider => (
                <option disabled={provider.disabled} key={provider.name} value={provider.name}>{provider.name}</option>
              )))}
            </Select>
            <FormHelperText>such as NPM, Pypi, Maven, etc.</FormHelperText>
          </FormControl>
        </Box>
        {!!packageProvider && (
          <Box maxW='sm'>
            <FormControl>
              <FormLabel>Versions of language</FormLabel>
              <Select onChange={(e) => {
              }} defaultValue={packageProvider.package.versions[0]}>
                {packageProvider.package.versions.map((version => (
                  <option key={version} value={version}>{version}</option>
                )))}
              </Select>
            </FormControl>
          </Box>
        )}

      </SimpleGrid>
      {(!!packageProvider) && (
        <Box mt={10}>
          <FormControl>
            <FormLabel>Format of package manager</FormLabel>
            <Editor height="30vh"
              language={packageProvider!.package.language}
              value={packageProvider!.package.format}
              beforeMount={handleEditorWillMount}
              onMount={handleEditorDidMount}
            />
          </FormControl>
        </Box>
      )}
      <Box>
        <Button visibility={!!!packageProvider ? "hidden" : "visible"}>Download</Button>
      </Box>
    </Box>
  )
}