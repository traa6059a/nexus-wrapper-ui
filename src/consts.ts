import { PackageManager } from "./types";

const packageManagers = [
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
            versions: ["17", "11", "8"],
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
] as Array<PackageManager>

export { packageManagers };