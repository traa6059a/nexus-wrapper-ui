import { PackageManager } from "@/types";
import { Box, FormControl, FormLabel, Input } from "@chakra-ui/react";
import { Dispatch, SetStateAction } from "react";

export const FileSelection = ({packageManager, setPackageManager}: {packageManager: PackageManager, setPackageManager: Dispatch<SetStateAction<PackageManager | undefined>>}) => {
    return <Box>
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
        } } />
      </FormControl>
    </Box>;
  }