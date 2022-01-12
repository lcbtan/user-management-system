import { Type } from 'class-transformer';
import {
    IsAlpha, IsEnum, IsNotEmpty, IsNumber, IsUUID, Length, ValidateNested
} from 'class-validator';
import {
    Body, Delete, Get, JsonController, OnUndefined, Param, Patch, Post, QueryParams
} from 'routing-controllers';
import { ResponseSchema } from 'routing-controllers-openapi';

import { Tour, TourDifficulty } from '../models/Tour';
import { TourService } from '../services/TourService';
import { FindResourceBody, FindResourceQuery } from '../types/query';

class BaseTour {
    @Length(10, 40)
    @IsNotEmpty()
    public name: string;

    @IsNumber()
    @IsNotEmpty()
    public duration: number;

    @IsEnum(TourDifficulty)
    @IsNotEmpty()
    public difficulty: TourDifficulty;

    @IsNotEmpty()
    @IsNumber()
    public price: number;
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

class TourQueryResponseSchema {
    @IsNumber()
    public result: number;

    @ValidateNested({ each: true })
    @Type(() => TourResponse)
    public tours: TourResponse;
}

class ToursQueryResponse {
    @IsAlpha()
    public result: number;

    @ValidateNested({ each: true })
    public tours: Tour[];
}

class CreateToursBody extends BaseTour {
    @IsUUID()
    @IsNotEmpty()
    public guideId: string;
}

@JsonController('/tours')
export class TourController {
    constructor(
        private tourService: TourService
    ) { }

    @Post('/filter')
    @ResponseSchema(TourQueryResponseSchema)
    public async getFilteredTours(@QueryParams() query: FindResourceQuery, @Body() body: FindResourceBody): Promise<ToursQueryResponse> {
        const queryResults = await this.tourService.findAndFilter({ query, body });
        const res: ToursQueryResponse = {
            result: queryResults[1],
            tours: queryResults[0],
        };
        return res;
    }

    @Get('/:id')
    public async getTour(@Param('id') id: string): Promise<Tour> {
        return await this.tourService.find(id);
    }

    @Get()
    public async getAllTours(): Promise<Tour[]> {
        return await this.tourService.findAll();
    }

    @Post()
    public async createTour(@Body({ required: true }) body: CreateToursBody): Promise<Tour> {
        const tour = new Tour();
        tour.name = body.name;
        tour.duration = body.duration;
        tour.difficulty = body.difficulty;
        tour.price = body.price;
        tour.guideId = body.guideId;
        return await this.tourService.createTour(tour);
    }

    @Delete('/:id')
    @OnUndefined(204)
    public async deleteTour(@Param('id') id: string): Promise<void> {
        return await this.tourService.deleteTour(id);
    }

    @Patch('/:id')
    @OnUndefined(204)
    public async updateTour(@Param('id') id: string, @Body() body: Partial<BaseTour>): Promise<void> {
        const tour = new Tour();

        if (body.name) {
            tour.name = body.name;
        }
        if (body.duration) {
            tour.duration = body.duration;
        }
        if (body.difficulty) {
            tour.difficulty = body.difficulty;
        }
        if (body.price) {
            tour.price = body.price;
        }

        console.log(await this.tourService.updateTour(id, tour));
    }
}
