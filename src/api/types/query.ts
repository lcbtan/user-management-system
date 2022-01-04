import { Trim } from 'class-sanitizer';
import {
    IsAlpha, IsArray, IsEnum, IsNumber, IsOptional, Length, Min, MinLength, ValidateNested
} from 'class-validator';

export enum SortValue {
    ASC = 'ASC',
    DESC = 'DESC',
}

export class SortQuery {
    @IsAlpha()
    @Trim()
    public key: string;

    @IsEnum(SortValue)
    @Trim()
    public value: SortValue;
}

export class SearchQuery {

    @IsAlpha() // TODO: assuming is alpha also check if it is not empty
    @Trim()
    public key: string;

    @Length(7)
    @MinLength(7)
    @Trim()
    public value: string;
}

export class FindResourceQuery {
    @IsNumber()
    @IsOptional()
    public page?: number;

    @ValidateNested({ each: true })
    @IsArray()
    @IsOptional()
    public sort?: SortQuery[];
}

export class FindResourceBody {
    @IsAlpha(undefined, { each: true })
    @Trim(undefined, { each: true })
    @IsOptional()
    public fields?: string[];

    @Min(0)
    @IsNumber()
    @IsOptional()
    public limit?: number;

    @ValidateNested({ each: true })
    @IsArray()
    public filter?: SearchQuery[];

    @ValidateNested()
    @IsOptional()
    public search?: SearchQuery;
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
