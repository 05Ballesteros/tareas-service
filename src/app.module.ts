import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TareasModule } from './tareas/tareas.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://admin:root@localhost:27017/ticketView?authSource=admin&directConnection=true'),
    TareasModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
