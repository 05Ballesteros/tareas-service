import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTareaDto } from './dto/create-tarea.dto';
import { UpdateTareaDto } from './dto/update-tarea.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Tareas } from './schemas/tareas.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class TareasService {
    constructor(
        @InjectModel(Tareas.name) private readonly tareaModel: Model<Tareas>,
    ) { }

    async crearTarea(tareaDto: CreateTareaDto): Promise<Tareas> {
        const tareaInstance = new this.tareaModel({
            ...tareaDto,
            Estado: tareaDto.Estado ? new Types.ObjectId(tareaDto.Estado) : undefined,
            Area: tareaDto.Area ? new Types.ObjectId(tareaDto.Area) : undefined,
            Creado_por: tareaDto.Creado_por ? new Types.ObjectId(tareaDto.Creado_por) : undefined,
            Asignado_a: tareaDto.Asignado_a ? new Types.ObjectId(tareaDto.Asignado_a) : undefined,
            IdTicket: tareaDto.IdTicket ? new Types.ObjectId(tareaDto.IdTicket) : undefined,
        });

        return tareaInstance.save();
    }

    async findAll(): Promise<Tareas[]> {
        const tareas = await this.tareaModel.find().populate('Estado Area.Area Creado_por Asignado_a').exec();
        return tareas;
    }

    async findByUsuario(Asignado_a: string) {
        const tarea = await this.tareaModel.findOne({ Asignado_a: new Types.ObjectId(Asignado_a) }).exec();
        if (!tarea) {
            console.log("No se encontró ninguna tarea para el usuario.");
        }
        return tarea;
    }

    // async update(Id: string, updatetareaDto: UpdateTareaDto): Promise<Tareas> {
    //     const updateData = {
    //         ...updatetareaDto,
    //         Estado: updatetareaDto.Estado ? new Types.ObjectId(updatetareaDto.Estado) : undefined,
    //         Area: updatetareaDto.Area ? new Types.ObjectId(updatetareaDto.Area) : undefined,
    //         Creado_por: updatetareaDto.Creado_por ? new Types.ObjectId(updatetareaDto.Creado_por) : undefined,
    //         Asignado_a: updatetareaDto.Asignado_a ? new Types.ObjectId(updatetareaDto.Asignado_a) : undefined,
    //         IdTicket: updatetareaDto.IdTicket ? new Types.ObjectId(updatetareaDto.IdTicket) : undefined,
    //     };

    //     console.log(updateData);
    //     const updatedTarea = await this.tareaModel.findByIdAndUpdate(Id, updateData, { new: true }).exec();
    //     if (!updatedTarea) {
    //         throw new NotFoundException(`Cliente con ID ${Id} no encontrado`);
    //     }
        
    //     return updatedTarea;
    // }

    // remove(id: number) {
    //     return `This action removes a #${id} cliente`;
    // }
}
