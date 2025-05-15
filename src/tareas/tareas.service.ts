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

    async findByEstado(estadoTarea: string, user: any): Promise<Tareas[] | null> {
        console.log("Estado:", estadoTarea);
        console.log("user", user);

        // Buscar el estado en la colección Estados
        const estado = await this.estadoModel.findOne({ Estado: { $regex: new RegExp(`^${estadoTarea}$`, 'i') } }).exec();
        console.log("Estado encontrado:", estado);

        if (!estado) {
            console.log("No se encontró el estado.");
            return null;
        }
        const tareas = await this.tareaModel
            .find({ Estado: estado._id })
            .populate([
                { path: 'Asignado_a', select: 'Nombre' },
                { path: 'Area', select: 'Area' },
                { path: 'Estado' },
                { path: 'Creado_por' }
            ])
            .exec();

        // Validar si existen tareas
        if (!tareas || tareas.length === 0) {
            console.log("No se encontró ninguna tarea.");
            return null; // Retorna null si no hay tareas
        }
        console.log("Tareas", tareas);
        return tareas; // Retorna las tareas encontradas
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
