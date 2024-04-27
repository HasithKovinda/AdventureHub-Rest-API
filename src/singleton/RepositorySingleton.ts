import { TourRepository } from "../Repository/TourRepository";
import { UserRepository } from "../Repository/UserRepository";
import Tour from "../models/tour.model";
import User from "../models/user.model";

export default class RepositorySingleton {
  private static tourRepositoryInstance: TourRepository;
  private static userRepositoryInstance: UserRepository;

  private constructor() {}

  public static getTourRepositoryInstance(): TourRepository {
    if (!this.tourRepositoryInstance) {
      const tourRepository = new TourRepository(Tour);
      this.tourRepositoryInstance = tourRepository;
    }
    return this.tourRepositoryInstance;
  }

  public static getUserRepositoryInstance(): UserRepository {
    if (!this.userRepositoryInstance) {
      const userRepository = new UserRepository(User);
      this.userRepositoryInstance = userRepository;
    }
    return this.userRepositoryInstance;
  }
}
