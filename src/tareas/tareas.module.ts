import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TareasController } from './tareas.controller';
import { TareasService } from './tareas.service';
import { Tareas, TareasSchema } from './schemas/tareas.schema';
import { Estado, EstadoSchema } from './schemas/estados.schema';
import { Area, AreaSchema } from './schemas/area.schema';
import { Usuario, UsuarioSchema } from './schemas/usuarios.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Usuario.name, schema: UsuarioSchema }]),
    MongooseModule.forFeature([{ name: Area.name, schema: AreaSchema }]),
    MongooseModule.forFeature([{ name: Estado.name, schema: EstadoSchema }]),
    MongooseModule.forFeature([{ name: Tareas.name, schema: TareasSchema }]),
  ],
  controllers: [TareasController],
  providers: [TareasService]
})
export class TareasModule { }
