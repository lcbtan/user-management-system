import { Type } from 'class-transformer';
import { IsBoolean, IsDecimal, IsNotEmpty, IsNumber, ValidateNested } from 'class-validator';
import { Get, JsonController } from 'routing-controllers';
import { ResponseSchema } from 'routing-controllers-openapi';

import { Tour, TourDifficulty } from '../models/Tour';
import { TourService } from '../services/TourService';
import { AppUserResponse } from './AppUserController';

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

    @IsNotEmpty()
    @IsBoolean()
    public isArchived: boolean;
}

class TourResponse extends BaseTour {
    @IsNotEmpty()
    public id: number;

    @IsNotEmpty()
    public slugName: string;

    @ValidateNested()
    @Type(() => AppUserResponse)
    public guide: AppUserResponse;
}

@JsonController('/tours')
export class TourController {
    constructor(
        private tourService: TourService
    ) { }

    @Get()
    @ResponseSchema(TourResponse, { isArray: true })
    public getAll(): Promise<Tour[]> {
        return this.tourService.findAll();
    }
}
