import { Type } from "class-transformer";
import { IsString, IsEmail, IsNotEmpty, IsOptional, IsMongoId, IsBoolean, IsDateString, ValidateNested } from "class-validator";

class FileDto {
    @IsString()
    @IsNotEmpty()
    name: string;
  
    @IsString()
    @IsNotEmpty()
    url: string;
  
    @IsMongoId()
    @IsNotEmpty()
    _id: string;
  }  

export class CreateTareaDto {
    @IsMongoId()
    @IsNotEmpty()
    Estado: string;

    @IsMongoId()
    @IsNotEmpty()
    Area: string;

    @IsMongoId()
    @IsNotEmpty()
    Creado_por: string;

    @IsString()
    @IsNotEmpty()
    Descripcion: string;

    @IsDateString()
    @IsOptional()
    Fecha_hora_resolucion?: string;

    @IsMongoId()
    @IsOptional()
    Asignado_a?: string;

    @ValidateNested({ each: true })
    @Type(() => FileDto)
    @IsOptional()
    Files?: FileDto[];

    @IsMongoId()
    @IsNotEmpty()
    IdTicket: string;

    @IsString()
    @IsNotEmpty()
    Id: string;
}
