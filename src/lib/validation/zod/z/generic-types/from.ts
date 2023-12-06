import { ZodSchema, ZodTypeDef } from 'zod';

export function from<
  TOutput = any,
  TDef extends ZodTypeDef = ZodTypeDef,
  TInput = TOutput,
>(schema: ZodSchema<TOutput, TDef, TInput>): ZodSchema<TOutput, TDef, TInput> {
  return schema;
}
