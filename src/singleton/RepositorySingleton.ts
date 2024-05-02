import { ReviewRepository } from "../Repository/ReviewRepository";
import { TourRepository } from "../Repository/TourRepository";
import { UserRepository } from "../Repository/UserRepository";
import Review from "../models/review.model";
import Tour from "../models/tour.model";
import User from "../models/user.model";

export default class RepositorySingleton {
  private static tourRepositoryInstance: TourRepository;
  private static userRepositoryInstance: UserRepository;
  private static reviewRepositoryInstance: ReviewRepository;

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

  public static getReviewRepositoryInstance(): ReviewRepository {
    if (!this.reviewRepositoryInstance) {
      const reviewRepository = new ReviewRepository(Review);
      this.reviewRepositoryInstance = reviewRepository;
    }
    return this.reviewRepositoryInstance;
  }
}
