import { Form, PackageManager } from "@/types";
import { Box, FormControl, FormLabel, Input, FormHelperText, FormErrorMessage } from "@chakra-ui/react";
import { RequireSpan } from "./require-span";
import { UseFormRegister, FieldErrors } from "react-hook-form";

export const SinglePackageSelection = ({ packageManager, register, errors }: { packageManager: PackageManager, register: UseFormRegister<Form>
  , errors: FieldErrors<Form>
}) => {
  return (
    <>
      {packageManager.name === "Maven" && (
        <Box>
          <FormControl>
            <FormLabel>Group Id <RequireSpan /></FormLabel>
            <Input {...register('groupId')} type='text' />
            <FormHelperText>such as org.springframework.boot, etc.</FormHelperText>
            {errors.groupId?.message && <FormErrorMessage>{errors.groupId?.message}</FormErrorMessage>}
          </FormControl>
        </Box>
      )}
      <Box ml={5}>
        <FormControl>
          <FormLabel>Package name <RequireSpan /></FormLabel>
          <Input {...register('packageName')}  type='text' />
          <FormHelperText>such as Flask, React, spring-boot-starter-test, etc.</FormHelperText>
          {errors.packageName?.message && <FormErrorMessage>{errors.packageName?.message}</FormErrorMessage>}
        </FormControl>
      </Box>
      <Box ml={5}>
        <FormControl>
          <FormLabel>Version of package <RequireSpan /></FormLabel>
          <Input {...register('packageVersion')} type='text' />
          <FormHelperText></FormHelperText>
          {errors.packageVersion?.message && <FormErrorMessage>{errors.packageVersion?.message}</FormErrorMessage>}
        </FormControl>
      </Box>
    </>
  )
}