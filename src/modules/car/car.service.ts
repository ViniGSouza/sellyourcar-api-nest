import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/db/prisma.service";
import { CreateCarDTO } from "./dto/CreateCar.dto";
import { UpdateCarDTO } from "./dto/UpdateCar.dto";
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from "@nestjs/config";

@Injectable()
export class CarService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService
    ) {}

  private s3Client = new S3Client({
    region: this.configService.getOrThrow('AWS_S3_REGION'),
    credentials: {
      accessKeyId: this.configService.getOrThrow('AWS_S3_ACCESS_KEY'),
      secretAccessKey: this.configService.getOrThrow('AWS_S3_SECRET_KEY'),
    }
  });

  async upload(file: Buffer, fileName: string) {
    const params = {
      Bucket: this.configService.getOrThrow('AWS_S3_BUCKET'),
      Key: fileName,
      Body: file,
      ContentType: "image/jpg"
    }

    const command = new PutObjectCommand(params);
    await this.s3Client.send(command);

    const objectUrl = `https://${this.configService.getOrThrow(
      'AWS_S3_BUCKET',
    )}.s3.${this.configService.getOrThrow('AWS_S3_REGION')}.amazonaws.com/${fileName}`;

    return objectUrl;
 
  }

  async create(dataCar: CreateCarDTO) {
    const car = await this.prisma.cars.create({
      data: {
        name: dataCar.name,
        description: dataCar.description,
        value: dataCar.value,
        image_url: dataCar.image_url,
        carOwnerEmail: dataCar.carOwnerEmail,
        carOwnerPhone: dataCar.carOwnerPhone
      }
    });
    return car;
  }

  async update(id: string, newDataCar: UpdateCarDTO) {
    const carExists = await this.findById(id);
    if (!carExists) {
      throw new NotFoundException('Carro não encontrado');
    }
    const updatedCar = await this.prisma.cars.update({
      where: {
        id
      },
      data: {
        name: newDataCar?.name,
        description: newDataCar?.description,
        value: newDataCar?.value,
        image_url: newDataCar?.image_url
      }
    });
    return updatedCar;
  }

  async delete(id: string) {
    const carExists = await this.findById(id);
    if (!carExists) {
      throw new NotFoundException('Carro não encontrado');
    }
    const deletedCar = await this.prisma.cars.delete({
      where: {
        id
      }
    });
    return deletedCar;
  }

  async findAll() {
    const cars = await this.prisma.cars.findMany();
    return cars;
  }

  async findById(id: string) {
    const car = await this.prisma.cars.findUnique({
      where: {
        id
      }
    });
    if (car === null) {
      throw new NotFoundException('Carro não encontrado');
    }
    return car;
  }

  async findByOwnerEmail(email: string) {
    const cars = await this.prisma.cars.findMany({
      where: {
        carOwnerEmail: email
      }
    });
    return cars;
  }

}