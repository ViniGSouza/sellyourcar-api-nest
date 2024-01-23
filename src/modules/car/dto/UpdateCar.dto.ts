import { PartialType } from "@nestjs/mapped-types";
import { CreateCarDTO } from "./CreateCar.dto";

export class UpdateCarDTO extends PartialType(CreateCarDTO) {}