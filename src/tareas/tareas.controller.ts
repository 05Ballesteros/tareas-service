import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseGuards, Req } from '@nestjs/common';
import { TareasService } from './tareas.service';
import { CreateTareaDto } from './dto/create-tarea.dto';
import { UpdateTareaDto } from './dto/update-tarea.dto';
import { RolesGuard } from 'src/auth/jwt-roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('tareas')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TareasController {
    constructor(private readonly tareasService: TareasService) { }

    @Post()
    create(@Body() createTareaDto: CreateTareaDto) {
        return this.tareasService.crearTarea(createTareaDto);
    }
    @UseGuards(RolesGuard)
    @Get()
    findAll() {
        return this.tareasService.findAll();
    }

    // @Get(':Asignado_a')
    // findByUsuario(@Param('Asignado_a') Asignado_a: string) {
    //     return this.tareasService.findByUsuario(Asignado_a);
    // }

    @Roles('Root')
    @Get(':estadoTarea')
    findByEstado(
        @Param('estadoTarea') estadoTarea: string,
        @Req() req: any, // Obtén el payload desde req.user
    ) {
        const userId = req.user.userId; // Payload del token JWT
        return this.tareasService.findByEstado(estadoTarea, userId);
    }

    @Put(':id')
    update(@Param('id') _id: string, @Body() updateTareaDto: UpdateTareaDto) {
        return this.tareasService.update(_id, updateTareaDto);
    }
}
