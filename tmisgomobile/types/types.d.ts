import { ImageSourcePropType } from "react-native"



  interface IPinfoDataType {
    ip: string,
    hostname:string,
    city: string,
    region:string,
    country:string,
    loc:string,
    org:string,
    timezone:string,
  }

interface OTPResponse {
    isSuccess:boolean
    message:string
}

interface RegisterResponse {
    isSuccess:boolean
    message:string
    payload?:string
}


interface RegisterArtistReq {
    legalFirstName:string
    legalLastName:string
    stageName:string
    email:string
    callingCode:string
    phoneNumber:string

}

interface AddUserReq {
    legalFirstName:string
    legalLastName:string
    email:string
    userId:string

}

interface CategoryType {
    id:string
    name:string
    iconUri:string
}

interface ArtistType {
  id:string
  stageName:string
  legalFirstName:string
  legalLastName :string
  email         :string
  phoneNumber   :string
  hasSubmittedDocuments:boolean
  hasUpdatedProfile    :boolean
  isVerified          :boolean 
  isSuspended         :boolean 
  verificationImages:string[]
  profileImages:string[]
  profileVideoUrl:string
  profileDescription:string
  minimumBookingFee:number
  user:User
}



// types/prisma.d.ts

export interface Admin {
  id: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Country {
  id: string;
  name: string;
  flagUri: string;
  callingCode: string;
  currencyName: string;
  currencyCode: string;
  users: User[];
  createdAt: Date;
}

export interface User {
  _id:string
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  mobileNumber: string;
  countryId: string;
  avatarUrl ?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  iconUri: string;
  artists: ArtistAccount[];
  createdAt: Date;
}

export interface ArtistAccount {
  id: string;
  stageName: string;
  legalFirstName: string;
  legalLastName: string;
  email: string;
  hasSubmittedDocuments: boolean;
  hasUpdatedProfile: boolean;
  isVerified: boolean;
  isSuspended: boolean;
  user: User;
  userId: string;
  categoryId?: string;
  category?: Category;
  verificationImages: string[];
  profileImages: string[];
  profileVideoUrl?: string;
  profileDescription?: string;
  minimumBookingFee?: number;
  createdAt: Date;
  bookingRequests: BookingRequest[];
}

export interface UserLocation {
  id: string;
  lat: number;
  long: number;
  ip: string;
  userId: string;
  user: User;
  createdAt: Date;
  updatedAt: Date;
}

export interface Device {
  id: string;
  deviceId: string;
  fingurePrint: string;
  manufacturer: string;
  brand: string;
  isEmulator: boolean;
  installOdavoltVersion: string;
  updatedOdavoltVersion: string;
  isIOS: boolean;
  isAndroid: boolean;
  carrier: string;
  isTablet: boolean;
  ip: string;
  timeZone: string;
  userId: string;
  user: User;
  createdAt: Date;
  updatedAt: Date;
}

export interface BookingRequest {
  id: string;
  userId: string;
  artistAccountId: string;
  status: string;
  defaultMessage: string;
  createdAt: Date;
  updatedAt: Date;
  user: User;
  artistAccount: ArtistAccount;
  chats: Chat[];
  conversation?: Conversation;
}

export interface Conversation {
  id: string;
  bookingRequestId: string;
  participantsIds: string[];
  chats: Chat[];
  createdAt: Date;
  updatedAt: Date;
  bookingRequest: BookingRequest;
}

export interface Chat {
  id: string;
  bookingRequestId: string;
  conversationId: string;
  senderId: string;
  message: string;
  createdAt: Date;
  bookingRequest: BookingRequest;
  conversation: Conversation;
  sender: User;
}


//========================================
 // SAITIYO TYPES
//=======================================

interface Site {
  _id:string
  id:string
  name:string
  logoUrl:string
  status:string
  daysLeft:string
  progress:string
  notificationCount:int
}

interface User {
  _id:string
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  mobileNumber: string;
  countryId: string;
  avatarUrl ?: string;
  createdAt: Date;
  updatedAt: Date;
}