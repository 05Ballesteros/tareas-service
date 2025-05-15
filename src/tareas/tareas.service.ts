import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTareaDto } from './dto/create-tarea.dto';
import { UpdateTareaDto } from './dto/update-tarea.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Tareas } from './schemas/tareas.schema';
import { Estado } from './schemas/estados.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class TareasService {
    constructor(
        @InjectModel(Tareas.name) private readonly tareaModel: Model<Tareas>,
        @InjectModel(Estado.name) private readonly estadoModel: Model<Estado>,
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
        const tareas = await this.tareaModel.find()
            .populate([
                { path: 'Asignado_a', select: 'Nombre' },
                { path: 'Area', select: 'Area' },
                { path: 'Estado' },
                { path: 'Creado_por' }
            ])
            .exec();
        return tareas;
    }
    // async findByUsuario(Asignado_a: string) {
    //     const tarea = await this.tareaModel.findOne({ Asignado_a: new Types.ObjectId(Asignado_a) }).exec();
    //     if (!tarea) {
    //         console.log("No se encontró ninguna tarea para el usuario.");
    //     }
    //     return tarea;
    // }

    async findByEstado(estadoTarea: string, userId: string): Promise<Tareas[] | null> {
        console.log("Estado:", estadoTarea);
        console.log("User ID:", userId);

        const userIdObjectId = new Types.ObjectId(userId);
        const estado = await this.estadoModel
            .findOne({ Estado: { $regex: new RegExp(`^${estadoTarea}$`, 'i') } })
            .exec();
        console.log("Estado encontrado:", estado);

        if (!estado) {
            console.log("No se encontró el estado.");
            return null;
        }

        // Buscar tareas relacionadas con el estado y el usuario
        const tareas = await this.tareaModel
            .find({ Estado: estado._id, Asignado_a: userIdObjectId }) // Filtro por Estado y Usuario
            .populate([
                { path: 'Asignado_a', select: 'Nombre' },
                { path: 'Area', select: 'Area' },
                { path: 'Estado' },
                { path: 'Creado_por' }
            ])
            .exec();

        if (!tareas || tareas.length === 0) {
            console.log("No se encontró ninguna tarea.");
            return null;
        }

        console.log("Tareas encontradas:", tareas);
        return tareas; 
    }

    async update(_id: string, updatetareaDto: UpdateTareaDto): Promise<Tareas> {
        const updateData = {
            ...updatetareaDto,
            Estado: updatetareaDto.Estado ? new Types.ObjectId(updatetareaDto.Estado) : undefined,
            Area: updatetareaDto.Area ? new Types.ObjectId(updatetareaDto.Area) : undefined,
            Creado_por: updatetareaDto.Creado_por ? new Types.ObjectId(updatetareaDto.Creado_por) : undefined,
            Asignado_a: updatetareaDto.Asignado_a ? new Types.ObjectId(updatetareaDto.Asignado_a) : undefined,
            IdTicket: updatetareaDto.IdTicket ? new Types.ObjectId(updatetareaDto.IdTicket) : undefined,
        };

        const updatedTarea = await this.tareaModel.findByIdAndUpdate(_id, updateData, { new: true }).exec();
        if (!updatedTarea) {
            throw new NotFoundException(`Tarea no encontrada`);
        }

        return updatedTarea;
    }

    remove(id: number) {
        return `This action removes a #${id} cliente`;
    }
}
