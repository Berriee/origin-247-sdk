import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { CertificateEventType } from '../../events/Certificate.events';

export const tableName = 'certificate_event';

@Entity(tableName)
export class CertificateEventEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Index()
    @Column({ nullable: false })
    internalCertificateId: number;

    @Column({ type: 'timestamptz' })
    createdAt: Date;

    @Column({ nullable: false })
    commandId: number;

    @Column({ enum: CertificateEventType })
    type: CertificateEventType;

    @Column({ default: false })
    synchronized: boolean;

    @Column({ nullable: true, type: 'text' })
    synchronizeError: string | null;

    @Column()
    version: number;

    @Column({ type: 'simple-json' })
    payload: unknown;
}
