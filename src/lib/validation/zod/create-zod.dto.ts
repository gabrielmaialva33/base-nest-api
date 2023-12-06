import { ZodSchema, ZodTypeDef } from './z';

export interface ZodDto<
  TOutput = any,
  TDef extends ZodTypeDef = ZodTypeDef,
  TInput = TOutput,
> {
  isZodDto: true;
  schema: ZodSchema<TOutput, TDef, TInput>;

  new (): TOutput;

  create(input: unknown): TOutput;
}

export function CreateZodDto<
  TOutput = any,
  TDef extends ZodTypeDef = ZodTypeDef,
  TInput = TOutput,
>(schema: ZodSchema<TOutput, TDef, TInput>) {
  class AugmentedZodDto {
    public static isZodDto = true;
    public static schema = schema;

    public static async create(input: unknown) {
      return await this.schema.parseAsync(input);
    }
  }

  return AugmentedZodDto as unknown as ZodDto<TOutput, TDef, TInput>;
}

export function isZodDto(metatype: any): metatype is ZodDto<unknown> {
  return metatype?.isZodDto;
}
