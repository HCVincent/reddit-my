import { atom } from "recoil";
import { Timestamp } from "firebase/firestore";

export interface Community {
    id: string;
    creatorId: string;
    numberOfMembers: number;
    privacyType: "public" | "restrictied" | "private";
    createdAt?: Timestamp;
    imageURL?: string;
}