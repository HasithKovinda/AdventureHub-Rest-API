import { TourRepository } from "../Repository/TourRepository";
import Tour from "../models/tour.model";

export default class RepositorySingleton {
  private static instance: TourRepository;

  private constructor() {}

  public static getTourRepositoryInstance(): TourRepository {
    if (!this.instance) {
      const tourRepository = new TourRepository(Tour);
      this.instance = tourRepository;
    }
    return this.instance;
  }
}
