import { CertificateEventEntity } from './CertificateEvent.entity';
import { CertificateEventType, ICertificateEvent } from '../../events/Certificate.events';

export interface FindOptions {
    eventId: number;
    createdAt: Date;
}

export enum CertificateEventColumns {
    Id = 'id',
    internalCertificateId = 'internalCertificateId',
    CommandId = 'commandId',
    CreatedAt = 'createdAt',
    Type = 'type',
    Version = 'version',
    Payload = 'payload'
}

export type NewCertificateEvent = Omit<CertificateEventEntity, 'id' | 'createdAt'>;

type ProcessableEventType =
    | CertificateEventType.Issued
    | CertificateEventType.Transferred
    | CertificateEventType.Claimed;

export type ProcessableEvent = CertificateEventEntity & { type: ProcessableEventType };

export interface CertificateEventRepository {
    save(event: ICertificateEvent, commandId: number): Promise<CertificateEventEntity>;

    markAsSynchronized(eventId: number): Promise<CertificateEventEntity>;

    saveProcessingError(eventId: number, error: string): Promise<CertificateEventEntity>;

    getByInternalCertificateId(internalCertId: number): Promise<CertificateEventEntity[]>;

    getAll(): Promise<CertificateEventEntity[]>;

    getNumberOfCertificates(): Promise<number>;

    getAllNotProcessed(): Promise<ProcessableEvent[]>;
}
