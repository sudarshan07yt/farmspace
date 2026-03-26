import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface Location {
    latitude: number;
    longitude: number;
}
export interface Solution {
    organicSolutions: string;
    causes: string;
    chemicalSolutions: string;
    preventiveMeasures: string;
    treatmentSteps: string;
}
export interface FarmingTip {
    title: string;
    content: string;
    timestamp: bigint;
    category: string;
}
export interface DiagnosisSession {
    id: bigint;
    soilType: string;
    crop: string;
    user: Principal;
    solution: Solution;
    timestamp: bigint;
    symptoms: string;
    image?: ExternalBlob;
    location: Location;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addImageToDiagnosis(diagnosisId: bigint, image: ExternalBlob): Promise<void>;
    addLocation(locationId: string, latitude: number, longitude: number): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getAllDiagnosisSessions(): Promise<Array<DiagnosisSession>>;
    getAllFarmingTips(): Promise<Array<FarmingTip>>;
    getCallerUserRole(): Promise<UserRole>;
    getDiagnosisSession(id: bigint): Promise<DiagnosisSession>;
    getDiagnosisSessionsByUser(user: Principal): Promise<Array<DiagnosisSession>>;
    getFarmingTipsByCategory(category: string): Promise<Array<FarmingTip>>;
    isCallerAdmin(): Promise<boolean>;
    submitDiagnosis(params: {
        soilType: string;
        crop: string;
        suggestion: Solution;
        locationId: string;
        symptoms: string;
    }): Promise<bigint>;
    submitFarmingTip(category: string, title: string, content: string): Promise<bigint>;
}
