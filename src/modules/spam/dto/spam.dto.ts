import { Transform } from 'class-transformer';
import { PaginationDTO } from "@src/constants/common.dto";
import { IsOptional, IsString, MaxLength } from "class-validator";

export class SearchSpamDTO extends PaginationDTO {
    @IsOptional()
    @Transform(({ value }) => value.trim())
    @IsString()
    name?: string = undefined;

    @IsOptional()
    @MaxLength(15)
    phone_no ?: string = undefined;
}

export class MarkSpamDTO {
    @IsString()
    @MaxLength(15)
    phone_no: string;
}