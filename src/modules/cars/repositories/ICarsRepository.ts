import { ICreateCarDTO } from "../dtos/ICreateCarsDTO";

interface ICarsRepository {
  create(data: ICreateCarDTO): Promise<void>;
}

export { ICarsRepository };
