import { Trim } from 'class-sanitizer';
import { IsBoolean, IsDecimal, IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import slug from 'slug';
import {
    BeforeInsert, BeforeUpdate, Check, Column, Entity, ManyToOne, PrimaryGeneratedColumn
} from 'typeorm';

import { AppUser } from './AppUser';

export enum TourDifficulty {
    EASY = 'easy',
    MEDIUM = 'medium',
    DIFFICULT = 'difficult',
}

@Entity()
@Check('tour_name_len', 'char_length(name) >= 10 AND char_length(name) <= 40')
export class Tour {
    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @MinLength(10, { message: 'A tour name must have more or equal to 10 characters' })
    @MaxLength(40, { message: 'A tour name must have less or equal to 40 characters' })
    @IsNotEmpty({ message: 'A tour must have a name' })
    @Trim()
    @Column({
        unique: true,
        type: 'varchar',
        length: 40,
    })
    public name: string;

    @Column({ type: 'varchar' })
    public slugName: string;

    @IsNotEmpty({ message: 'A tour must have a duration '})
    @Column()
    public duration: number;

    @IsNotEmpty({ message: 'A tour must have a difficulty' })
    @Column({
        type: 'enum',
        enum: TourDifficulty,
    })
    public difficulty: TourDifficulty;

    @IsNotEmpty({ message: 'A tour must have a price '})
    @IsDecimal()
    @Column({ type: 'decimal' })
    public price: number;

    @IsBoolean()
    @Column({ default: false })
    public isArchived: boolean;

    @ManyToOne(() => AppUser)
    public guide: AppUser;

    public toString(): string {
        return `${this.name}`;
    }

    @BeforeInsert()
    @BeforeUpdate()
    public populateSlugName(): void {
        this.slugName = slug(this.name);
    }
}
