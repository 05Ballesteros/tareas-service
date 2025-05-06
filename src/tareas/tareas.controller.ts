import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
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

    @Get(':Asignado_a')
    findByUsuario(@Param('Asignado_a') Asignado_a: string) {
        return this.tareasService.findByUsuario(Asignado_a);
    }

    // @Patch(':Id')
    // update(@Param('Id') Id: string, @Body() updateTareaDto: UpdateTareaDto) {
    //     return this.tareasService.update(Id, updateTareaDto);
    // }
}
