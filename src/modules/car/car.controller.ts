import { Body, Controller, Delete, Get, Param, ParseFilePipe, Post, Put, Req, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { CarService } from "./car.service";
import { CreateCarDTO } from "./dto/CreateCar.dto";
import { UpdateCarDTO } from "./dto/UpdateCar.dto";
import { JwtAuthGuard } from "../auth/auth.guard";
import { RequestUser } from "../auth/auth.strategy";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller("/cars")
export class CarController {
  constructor(private readonly carService: CarService,) {}

  @Get()
  async findAll() {
    const cars = await this.carService.findAll();
    return cars;
  }

  @Get('/mycars')
  @UseGuards(JwtAuthGuard)
  async myCars(@Req() req: RequestUser) {
    const cars = await this.carService.findByOwnerEmail(req.user.email);
    return cars;
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Body() dataCar: CreateCarDTO,
    @UploadedFile() file: Express.Multer.File,
    @Req () req: RequestUser
  ) {
    try {
      const fileName = file.originalname;
      const fileBuffer = file.buffer;

      const imageUrl = await this.carService.upload(fileBuffer, fileName);
      const car = await this.carService.create({
        ...dataCar,
        image_url: imageUrl,
        carOwnerEmail: req.user.email,
        carOwnerPhone: req.user.phone
      });
      return {
        message: "Carro criado com sucesso!",
        car: {
          id: car.id,
          name: car.name,
          description: car.description,
          value: car.value,
          image_url: car.image_url,
          carOwnerEmail: car.carOwnerEmail,
          carOwnerPhone: car.carOwnerPhone
        },
      };
    } catch (error) {
      return error;
    }
  }

  @Put("/:id")
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async update(
    @Body() newDataCar: UpdateCarDTO,
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Req () req: RequestUser) {
    const carExists = await this.carService.findById(id);
    if (carExists.carOwnerEmail === req.user.email && file) {
      try {
        const fileName = file.originalname;
        const fileBuffer = file.buffer;
  
        const imageUrl = await this.carService.upload(fileBuffer, fileName);
        await this.carService.update(id, {
          ...newDataCar,
          image_url: imageUrl
        });
        return {
          message: "Carro atualizado com sucesso!",
        };
      } catch (error) {
        return error;
      }
    } else if (carExists.carOwnerEmail === req.user.email) {
      await this.carService.update(id, newDataCar);
      return {
        message: "Carro atualizado com sucesso!",
      };
    }
    return {
      message: "Você não pode alterar o carro de outro usuário."
    }
  }

  @Delete("/:id")
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') id: string, @Req () req: RequestUser) {
    const carExists = await this.carService.findById(id);
    if (carExists.carOwnerEmail === req.user.email) {
      const car = await this.carService.delete(id);
      return {
        message: "Carro deletado com sucesso!",
        car: {
          id: car.id,
          name: car.name,
          description: car.description,
          value: car.value,
          image_url: car.image_url,
          carOwnerEmail: car.carOwnerEmail
        }
      }
    }
    return {
      message: "Você não pode deletar o carro de outro usuário."
    }
  }
}