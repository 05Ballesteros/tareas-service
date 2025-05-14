import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { TareasService } from './tareas.service';
import { CreateTareaDto } from './dto/create-tarea.dto';
import { UpdateTareaDto } from './dto/update-tarea.dto';

@Controller('tareas')
export class TareasController {
    constructor(private readonly tareasService: TareasService) { }

    @Post()
    create(@Body() createTareaDto: CreateTareaDto) {
        return this.tareasService.crearTarea(createTareaDto);
    }

    @Get()
    findAll() {
        return this.tareasService.findAll();
    }

    // @Get(':Asignado_a')
    // findByUsuario(@Param('Asignado_a') Asignado_a: string) {
    //     return this.tareasService.findByUsuario(Asignado_a);
    // }

    @Get(':estadoTarea')
    findByEstado(@Param('estadoTarea') estadoTarea: string) {
        return this.tareasService.findByEstado(estadoTarea);
    }

    @Put(':id')
    update(@Param('id') _id: string, @Body() updateTareaDto: UpdateTareaDto) {
        return this.tareasService.update(_id, updateTareaDto);
    }
}
