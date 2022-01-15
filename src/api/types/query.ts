import { Type } from 'class-transformer';
import {
  IsAlpha,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Min,
  ValidateIf,
  ValidateNested,
} from 'class-validator';

export enum SortValue {
  ASC = 'ASC',
  DESC = 'DESC',
}

export enum FilterType {
  STRING = 'STRING',
  NUMERIC = 'NUMERIC',
  // DATE = 'DATE',
}

export class SortQuery {
  @IsAlpha()
  public key: string;

  @IsEnum(SortValue)
  public value: SortValue;
}

export class SearchQuery {
  @IsAlpha()
  public key: string;

  @IsNotEmpty()
  public value: string;
}

export class StringFilterType {
  @IsNotEmpty()
  public value: string;
}

export class NumericFilterType {
  @IsNumber()
  @IsNotEmpty()
  public min: number;

  @IsNumber()
  @IsNotEmpty()
  public max: number;
}

export class FilterQuery {
  @IsAlpha()
  @IsNotEmpty()
  public key: string;

  @IsEnum(FilterType)
  public type: FilterType;

  @ValidateIf((object: FilterQuery) => object.type === FilterType.STRING)
  @Type(() => StringFilterType)
  @IsNotEmpty()
  public string: StringFilterType;

  @ValidateIf((object: FilterQuery) => object.type === FilterType.NUMERIC)
  @Type(() => NumericFilterType)
  @IsNotEmpty()
  public numeric: NumericFilterType;
}

export class FindResourceQuery {
  @Min(1)
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  public page?: number;

  @Min(1)
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  public limit?: number;
}

export class FindResourceBody {
  @IsAlpha({ each: true })
  @IsOptional()
  public fields?: string[];

  @ValidateNested({ each: true })
  @Type(() => FilterQuery)
  @IsArray()
  @IsOptional()
  public filter?: FilterQuery[];

  @ValidateNested()
  @Type(() => SearchQuery)
  @IsOptional()
  public search?: SearchQuery;

  @ValidateNested({ each: true })
  @Type(() => SortQuery)
  @IsArray()
  @IsOptional()
  public sort?: SortQuery[];
}

export interface TFindResourceOptions {
  query: FindResourceQuery;
  body: FindResourceBody;
}

export interface TQueryableFieldsTypes {
  string: string[];
  numeric: string[];
}

export interface TQueryableFields {
  search: string[];
  filter: TQueryableFieldsTypes;
  select: string[];
  sort: string[];
}
