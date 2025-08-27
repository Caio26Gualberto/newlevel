import { EMusicGenres } from '../gen/api/src/models/EMusicGenres';
import { PhotoResponseDto } from '../gen/api/src/models/PhotoResponseDto';
import { BandDto } from '../gen/api/src/models/BandDto';
import { EventResponseDto } from '../gen/api/src';

export enum EEventStatus {
  Draft = 0,
  Published = 1,
  InProgress = 2,
  Completed = 3,
  Cancelled = 4
}

export interface EventDto {
  id?: number;
  title: string;
  description?: string;
  dateStart: string;
  dateEnd?: string;
  location: string;
  bannerUrl?: string;
  organizerId: number;
  genre: EMusicGenres[];
  ticketsLink?: string;
  price?: number;
  capacity?: number;
  eventStatus: EEventStatus;
  bands?: BandDto[];
  photos?: PhotoResponseDto[];
  commentsCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface EventResponseDtoGenericList {
  items?: EventResponseDto[];
  totalCount?: number;
}

export interface EventResponseDtoGenericListNewLevelResponse {
  data?: EventResponseDtoGenericList;
  isSuccess?: boolean;
  message?: string;
}
