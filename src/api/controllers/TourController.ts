import { Type } from 'class-transformer';
import { IsDecimal, IsNotEmpty, IsNumber, ValidateNested } from 'class-validator';
import { Body, JsonController, Post, QueryParams } from 'routing-controllers';
import { ResponseSchema } from 'routing-controllers-openapi';

import { Tour, TourDifficulty } from '../models/Tour';
import { TourService } from '../services/TourService';
import { FindResourceBody, FindResourceQuery } from '../types/query';

class BaseTour {
    @IsNotEmpty()
    public name: string;

    @IsNumber()
    public duration: number;

    @IsNotEmpty()
    public difficulty: TourDifficulty;

    @IsNotEmpty()
    @IsDecimal()
    public price: number;

    // @IsNotEmpty()
    // @IsBoolean()
    // public isArchived: boolean;
}

class TourResponse extends BaseTour {
    @IsNotEmpty()
    public id: number;

    @IsNotEmpty()
    public slugName: string;

    // @ValidateNested()
    // @Type(() => AppUserResponse)
    // public guide: AppUserResponse;
}

class TourQueryResponse {
    @IsNumber()
    public result: number;

    @ValidateNested({ each: true })
    @Type(() => TourResponse)
    public tours: TourResponse;
}

@JsonController('/tours')
export class TourController {
    constructor(
        private tourService: TourService
    ) { }

    @Post()
    @ResponseSchema(TourQueryResponse)
    public async getTours(@QueryParams() query: FindResourceQuery, @Body() body: FindResourceBody): Promise<[Tour[], number]> {
        // const queryResults = await this.tourService.findAll({ query, body });
        // const res: TourQueryResponse = {
        //     result: queryResults[1],
        //     tours: queryResults[0],
        // }
        return this.tourService.findAll({ query, body });
    }
}
