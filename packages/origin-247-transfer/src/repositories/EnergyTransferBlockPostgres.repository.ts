import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    Repository,
    UpdateDateColumn,
    Column
} from 'typeorm';
import { EnergyTransferBlock } from '../EnergyTransferBlock';
import { ICreateNewCommand, EnergyTransferBlockRepository } from './EnergyTransferBlock.repository';

@Entity()
export class EnergyTransferBlockEntity implements EnergyTransferBlock {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column({ type: 'text' })
    sellerId: string;

    @Column({ type: 'text' })
    buyerId: string;

    @Column({ type: 'text' })
    volume: string;

    @Column({ type: 'int4' })
    certificateId: number;

    @Column({ type: 'boolean' })
    isCertificatePersisted: boolean;
}

@Injectable()
export class EnergyTransferBlockPostgresRepository implements EnergyTransferBlockRepository {
    constructor(
        @InjectRepository(EnergyTransferBlockEntity)
        private repository: Repository<EnergyTransferBlockEntity>
    ) {}

    public async createNew(command: ICreateNewCommand): Promise<EnergyTransferBlock> {
        const { buyerId, sellerId, volume, certificateId } = command;

        const entity = await this.repository.create({
            buyerId,
            sellerId,
            volume,
            certificateId,
            isCertificatePersisted: false
        });

        return await this.repository.save(entity);
    }
}
