import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { SYNCHRONIZE_QUEUE_NAME } from '../repositories/repository.keys';

@Injectable()
export class BlockchainSynchronizeService {
    constructor(
        @InjectQueue(SYNCHRONIZE_QUEUE_NAME)
        private readonly synchronizationQueue: Queue
    ) {}

    public async synchronize() {
        await this.synchronizationQueue.add({});
    }
}
