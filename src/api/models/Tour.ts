import { IsBoolean, IsNotEmpty, IsNumber, MaxLength, MinLength } from 'class-validator';
import slug from 'slug';
import {
    BeforeInsert, BeforeUpdate, Check, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn
} from 'typeorm';

import { TQueryableFields } from '../types/query';
import { AppUser } from './AppUser';

export enum TourDifficulty {
    EASY = 'easy',
    MEDIUM = 'medium',
    DIFFICULT = 'difficult',
}

export const TOUR_QUERY_FIELDS: TQueryableFields = {
    search: [
        'id',
        'name',
        'slugName',
        'difficulty',
        'guide',
    ],
    filter: {
        string: [
            'id',
            'name',
            'slugName',
            'difficulty',
            'guide',
        ],
        numeric: [
            'duration',
            'price',
        ],
    },
    sort: [
        'id',
        'name',
        'slugName',
        'difficulty',
        'guide',
        'duration',
        'price',
    ],
    select: [
        'id',
        'name',
        'slugName',
        'difficulty',
        'guide',
        'duration',
        'price',
    ],
};

@Entity()
@Check('tour_name_len', 'char_length(name) >= 10 AND char_length(name) <= 40')
export class Tour {
    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @MinLength(10, { message: 'A tour name must have more or equal to 10 characters' })
    @MaxLength(40, { message: 'A tour name must have less or equal to 40 characters' })
    @IsNotEmpty({ message: 'A tour must have a name' })
    @Column({
        unique: true,
        type: 'varchar',
        length: 40,
    })
    public name: string;

    @Column({ type: 'varchar' })
    public slugName: string;

    @IsNotEmpty({ message: 'A tour must have a duration '})
    @IsNumber()
    @Column()
    public duration: number;

    @IsNotEmpty({ message: 'A tour must have a difficulty' })
    @Column({
        type: 'enum',
        enum: TourDifficulty,
    })
    public difficulty: TourDifficulty;

    @IsNotEmpty({ message: 'A tour must have a price '})
    @IsNumber()
    @Column({ type: 'decimal' })
    public price: number;

    @IsBoolean()
    @Column({ default: false, select: false })
    public isArchived: boolean;

    @Column({ name: 'guide_id'})
    public guideId: string;

    @ManyToOne(() => AppUser)
    @JoinColumn({ name: 'guide_id' })
    public guide: AppUser;

    public toString(): string {
        return `${this.name}`;
    }

    @BeforeInsert()
    @BeforeUpdate()
    public populateSlugName(): void {
        if (this.name) {
            this.slugName = slug(this.name);
        }
    }
}
